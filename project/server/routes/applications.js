import express from 'express';
import { query } from '../config/database.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   DELETE api/applications/:id
// @desc    Withdraw an application
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if application exists and belongs to user
    const applications = await query(`
      SELECT * FROM applications
      WHERE id = ? AND user_id = ?
    `, [req.params.id, req.user.id]);
    
    if (applications.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Delete application
    await query('DELETE FROM applications WHERE id = ?', [req.params.id]);
    
    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;