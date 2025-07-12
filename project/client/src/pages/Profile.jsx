import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Save, Plus, Trash2, Check } from 'lucide-react';
import SkillTag from '../components/SkillTag.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    skills: []
  });
  const [currentSkill, setCurrentSkill] = useState('');
  const [applications, setApplications] = useState([]);
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userRes, applicationsRes, projectsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/users/me'),
          axios.get('http://localhost:5000/api/users/applications'),
          axios.get('http://localhost:5000/api/users/projects')
        ]);
        
        setUserData({
          name: userRes.data.name,
          email: userRes.data.email,
          skills: userRes.data.skills || []
        });
        
        setApplications(applicationsRes.data);
        setProjects(projectsRes.data);
      } catch (error) {
        toast.error('Failed to load user data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleAddSkill = (e) => {
    e.preventDefault();
    const skill = currentSkill.trim();
    
    if (!skill) return;
    
    if (!userData.skills.includes(skill)) {
      setUserData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      setCurrentSkill('');
    } else {
      toast.info('This skill is already added');
    }
  };
  
  const handleRemoveSkill = (skillToRemove) => {
    setUserData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };
  
  const handleSaveProfile = async () => {
    setSaving(true);
    
    try {
      await axios.put('http://localhost:5000/api/users/me', {
        name: userData.name,
        skills: userData.skills
      });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };
  
  const withdrawApplication = async (applicationId) => {
    try {
      await axios.delete(`http://localhost:5000/api/applications/${applicationId}`);
      setApplications(applications.filter(app => app.id !== applicationId));
      toast.success('Application withdrawn successfully');
    } catch (error) {
      toast.error('Failed to withdraw application');
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
    <div className="space-y-8 animate-fade-in pb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your profile and skills</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className="input"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={userData.email}
                  disabled
                  className="input bg-gray-50"
                  placeholder="Your email"
                />
                <p className="text-sm text-gray-500 mt-1">Email address cannot be changed</p>
              </div>
            </div>
          </div>
          
          {/* Skills */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    className="input rounded-r-none"
                    placeholder="Add a skill (e.g. JavaScript, UX Design)"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="btn btn-primary rounded-l-none px-4 flex items-center"
                  >
                    <Plus size={18} />
                    <span>Add</span>
                  </button>
                </div>
                
                <div className="mt-4">
                  {userData.skills.length > 0 ? (
                    <div className="flex flex-wrap">
                      {userData.skills.map((skill, index) => (
                        <SkillTag 
                          key={index} 
                          skill={skill} 
                          onRemove={handleRemoveSkill}
                          isRemovable={true}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No skills added yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="btn btn-primary flex items-center gap-2"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* My Applications */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Applications</h2>
            
            {applications.length > 0 ? (
              <div className="space-y-3">
                {applications.map((application) => (
                  <div key={application.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-900">{application.projectName}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        application.status === 'accepted' 
                          ? 'bg-success-100 text-success-800' 
                          : application.status === 'rejected'
                          ? 'bg-error-100 text-error-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Applied on {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                    
                    {application.status === 'pending' && (
                      <button
                        onClick={() => withdrawApplication(application.id)}
                        className="mt-2 text-sm text-error-600 hover:text-error-800 font-medium flex items-center"
                      >
                        <Trash2 size={14} className="mr-1" />
                        <span>Withdraw Application</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">You haven't applied to any projects yet</p>
            )}
          </div>
          
          {/* My Projects */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Projects</h2>
            
            {projects.length > 0 ? (
              <div className="space-y-3">
                {projects.map((project) => (
                  <a 
                    key={project.id} 
                    href={`/projects/${project.id}`}
                    className="block border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-500">
                        Team: {project.teamCount} / {project.teamSize}
                      </p>
                      {project.teamCount === project.teamSize ? (
                        <span className="text-xs bg-success-100 text-success-800 px-2 py-1 rounded-full">
                          Complete
                        </span>
                      ) : (
                        <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                          Recruiting
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">You haven't created any projects yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;