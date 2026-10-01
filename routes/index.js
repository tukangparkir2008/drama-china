const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_BASE_URL = 'https://dramabos.live';

// Home / Feed
router.get('/', async (req, res) => {
    const provider = res.locals.selectedProvider;
    try {
        let feedUrl = `${API_BASE_URL}/${provider}/api/v1/home`;
        if (provider === 'flickreels') {
             feedUrl = `${API_BASE_URL}/flickreels/api/flickreels/trending?lang=en`;
        }
        const response = await axios.get(feedUrl);
        const data = response.data;
        res.render('index', { feedData: data, error: null });
    } catch (error) {
        console.error('Error fetching home feed:', error.message);
        res.render('index', { feedData: null, error: 'Failed to load feed' });
    }
});

// Search
router.get('/search', async (req, res) => {
    const provider = res.locals.selectedProvider;
    const query = req.query.q;

    if (!query) {
        return res.render('search', { results: null, query: '', error: null });
    }

    try {
        let searchUrl = `${API_BASE_URL}/${provider}/api/v1/search?keyword=${encodeURIComponent(query)}`;
        if (provider === 'shortmax' || provider === 'flickreels') {
            searchUrl = `${API_BASE_URL}/${provider}/api/v1/search?q=${encodeURIComponent(query)}`;
             if (provider === 'flickreels') {
                 searchUrl = `${API_BASE_URL}/flickreels/api/flickreels/search?q=${encodeURIComponent(query)}`;
             }
        }

        const response = await axios.get(searchUrl);
        res.render('search', { results: response.data, query: query, error: null });
    } catch (error) {
        console.error('Error fetching search results:', error.message);
        res.render('search', { results: null, query: query, error: 'Failed to perform search' });
    }
});

// Genre/Category
router.get('/genre', async (req, res) => {
    const type = req.query.type || 'romance';
    try {
        const url = `${API_BASE_URL}/dramabite/api/v1/genre?type=${type}`;
        const response = await axios.get(url);
        res.render('genre', { results: response.data, currentGenre: type, error: null });
    } catch (error) {
        console.error('Error fetching genre:', error.message);
        res.render('genre', { results: null, currentGenre: type, error: 'Failed to load genre' });
    }
});

// Drama Detail
router.get('/drama/:id', async (req, res) => {
    const provider = res.locals.selectedProvider;
    const id = req.params.id;

    try {
        let detailUrl = `${API_BASE_URL}/${provider}/api/v1/detail/${id}`;
        let episodesUrl = `${API_BASE_URL}/${provider}/api/v1/episodes/${id}`;

        if (provider === 'flickreels') {
             episodesUrl = `${API_BASE_URL}/flickreels/api/flickreels/allepisode?id=${id}`;
        }

        const [detailResponse, episodesResponse] = await Promise.all([
            axios.get(detailUrl).catch(() => ({ data: null })),
            axios.get(episodesUrl).catch(() => ({ data: null }))
        ]);

        res.render('detail', {
            dramaData: detailResponse.data,
            episodesData: episodesResponse.data,
            dramaId: id,
            error: null
        });
    } catch (error) {
        console.error('Error fetching drama details:', error.message);
        res.render('detail', { dramaData: null, episodesData: null, dramaId: id, error: 'Failed to load details' });
    }
});

// Streaming/Player API
router.get('/play/:id/:ep', async (req, res) => {
    const provider = res.locals.selectedProvider;
    const id = req.params.id;
    const ep = req.params.ep;

    try {
        // Fetch only episodes list here, stream resolving is handled fully by frontend for all episodes
        let episodesUrl = `${API_BASE_URL}/${provider}/api/v1/episodes/${id}`;
        if (provider === 'flickreels') {
             episodesUrl = `${API_BASE_URL}/flickreels/api/flickreels/allepisode?id=${id}`;
        }

        const episodesResponse = await axios.get(episodesUrl);

        res.render('player', {
            episodesData: episodesResponse.data,
            dramaId: id,
            currentEp: ep,
            error: null
        });
    } catch (error) {
         console.error('Error fetching episodes for player:', error.message);
         res.render('player', { episodesData: null, dramaId: id, currentEp: ep, error: 'Failed to load episodes for playback' });
    }
});

// API Status
router.get('/status', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/status`);
        res.render('status', { statusData: response.data, error: null });
    } catch (error) {
        console.error('Error fetching status:', error.message);
        res.render('status', { statusData: null, error: 'Failed to load status' });
    }
});

module.exports = router;
