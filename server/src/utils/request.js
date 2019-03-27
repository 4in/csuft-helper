const axios = require('axios');
const instance = axios.create({
  timeout: 10000,
  validateStatus: () => true,
  withCredentials: true
});

module.exports = instance;