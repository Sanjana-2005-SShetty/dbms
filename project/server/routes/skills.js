import express from 'express';
import { query } from '../config/database.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/skills
// @desc    Get all unique skills in the system
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Get unique skills
    const projectSkills = await query(`
      SELECT DISTINCT skill FROM project_skills
      UNION
      SELECT DISTINCT skill FROM user_skills
      ORDER BY skill
    `);
    
    const skills = projectSkills.map(s => s.skill);
    
    res.json(skills);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;