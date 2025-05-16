const fs = require('fs');
const path = require('path');
require('dotenv').config();

const proxy = {
  '/auth': {
    target: process.env.AUTH_API,
    secure: false
  },
  '/api': {
    target: process.env.MAIN_API,
    secure: false,
    changeOrigin: true
  }
};

fs.writeFileSync(
  path.resolve(__dirname, '../proxy.conf.json'),
  JSON.stringify(proxy, null, 2)
);

console.log('✅ Arquivo proxy.conf.json gerado com sucesso!');
