"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SkillsEditorProps {
  skills: string[];
  onSave: (data: Partial<{ skills: string[] }>) => void;
}

const SkillsEditor: React.FC<SkillsEditorProps> = ({ skills, onSave }) => {
  const [newSkill, setNewSkill] = useState('');
  const [skillsList, setSkillsList] = useState(skills);

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkillsList([...skillsList, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkillsList(skillsList.filter((s) => s !== skill));
  };

  const handleSave = () => {
    onSave({ skills: skillsList });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skills</label>
        <div className="flex space-x-2">
          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <Button onClick={handleAddSkill}>Add</Button>
        </div>
      </div>
      <div className="space-y-2">
        {skillsList.map((skill, index) => (
          <div key={index} className="flex justify-between items-center">
            <span>{skill}</span>
            <Button variant="destructive" onClick={() => handleRemoveSkill(skill)}>Remove</Button>
          </div>
        ))}
      </div>
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
};

export default SkillsEditor;
