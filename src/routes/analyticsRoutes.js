const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

/**
 * @route   GET /api/analytics/:shopId
 * @desc    Get total scans, conversions, and 7-day trend for a specific shop
 * @access  Private (In production, add Auth Middleware here)
 */
router.get('/:shopId', analyticsController.getShopStats);

/**
 * @route   POST /api/analytics/convert/:scanId
 * @desc    Mark a scan as "Converted" when user clicks 'Pay Now'
 */
router.post('/convert/:scanId', async (req, res) => {
    try {
        const Scan = require('../models/Scan');
        await Scan.findByIdAndUpdate(req.params.scanId, { converted: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to log conversion" });
    }
});

module.exports = router;