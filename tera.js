const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Ganti dengan token bot Anda
const token = '7243525886:AAHcEplWXr49MCOYfqgHvdPdeOI24YK_1D8';
const bot = new TelegramBot(token, {polling: true});

// Event handler untuk perintah /download
bot.onText(/\/download (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const url = match[1]; // URL yang dikirim oleh pengguna setelah perintah /download

    const apiUrl = 'https://teradownloader.com/api/application';
    const headers = {
        'key': 'cmXUOel6tUs5gi2JO7snDtcDRWC7iaBz',
        'content-type': 'application/json; charset=utf-8',
        'accept-encoding': 'gzip',
        'user-agent': 'okhttp/5.0.0-alpha.10'
    };
    const payload = {
        'url': url
    };

    axios.post(apiUrl, payload, { headers: headers })
        .then(response => {
            if (response.status === 200) {
                const data = response.data;
                data.forEach((item, index) => {
                    const fileName = item.server_filename;
                    const downloadUrl = item.dlink;
                    const filePath = path.join(__dirname, fileName);

                    // Unduh file dan simpan ke local storage
                    axios({
                        url: downloadUrl,
                        method: 'GET',
                        responseType: 'stream'
                    }).then(res => {
                        const writer = fs.createWriteStream(filePath);
                        res.data.pipe(writer);

                        writer.on('finish', () => {
                            // Kirim file ke pengguna setelah selesai diunduh
                            bot.sendDocument(chatId, filePath)
                                .then(() => {
                                    // Hapus file setelah dikirim
                                    fs.unlinkSync(filePath);
                                })
                                .catch(error => {
                                    bot.sendMessage(chatId, `Error sending file: ${error.message}`);
                                });
                        });

                        writer.on('error', err => {
                            bot.sendMessage(chatId, `Error downloading file: ${err.message}`);
                        });
                    }).catch(error => {
                        bot.sendMessage(chatId, `Error: ${error.message}`);
                    });
                });
            } else {
                bot.sendMessage(chatId, `Failed with status code: ${response.status}`);
            }
        })
        .catch(error => {
            bot.sendMessage(chatId, `Error: ${error.message}`);
        });
});

// Menangani perintah lain atau pesan yang tidak dikenali
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (!msg.text.startsWith('/download ')) {
        bot.sendMessage(chatId, 'Please use the /download command followed by the URL.');
    }
});
