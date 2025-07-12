import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ChevronLeft, Edit, Trash2, Users, Calendar, Star } from 'lucide-react';
import SkillTag from '../components/SkillTag.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [matchScore, setMatchScore] = useState(0);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const [projectRes, teamRes, matchRes, applicationRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/projects/${id}`),
          axios.get(`http://localhost:5000/api/projects/${id}/team`),
          axios.get(`http://localhost:5000/api/projects/${id}/match`),
          axios.get(`http://localhost:5000/api/projects/${id}/application`)
        ]);
        
        setProject(projectRes.data);
        setTeamMembers(teamRes.data);
        setMatchScore(matchRes.data.matchScore || 0);
        setHasApplied(applicationRes.data.hasApplied || false);
        setIsOwner(projectRes.data.ownerId === user.id);
      } catch (error) {
        toast.error('Failed to load project details');
        console.error(error);
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectDetails();
  }, [id, user.id, navigate]);
  
  const handleApply = async () => {
    setApplying(true);
    
    try {
      await axios.post(`http://localhost:5000/api/projects/${id}/apply`);
      toast.success('Application submitted successfully!');
      setHasApplied(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply for project');
    } finally {
      setApplying(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`);
      toast.success('Project deleted successfully');
      navigate('/projects');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8 animate-fade-in pb-6">
      {/* Back button and actions */}
      <div className="flex justify-between items-center">
        <Link 
          to="/projects" 
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Back to Projects</span>
        </Link>
        
        {isOwner && (
          <div className="flex space-x-3">
            <Link 
              to={`/projects/${id}/edit`} 
              className="btn btn-outline btn-sm flex items-center gap-1"
            >
              <Edit size={16} />
              <span>Edit</span>
            </Link>
            
            <button 
              onClick={() => setDeleteConfirmOpen(true)} 
              className="btn btn-sm bg-error-500 text-white hover:bg-error-600 flex items-center gap-1"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Project Header */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <div className="flex items-center text-gray-500 mt-2">
              <Calendar size={16} className="mr-1" />
              <span className="text-sm">
                Created {new Date(project.createdAt).toLocaleDateString()}
              </span>
              <span className="mx-2">•</span>
              <Users size={16} className="mr-1" />
              <span className="text-sm">
                {project.teamSize} team members needed
              </span>
            </div>
          </div>
          
          {!isOwner && (
            <div className="flex items-center">
              <div className="mr-4 text-right">
                <div className="text-sm text-gray-500">Skill Match</div>
                <div className="flex items-center">
                  <Star className="text-yellow-500 mr-1" size={18} filled="true" />
                  <span className="font-semibold text-lg">{matchScore}%</span>
                </div>
              </div>
              
              <button 
                onClick={handleApply}
                disabled={applying || hasApplied || isOwner}
                className={`btn ${
                  hasApplied 
                    ? 'bg-success-500 hover:bg-success-500 cursor-not-allowed' 
                    : 'btn-primary'
                }`}
              >
                {applying ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : hasApplied ? (
                  'Applied'
                ) : (
                  'Apply to Join'
                )}
              </button>
            </div>
          )}
        </div>
        
        {/* Required Skills */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h2>
          <div className="flex flex-wrap">
            {project.requiredSkills.map((skill, index) => (
              <SkillTag key={index} skill={skill} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Project Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
          </div>
          
          {/* Team Members */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Members</h2>
            
            {teamMembers.length > 0 ? (
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium mr-3">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{member.name}</h3>
                      <div className="flex flex-wrap mt-1">
                        {member.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full mr-1">
                            {skill}
                          </span>
                        ))}
                        {member.skills.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{member.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <Users className="h-10 w-10 text-gray-400 mx-auto" />
                <p className="mt-2 text-gray-500">No team members yet</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Project Details Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Project Owner</h3>
                <p className="mt-1">{project.ownerName}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Team Size</h3>
                <p className="mt-1">{project.teamSize} members</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Current Team</h3>
                <p className="mt-1">{teamMembers.length} / {project.teamSize} members</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full" 
                    style={{ width: `${(teamMembers.length / project.teamSize) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Project Status</h3>
                <p className="mt-1">
                  {teamMembers.length === project.teamSize ? 'Team Complete' : 'Recruiting'}
                </p>
              </div>
            </div>
          </div>
          
          {!isOwner && (
            <div className="bg-white rounded-lg shadow-card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Match Score</h2>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#eee"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={matchScore > 75 ? "#22C55E" : matchScore > 50 ? "#F59E0B" : "#3366FF"}
                      strokeWidth="3"
                      strokeDasharray={`${matchScore}, 100`}
                    />
                  </svg>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <span className="text-3xl font-bold">{matchScore}%</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-gray-600 mt-4">
                {matchScore > 75 
                  ? "You're a perfect match for this project!" 
                  : matchScore > 50 
                  ? "You're a good match for this project." 
                  : "You match some of the required skills."}
              </p>
              <button 
                onClick={handleApply}
                disabled={applying || hasApplied || isOwner}
                className={`btn w-full mt-4 ${
                  hasApplied 
                    ? 'bg-success-500 hover:bg-success-500 cursor-not-allowed' 
                    : 'btn-primary'
                }`}
              >
                {applying ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : hasApplied ? (
                  'Applied'
                ) : (
                  'Apply to Join'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900">Delete Project</h2>
            <p className="text-gray-600 mt-2">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setDeleteConfirmOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="btn bg-error-500 text-white hover:bg-error-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;