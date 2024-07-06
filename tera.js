const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

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
                let reply = 'Download links:\n\n';
                data.forEach(item => {
                    reply += `File Name: ${item.server_filename}\n`;
                    reply += `Download link: ${item.dlink}\n\n`;
                });
                bot.sendMessage(chatId, reply);
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
