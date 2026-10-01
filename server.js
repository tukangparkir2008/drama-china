const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse query and body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default API Base URL
const API_BASE_URL = process.env.DRAMABOS_API_URL || 'https://dramabos.live';

// Available providers (42 total as per documentation)
const providers = [
  { slug: 'starshort', name: 'StarShort' },
  { slug: 'dramabite', name: 'DramaBite' },
  { slug: 'freereels', name: 'FreeReels' },
  { slug: 'fundrama', name: 'FunDrama' },
  { slug: 'microdrama', name: 'MicroDrama' },
  { slug: 'vigloo', name: 'Vigloo' },
  { slug: 'bilitv', name: 'BiliTV' },
  { slug: 'dramabox', name: 'DramaBox' },
  { slug: 'dramawave', name: 'DramaWave' },
  { slug: 'netshort', name: 'NetShort' },
  { slug: 'idrama', name: 'iDrama' },
  { slug: 'shortmax', name: 'ShortMax' },
  { slug: 'goodshort', name: 'GoodShort' },
  { slug: 'melolo', name: 'Melolo' },
  { slug: 'velolo', name: 'Velolo' },
  { slug: 'reelshort', name: 'ReelShort' },
  { slug: 'flickreels', name: 'FlickReels' },
  { slug: 'stardusttv', name: 'Stardusttv' },
  { slug: 'serialplus', name: 'Serial+' },
  { slug: 'dotdrama', name: 'DotDrama' },
  { slug: 'rapidtv', name: 'RapidTV' },
  { slug: 'shortswave', name: 'ShortsWave' },
  { slug: 'dramanova', name: 'DramaNova' },
  { slug: 'cubetv', name: 'CubeTV' },
  { slug: 'reelbuzz', name: 'ReelBuzz' },
  { slug: 'flareflow', name: 'FlareFlow' },
  { slug: 'moboreels', name: 'MoboReels' },
  { slug: 'happyshort', name: 'HappyShort' },
  { slug: 'reelife', name: 'Reelife' },
  { slug: 'pinedrama', name: 'PineDrama' },
  { slug: 'flextv', name: 'FlexTV' },
  { slug: 'reelala', name: 'Reelala' },
  { slug: 'anyreel', name: 'Anyreel' },
  { slug: 'raptdrama', name: 'RaptDrama' },
  { slug: 'bonustv', name: 'BonusTV' },
  { slug: 'minitv', name: 'MiniTV' },
  { slug: 'golddrama', name: 'Gold Drama' },
  { slug: 'iqiyi', name: 'IQIYI' },
  { slug: 'bstation', name: 'Bstation' },
  { slug: 'joyreels', name: 'Joyreels' },
  { slug: 'kalostv', name: 'KalosTV' },
  { slug: 'vibeshort', name: 'Vibeshort' }
];

// Global middleware to handle provider selection
app.use((req, res, next) => {
  // Check if provider is set in query
  let selectedProvider = req.query.provider || 'shortmax'; // default provider

  // Expose to views
  res.locals.providers = providers;
  res.locals.selectedProvider = selectedProvider;
  res.locals.API_BASE_URL = API_BASE_URL;

  next();
});

// Import Routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
