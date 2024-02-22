const axios = require("axios");

const platformAPIClient = axios.create({
  baseURL: process.env.PLATFORM_API_URL,
  timeout: 20000,
  headers: {
    Authorization: `Key ${process.env.PI_API_KEY}`,
  },
});

module.exports = platformAPIClient;
