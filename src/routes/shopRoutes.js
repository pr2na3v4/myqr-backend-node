const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const trackScan = require('../middleware/trackScan');

// Public Landing Page: trackScan runs BEFORE getPublicLandingData
router.get('/landing/:slug', trackScan, shopController.getPublicLandingData);

module.exports = router;