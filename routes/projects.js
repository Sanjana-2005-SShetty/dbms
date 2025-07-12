import express from 'express';
import { v4 as uuidv4 } from 'uuid';

import { query } from '../config/database.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/projects
// @desc    Create a project
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, description, teamSize, requiredSkills } = req.body;
  
  try {
    // Generate unique ID
    const projectId = uuidv4();
    
    // Create project
    await query(
      'INSERT INTO projects (id, name, description, team_size, owner_id) VALUES (?, ?, ?, ?, ?)',
      [projectId, name, description, teamSize, req.user.id]
    );
    
    // Add owner to project team
    await query(
      'INSERT INTO project_team (project_id, user_id) VALUES (?, ?)',
      [projectId, req.user.id]
    );
    
    // Add required skills
    if (requiredSkills && requiredSkills.length > 0) {
      const skillValues = requiredSkills.map(skill => [projectId, skill]);
      await query(
        'INSERT INTO project_skills (project_id, skill) VALUES ?',
        [skillValues]
      );
    }
    
    res.status(201).json({ id: projectId, message: 'Project created successfully' });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/projects
// @desc    Get all projects
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const projects = await query(`
      SELECT p.id, p.name, p.description, p.team_size AS teamSize, 
        p.owner_id AS ownerId, u.name AS ownerName, p.created_at AS createdAt
      FROM projects p
      JOIN users u ON p.owner_id = u.id
      ORDER BY p.created_at DESC
    `);
    
    // Get required skills for each project
    for (const project of projects) {
      const skills = await query(
        'SELECT skill FROM project_skills WHERE project_id = ?',
        [project.id]
      );
      
      project.requiredSkills = skills.map(s => s.skill);
    }
    
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/projects/recommended
// @desc    Get recommended projects based on user skills
// @access  Private
router.get('/recommended', auth, async (req, res) => {
  try {
    // Get user skills
    const userSkills = await query(
      'SELECT skill FROM user_skills WHERE user_id = ?',
      [req.user.id]
    );
    
    const skills = userSkills.map(s => s.skill);
    
    if (skills.length === 0) {
      // If user has no skills, just return some recent projects
      const recentProjects = await query(`
        SELECT p.id, p.name, p.description, p.team_size AS teamSize, 
          p.owner_id AS ownerId, u.name AS ownerName, p.created_at AS createdAt
        FROM projects p
        JOIN users u ON p.owner_id = u.id
        WHERE p.owner_id != ?
        ORDER BY p.created_at DESC
        LIMIT 6
      `, [req.user.id]);
      
      // Get required skills for each project
      for (const project of recentProjects) {
        const projectSkills = await query(
          'SELECT skill FROM project_skills WHERE project_id = ?',
          [project.id]
        );
        
        project.requiredSkills = projectSkills.map(s => s.skill);
      }
      
      return res.json(recentProjects);
    }
    
    // Find projects that require at least one of the user's skills
    // and that the user is not already part of
    const recommendedProjects = await query(`
      SELECT DISTINCT p.id, p.name, p.description, p.team_size AS teamSize, 
        p.owner_id AS ownerId, u.name AS ownerName, p.created_at AS createdAt
      FROM projects p
      JOIN users u ON p.owner_id = u.id
      JOIN project_skills ps ON p.id = ps.project_id
      WHERE ps.skill IN (${skills.map(() => '?').join(',')})
      AND p.id NOT IN (
        SELECT project_id FROM project_team WHERE user_id = ?
      )
      AND p.owner_id != ?
      ORDER BY p.created_at DESC
      LIMIT 6
    `, [...skills, req.user.id, req.user.id]);
    
    // Get required skills for each project
    for (const project of recommendedProjects) {
      const projectSkills = await query(
        'SELECT skill FROM project_skills WHERE project_id = ?',
        [project.id]
      );
      
      project.requiredSkills = projectSkills.map(s => s.skill);
    }
    
    res.json(recommendedProjects);
  } catch (error) {
    console.error('Get recommended projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/projects/:id
// @desc    Get project by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const projects = await query(`
      SELECT p.id, p.name, p.description, p.team_size AS teamSize, 
        p.owner_id AS ownerId, u.name AS ownerName, p.created_at AS createdAt
      FROM projects p
      JOIN users u ON p.owner_id = u.id
      WHERE p.id = ?
    `, [req.params.id]);
    
    if (projects.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const project = projects[0];
    
    // Get required skills
    const skills = await query(
      'SELECT skill FROM project_skills WHERE project_id = ?',
      [project.id]
    );
    
    project.requiredSkills = skills.map(s => s.skill);
    
    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/projects/:id/team
// @desc    Get project team
// @access  Private
router.get('/:id/team', auth, async (req, res) => {
  try {
    const team = await query(`
      SELECT u.id, u.name, pt.joined_at AS joinedAt
      FROM project_team pt
      JOIN users u ON pt.user_id = u.id
      WHERE pt.project_id = ?
    `, [req.params.id]);
    
    // Get skills for each team member
    for (const member of team) {
      const skills = await query(
        'SELECT skill FROM user_skills WHERE user_id = ?',
        [member.id]
      );
      
      member.skills = skills.map(s => s.skill);
    }
    
    res.json(team);
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/projects/:id/match
// @desc    Get match score between user and project
// @access  Private
router.get('/:id/match', auth, async (req, res) => {
  try {
    // Get user skills
    const userSkills = await query(
      'SELECT skill FROM user_skills WHERE user_id = ?',
      [req.user.id]
    );
    
    const userSkillList = userSkills.map(s => s.skill.toLowerCase());
    
    // Get project required skills
    const projectSkills = await query(
      'SELECT skill FROM project_skills WHERE project_id = ?',
      [req.params.id]
    );
    
    const projectSkillList = projectSkills.map(s => s.skill.toLowerCase());
    
    if (projectSkillList.length === 0) {
      return res.json({ matchScore: 0 });
    }
    
    // Calculate match score (percentage of project skills the user has)
    let matchCount = 0;
    
    for (const skill of projectSkillList) {
      if (userSkillList.includes(skill)) {
        matchCount++;
      }
    }
    
    const matchScore = Math.round((matchCount / projectSkillList.length) * 100);
    
    res.json({ matchScore });
  } catch (error) {
    console.error('Get match score error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/projects/:id/application
// @desc    Check if user has applied to project
// @access  Private
router.get('/:id/application', auth, async (req, res) => {
  try {
    const applications = await query(`
      SELECT id, status FROM applications
      WHERE project_id = ? AND user_id = ?
    `, [req.params.id, req.user.id]);
    
    res.json({
      hasApplied: applications.length > 0,
      application: applications[0] || null
    });
  } catch (error) {
    console.error('Check application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/projects/:id/apply
// @desc    Apply to a project
// @access  Private
router.post('/:id/apply', auth, async (req, res) => {
  try {
    // Check if project exists
    const projects = await query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    
    if (projects.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is already in the team
    const teamMembers = await query(`
      SELECT * FROM project_team
      WHERE project_id = ? AND user_id = ?
    `, [req.params.id, req.user.id]);
    
    if (teamMembers.length > 0) {
      return res.status(400).json({ message: 'You are already in this project team' });
    }
    
    // Check if user has already applied
    const applications = await query(`
      SELECT * FROM applications
      WHERE project_id = ? AND user_id = ?
    `, [req.params.id, req.user.id]);
    
    if (applications.length > 0) {
      return res.status(400).json({ message: 'You have already applied to this project' });
    }
    
    // Create application
    await query(`
      INSERT INTO applications (project_id, user_id)
      VALUES (?, ?)
    `, [req.params.id, req.user.id]);
    
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Apply to project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is the project owner
    const projects = await query(
      'SELECT * FROM projects WHERE id = ? AND owner_id = ?',
      [req.params.id, req.user.id]
    );
    
    if (projects.length === 0) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }
    
    // Delete project (will cascade delete skills, team, and applications)
    await query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;