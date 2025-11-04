import express from 'express';
import { config } from 'dotenv';


config();
const app = express();

app.get('/', async (req, res) => {
  const { code } = req.query;
  if(!code) return res.status(400).send('No code received.');

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
      redirect_uri: 'http://localhost:3000/',
      code
    })
  });
  if(!response.ok) return res.status(response.status).send('Error fetching access token.');

  const data = await response.json();
  res.status(200).json(data);

});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
  console.log('Please navigate to the following URL to authorize:');
  console.log(`https://anilist.co/api/v2/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=http://localhost:3000/&response_type=code`);
});