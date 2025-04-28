import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Users, Layers, PlusCircle, Award, TrendingUp } from 'lucide-react';
import SkillTag from '../components/SkillTag.jsx';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    projectCount: 0,
    userCount: 0,
    matchCount: 0
  });
  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, recommendationsRes, userRes] = await Promise.all([
          axios.get('http://localhost:5000/api/stats'),
          axios.get('http://localhost:5000/api/projects/recommended'),
          axios.get('http://localhost:5000/api/users/me')
        ]);
        
        setStats(statsRes.data);
        setRecommendedProjects(recommendationsRes.data);
        setSkills(userRes.data.skills || []);
      } catch (error) {
        toast.error('Failed to load dashboard data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your SkillMatcher dashboard</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-primary-500 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-primary-100 text-sm font-medium">Total Projects</p>
              <p className="text-4xl font-bold mt-2">{stats.projectCount}</p>
            </div>
            <div className="p-3 bg-primary-400 rounded-lg">
              <Layers size={24} />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/projects" className="text-primary-100 hover:text-white transition-colors text-sm font-medium flex items-center">
              View all projects
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
        
        <div className="card bg-secondary-500 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-secondary-100 text-sm font-medium">Total Users</p>
              <p className="text-4xl font-bold mt-2">{stats.userCount}</p>
            </div>
            <div className="p-3 bg-secondary-400 rounded-lg">
              <Users size={24} />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/profile" className="text-secondary-100 hover:text-white transition-colors text-sm font-medium flex items-center">
              View your profile
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
        
        <div className="card bg-accent-500 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-accent-100 text-sm font-medium">Successful Matches</p>
              <p className="text-4xl font-bold mt-2">{stats.matchCount}</p>
            </div>
            <div className="p-3 bg-accent-400 rounded-lg">
              <Award size={24} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-accent-100 text-sm font-medium flex items-center">
              Growing every day
              <TrendingUp className="h-4 w-4 ml-1" />
            </span>
          </div>
        </div>
      </div>
      
      {/* Your Skills */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Skills</h2>
          <Link to="/profile" className="btn btn-outline btn-sm">
            Update Skills
          </Link>
        </div>
        
        {skills.length > 0 ? (
          <div className="flex flex-wrap">
            {skills.map((skill, index) => (
              <SkillTag key={index} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">You haven't added any skills yet.</p>
            <Link to="/profile" className="btn btn-primary mt-4">
              Add Skills
            </Link>
          </div>
        )}
      </div>
      
      {/* Recommended Projects */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recommended Projects</h2>
          <Link to="/projects/new" className="btn btn-primary btn-sm flex items-center gap-1">
            <PlusCircle size={16} />
            <span>Create Project</span>
          </Link>
        </div>
        
        {recommendedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProjects.map((project) => (
              <div key={project.id} className="card hover:scale-105 transition-transform">
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{project.description.substring(0, 100)}...</p>
                
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
                  <div className="flex flex-wrap">
                    {project.requiredSkills.map((skill, index) => (
                      <SkillTag key={index} skill={skill} />
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {project.teamSize} team members needed
                  </span>
                  <Link to={`/projects/${project.id}`} className="btn btn-primary btn-sm">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <Layers className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No recommended projects yet</h3>
            <p className="mt-1 text-gray-500">Check back later or create your own project!</p>
            <div className="mt-6">
              <Link to="/projects/new" className="btn btn-primary flex items-center gap-2 mx-auto w-max">
                <PlusCircle size={18} />
                <span>Create Project</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;