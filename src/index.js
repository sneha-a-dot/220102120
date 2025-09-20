// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Url = require('./models/Url');
const Log = require('./middleware/log');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Generate random shortcode helper
function generateShortcode(length = 6) {
  let result = '';
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

app.post('/api/shorten', async (req, res) => {
  try {
    const { originalUrl, validity } = req.body;
    if (!originalUrl) {
      await Log('backend', 'error', 'API', 'Missing originalUrl');
      return res.status(400).json({ error: 'Original URL is required' });
    }
    const expireMinutes = validity || 30;
    let code;
    let exists;

    // Keep generating until unique (in rare case of collision)
    do {
      code = generateShortcode();
      exists = await Url.findOne({ shortcode: code });
    } while (exists);

    const expiresAt = new Date(Date.now() + expireMinutes * 60000);
    const newUrl = new Url({ originalUrl, shortcode: code, expiresAt });
    await newUrl.save();

    await Log('backend', 'info', 'API', `Created shortcode ${code} for ${originalUrl}`);

    res.json({ shortcode: code, expiresAt });
  } catch (err) {
    await Log('backend', 'fatal', 'API', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
