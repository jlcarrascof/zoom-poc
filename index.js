// server.js
const express = require('express');
const { getMeetings } = require('./services/zoomService');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.get('/zoom/meetings', async (req, res) => {
  try {
    const data = await getMeetings();
    res.json(data);
  } catch (error) {
    console.error('Error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Zoom API call failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
