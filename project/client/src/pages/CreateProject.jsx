import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react';
import SkillTag from '../components/SkillTag.jsx';

function CreateProject() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teamSize: 3,
    requiredSkills: [],
    currentSkill: ''
  });
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For teamSize, ensure it's a number
    if (name === 'teamSize') {
      const teamSize = parseInt(value);
      setFormData(prev => ({
        ...prev,
        [name]: isNaN(teamSize) ? '' : teamSize
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleAddSkill = (e) => {
    e.preventDefault();
    const skill = formData.currentSkill.trim();
    
    if (!skill) return;
    
    if (!formData.requiredSkills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skill],
        currentSkill: ''
      }));
      
      // Clear error if it exists
      if (errors.requiredSkills) {
        setErrors(prev => ({
          ...prev,
          requiredSkills: ''
        }));
      }
    } else {
      toast.info('This skill is already added');
    }
  };
  
  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
    }));
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }
    
    if (!formData.teamSize || formData.teamSize < 1) {
      newErrors.teamSize = 'Team size must be at least 1';
    }
    
    if (formData.requiredSkills.length === 0) {
      newErrors.requiredSkills = 'At least one required skill is needed';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      const projectData = {
        name: formData.name,
        description: formData.description,
        teamSize: formData.teamSize,
        requiredSkills: formData.requiredSkills
      };
      
      const response = await axios.post('http://localhost:5000/api/projects', projectData);
      
      toast.success('Project created successfully!');
      navigate(`/projects/${response.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="flex items-center">
        <Link 
          to="/projects" 
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Back to Projects</span>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-card p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Project</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`input ${errors.name ? 'border-error-500 focus:ring-error-300 focus:border-error-500' : ''}`}
              placeholder="Enter project name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error-500">{errors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Project Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              className={`input resize-none ${errors.description ? 'border-error-500 focus:ring-error-300 focus:border-error-500' : ''}`}
              placeholder="Describe your project, its goals, and what you're looking to achieve"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-error-500">{errors.description}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-1">
              Team Size *
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => {
                  if (formData.teamSize > 1) {
                    setFormData(prev => ({ ...prev, teamSize: prev.teamSize - 1 }));
                  }
                }}
                className="btn btn-outline p-2 rounded-l-lg rounded-r-none border-r-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              
              <input
                id="teamSize"
                name="teamSize"
                type="number"
                min="1"
                value={formData.teamSize}
                onChange={handleChange}
                className={`input rounded-none text-center w-16 py-2 ${errors.teamSize ? 'border-error-500 focus:ring-error-300 focus:border-error-500' : ''}`}
              />
              
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, teamSize: prev.teamSize + 1 }));
                }}
                className="btn btn-outline p-2 rounded-r-lg rounded-l-none border-l-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            {errors.teamSize && (
              <p className="mt-1 text-sm text-error-500">{errors.teamSize}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="requiredSkills" className="block text-sm font-medium text-gray-700 mb-1">
              Required Skills *
            </label>
            <div className="flex">
              <input
                id="currentSkill"
                name="currentSkill"
                type="text"
                value={formData.currentSkill}
                onChange={handleChange}
                className={`input rounded-r-none ${errors.requiredSkills ? 'border-error-500 focus:ring-error-300 focus:border-error-500' : ''}`}
                placeholder="Enter a required skill (e.g. JavaScript, UX Design)"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="btn btn-primary rounded-l-none px-4 flex items-center"
              >
                <Plus size={18} />
                <span>Add</span>
              </button>
            </div>
            {errors.requiredSkills && (
              <p className="mt-1 text-sm text-error-500">{errors.requiredSkills}</p>
            )}
            
            <div className="mt-3">
              {formData.requiredSkills.length > 0 ? (
                <div className="flex flex-wrap">
                  {formData.requiredSkills.map((skill, index) => (
                    <SkillTag 
                      key={index} 
                      skill={skill} 
                      onRemove={handleRemoveSkill}
                      isRemovable={true}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No required skills added yet</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Link to="/projects" className="btn btn-outline">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProject;