const Scan = require('../models/Scan');
const mongoose = require('mongoose');

exports.getShopStats = async (req, res) => {
  try {
    const { shopId } = req.params;
    const objectId = new mongoose.Types.ObjectId(shopId);

    // 1. Get Total Scans & Conversion Rate
    const stats = await Scan.aggregate([
      { $match: { shopId: objectId } },
      {
        $group: {
          _id: null,
          totalScans: { $sum: 1 },
          conversions: { $sum: { $cond: ["$converted", 1, 0] } },
          uniqueDevices: { $addToSet: "$device.os" } // Simplified uniqueness
        }
      }
    ]);

    // 2. Get Daily Scan Trend (Last 7 Days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const dailyTrend = await Scan.aggregate([
      { $match: { shopId: objectId, timestamp: { $gte: lastWeek } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      summary: stats[0] || { totalScans: 0, conversions: 0 },
      dailyTrend
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};