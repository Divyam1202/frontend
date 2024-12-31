"use client";

import React from "react";

interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface ExperienceEditorProps {
  experience: Experience[];
  onSave: (data: Partial<{ experience: Experience[] }>) => void;
}

const ExperienceEditor: React.FC<ExperienceEditorProps> = ({ experience, onSave }) => {
  const handleSave = () => {
    // Implement save functionality
    onSave({ experience });
  };

  return (
    <div>
      {experience.map((exp, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-lg font-semibold">{exp.title}</h3>
          <p>{exp.company}</p>
          <p>{exp.location}</p>
          <p>{exp.startDate} - {exp.endDate}</p>
          <p>{exp.description}</p>
        </div>
      ))}
      <button onClick={handleSave} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
        Save Experience
      </button>
    </div>
  );
};

export default ExperienceEditor;
