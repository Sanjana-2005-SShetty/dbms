import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { PlusCircle, Search, Filter, Layers } from 'lucide-react';
import SkillTag from '../components/SkillTag.jsx';

function Projects() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const [projectsRes, skillsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/projects'),
          axios.get('http://localhost:5000/api/skills')
        ]);
        
        setProjects(projectsRes.data);
        setAvailableSkills(skillsRes.data);
      } catch (error) {
        toast.error('Failed to load projects');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const toggleSkillFilter = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };
  
  const filteredProjects = projects.filter(project => {
    // Filter by search term
    const matchesSearch = 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by selected skills
    const matchesSkills = 
      selectedSkills.length === 0 ||
      selectedSkills.some(skill => 
        project.requiredSkills.some(
          projSkill => projSkill.toLowerCase() === skill.toLowerCase()
        )
      );
    
    return matchesSearch && matchesSkills;
  });
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Find projects that match your skills</p>
        </div>
        
        <Link to="/projects/new" className="btn btn-primary flex items-center gap-2 w-full md:w-auto">
          <PlusCircle size={18} />
          <span>Create New Project</span>
        </Link>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="input pl-10"
            />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              className="btn btn-outline w-full md:w-auto flex items-center gap-2"
            >
              <Filter size={18} />
              <span>Filter by Skills</span>
              {selectedSkills.length > 0 && (
                <span className="bg-primary-100 text-primary-800 text-xs font-semibold px-2 py-1 rounded-full">
                  {selectedSkills.length}
                </span>
              )}
            </button>
            
            {filterMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-10 p-4 animate-fade-in">
                <h3 className="font-medium text-gray-700 mb-2">Select Skills</h3>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {availableSkills.length > 0 ? (
                    availableSkills.map((skill, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`skill-${index}`}
                          checked={selectedSkills.includes(skill)}
                          onChange={() => toggleSkillFilter(skill)}
                          className="h-4 w-4 text-primary-500 focus:ring-primary-400 rounded"
                        />
                        <label htmlFor={`skill-${index}`} className="ml-2 text-gray-700">
                          {skill}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No skills available</p>
                  )}
                </div>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => setSelectedSkills([])}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => setFilterMenuOpen(false)}
                    className="btn btn-sm btn-primary"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Selected skill tags */}
        {selectedSkills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedSkills.map((skill, index) => (
              <span 
                key={index} 
                className="inline-flex items-center bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
                <button
                  onClick={() => toggleSkillFilter(skill)}
                  className="ml-1 text-primary-500 hover:text-primary-700"
                >
                  &times;
                </button>
              </span>
            ))}
            <button
              onClick={() => setSelectedSkills([])}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
      
      {/* Projects List */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link 
              key={project.id} 
              to={`/projects/${project.id}`}
              className="card hover:shadow-card-hover group"
            >
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {project.name}
              </h3>
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">{project.description}</p>
              
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Required Skills:</p>
                <div className="flex flex-wrap">
                  {project.requiredSkills.slice(0, 3).map((skill, index) => (
                    <SkillTag key={index} skill={skill} />
                  ))}
                  {project.requiredSkills.length > 3 && (
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full ml-2">
                      +{project.requiredSkills.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {project.teamSize} members needed
                </span>
                <span className="text-primary-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  View details &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Layers className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No projects found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search or filters</p>
          <div className="mt-6">
            <Link to="/projects/new" className="btn btn-primary">
              Create a New Project
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;