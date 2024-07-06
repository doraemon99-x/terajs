# Gunakan image resmi Node.js sebagai base image
FROM node:14

# Tentukan direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json ke direktori kerja
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file dari direktori proyek lokal ke direktori kerja di dalam container
COPY . .

# Ekspose port yang akan digunakan
EXPOSE 3000

# Perintah untuk menjalankan aplikasi saat container di-start
CMD [ "node", "tera.js" ]
