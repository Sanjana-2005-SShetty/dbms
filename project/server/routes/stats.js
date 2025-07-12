import express from 'express';
import { query } from '../config/database.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/stats
// @desc    Get platform statistics
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Get stats
    const [projectCountResult] = await query('SELECT COUNT(*) as count FROM projects');
    const [userCountResult] = await query('SELECT COUNT(*) as count FROM users');
    const [matchCountResult] = await query(`
      SELECT COUNT(*) as count FROM applications WHERE status = 'accepted'
    `);
    
    res.json({
      projectCount: projectCountResult.count,
      userCount: userCountResult.count,
      matchCount: matchCountResult.count
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;