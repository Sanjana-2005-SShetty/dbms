import express from 'express';
import { query } from '../config/database.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const users = await query('SELECT id, name, email, created_at FROM users WHERE id = ?', [req.user.id]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = users[0];
    
    // Get user skills
    const skills = await query('SELECT skill FROM user_skills WHERE user_id = ?', [user.id]);
    user.skills = skills.map(s => s.skill);
    
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/users/me
// @desc    Update current user
// @access  Private
router.put('/me', auth, async (req, res) => {
  const { name, skills } = req.body;
  
  try {
    // Update user name
    await query('UPDATE users SET name = ? WHERE id = ?', [name, req.user.id]);
    
    // Update skills
    if (skills) {
      // Delete existing skills
      await query('DELETE FROM user_skills WHERE user_id = ?', [req.user.id]);
      
      // Add new skills
      if (skills.length > 0) {
        const skillValues = skills.map(skill => [req.user.id, skill]);
        await query(
          'INSERT INTO user_skills (user_id, skill) VALUES ?',
          [skillValues]
        );
      }
    }
    
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/users/applications
// @desc    Get user's applications
// @access  Private
router.get('/applications', auth, async (req, res) => {
  try {
    const applications = await query(`
      SELECT a.id, a.project_id, p.name AS projectName, a.status, a.created_at
      FROM applications a
      JOIN projects p ON a.project_id = p.id
      WHERE a.user_id = ?
      ORDER BY a.created_at DESC
    `, [req.user.id]);
    
    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/users/projects
// @desc    Get user's projects
// @access  Private
router.get('/projects', auth, async (req, res) => {
  try {
    const projects = await query(`
      SELECT p.id, p.name, p.team_size as teamSize,
        (SELECT COUNT(*) FROM project_team WHERE project_id = p.id) as teamCount
      FROM projects p
      WHERE p.owner_id = ?
      ORDER BY p.created_at DESC
    `, [req.user.id]);
    
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;