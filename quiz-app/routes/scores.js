const express = require('express');
const Score = require('../models/Score');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// POST /submit-score
router.post('/submit-score', async (req, res) => {
  try {
    const { name, score, total } = req.body;
    if (!name || score === undefined || !total)
      return res.status(400).json({ error: 'Missing fields' });

    const saved = await Score.create({ name: name.trim(), score, total });
    res.status(201).json(saved);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /leaderboard — top 10
router.get('/leaderboard', async (req, res) => {
  try {
    const top = await Score.find()
      .sort({ score: -1, createdAt: 1 })
      .limit(10)
      .select('name score total createdAt')
      .lean();
    res.json(top);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /admin/stats
router.get('/admin/stats', authMiddleware, async (req, res) => {
  try {
    const totalAttempts = await Score.countDocuments();
    const uniqueUsers = await Score.distinct('name');
    const totalUsers = uniqueUsers.length;
    const agg = await Score.aggregate([{ $group: { _id: null, avg: { $avg: '$score' } } }]);
    const averageScore = agg[0] ? Math.round(agg[0].avg * 100) / 100 : 0;
    res.json({ totalAttempts, totalUsers, averageScore });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
