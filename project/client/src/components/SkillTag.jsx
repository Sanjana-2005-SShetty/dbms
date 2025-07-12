import React from 'react';

const skillCategories = {
  development: ['javascript', 'react', 'node', 'python', 'java', 'typescript', 'php', 'ruby', 'c#', 'c++', 'go', 'rust', 'swift', 'kotlin'],
  design: ['ui', 'ux', 'graphic design', 'photoshop', 'illustrator', 'figma', 'sketch', 'indesign', 'animation'],
  marketing: ['seo', 'social media', 'content', 'email', 'analytics', 'copywriting', 'advertising'],
  management: ['project management', 'leadership', 'agile', 'scrum', 'product management', 'team lead'],
};

function getSkillCategory(skill) {
  const lowerSkill = skill.toLowerCase();
  
  for (const [category, skills] of Object.entries(skillCategories)) {
    if (skills.some(s => lowerSkill.includes(s) || s.includes(lowerSkill))) {
      return category;
    }
  }
  
  return 'other';
}

function SkillTag({ skill, onRemove, isRemovable = false }) {
  const category = getSkillCategory(skill);
  
  return (
    <div className={`inline-flex items-center skill-tag skill-tag-${category} mr-2 mb-2 animate-fade-in`}>
      <span>{skill}</span>
      {isRemovable && (
        <button 
          onClick={() => onRemove(skill)} 
          className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          &times;
        </button>
      )}
    </div>
  );
}

export default SkillTag;