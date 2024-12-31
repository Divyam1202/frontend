"use client";

import React from 'react';
import { Portfolio } from "@/app/types/portfolio";
import { format } from "date-fns";

interface EducationItem {
  institution: string;
  degree: string;
  graduationYear: string;
  major?: string;
}

interface EducationProps {
  education: {
    institution: string;
    degree: string;
    graduationYear: string;
    major?: string;
  }[];
  onSave?: (data: Partial<Portfolio>) => Promise<void>; // Optional prop
}


const Education: React.FC<EducationProps> = ({ education }) => {
  return (
    <div className="education">
      <h2>Education</h2>
      {education.map((item, index) => (
        <div key={index} className="education-item">
          <h3>{item.institution}</h3>
          <p>{item.degree}</p>
          <p>{item.graduationYear}</p>
          {item.major && <p>Major: {item.major}</p>}
        </div>
      ))}
    </div>
  );
};

export default Education;