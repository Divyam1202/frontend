import React from "react";
import Header from "@/app/components/portfolio/sections/Header"; // Correct import path
import Projects from "@/app/components/portfolio/sections/Projects";
import ExperienceEditor from "@/app/components/portfolio/sections/Experience";
import Education from "@/app/components/portfolio/sections/Education";
import SkillsEditor from "@/app/components/portfolio/sections/Skills";

interface Portfolio {
  userId: string;
  skills: string[];
  projects: any[];
  experience: any[];
  education: any[];
}

const PortfolioView: React.FC<{ portfolio: Portfolio }> = ({ portfolio }) => {
  const handleSaveSkills = (updatedSkills: Partial<{ skills: string[] }>) => {
    // Handle save functionality (API call or state update)
    console.log(updatedSkills);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Header userId={portfolio.userId} /> {/* Pass userId prop to Header */}
      <SkillsEditor skills={portfolio.skills} onSave={handleSaveSkills} /> {/* Pass onSave to SkillsEditor */}
      <Projects projects={portfolio.projects} />
      <ExperienceEditor experience={portfolio.experience} onSave={(updatedExperience) => console.log(updatedExperience)} />
      <Education education={portfolio.education} />
    </div>
  );
};

export default PortfolioView;
