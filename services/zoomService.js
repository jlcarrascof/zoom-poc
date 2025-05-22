// services/zoomService.js
const axios = require('axios');
require('dotenv').config();

const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;

async function getAccessToken() {
  const tokenUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`;
  const credentials = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64');

  const response = await axios.post(tokenUrl, null, {
    headers: {
      Authorization: `Basic ${credentials}`
    }
  });

  return response.data.access_token;
}

async function getMeetings() {
  const token = await getAccessToken();
  const response = await axios.get(`https://api.zoom.us/v2/users/me/meetings`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}

module.exports = {
  getAccessToken,
  getMeetings
};
