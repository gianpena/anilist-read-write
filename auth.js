import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import { updateProgress } from './UpdateProgress.js';
import { lookForAnime } from './LookForAnime.js';
import https from 'https';
import fs from 'fs';

const allowedOrigins = [
  'https://www.aniwave.se'
];

config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: allowedOrigins
}));

let access_token = process.env.ACCESS_TOKEN || '';

// Load SSL certificate and key
const sslOptions = {
  key: fs.readFileSync('./ssl/private-key.pem'),
  cert: fs.readFileSync('./ssl/certificate.pem')
};

app.get('/', async (req, res) => {
  const { code } = req.query;
  if(!code) return res.status(400).send('No code received.');

  try{
    const response = await fetch('https://anilist.co/api/v2/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: 'https://localhost/', // Update to https
        code
      })
    });
    if(!response.ok) return res.status(response.status).send('Error fetching access token.');

    const data = await response.json();
    access_token = data.access_token;
    return res.status(200).json(data);
  } catch( error  ) {
    return res.status(500).json({ error: error.message });
  }

});

app.post('/update', async (req, res) => {
  const { animeName, progress } = req.body;
  if(!access_token) return res.status(401).send('Unauthorized: No access token.');

  try {
    const animeId = await lookForAnime(animeName);
    if(!animeId) return res.status(404).send('Anime not found. Check the name and try again.');
    const result = await updateProgress(parseInt(animeId), parseInt(progress), access_token);
    if(!result.success) {
      return res.status(result.status).json(result);
    }
    return res.status(result.status).json(result);
  } catch( error ) {
    return res.status(500).json(result);
  }
});

// Start HTTPS server on port 443
https.createServer(sslOptions, app).listen(443, () => {
  console.log('HTTPS server is running on https://localhost');
  if(access_token) {
    const shownToken = access_token.length > 20 ? access_token.slice(0, 20) + '...' : access_token;
    console.log('Access token currently set to: ', shownToken);
  } else {
    console.log('Please navigate to the following URL to authorize:');
    console.log(`https://anilist.co/api/v2/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=https://localhost/&response_type=code`);
  }
});
