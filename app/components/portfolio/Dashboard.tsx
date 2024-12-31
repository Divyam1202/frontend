import React from "react";
import SkillsEditor from "./sections/Skills";
import ProjectsEditor from "./sections/Projects";
import ExperienceEditor from "./sections/Experience"; // Correct import
import EducationEditor from "./sections/Education";

interface UserDashboardProps {
  portfolio: {
    displayName: string;
    skills: string[];
    experience: {
      title: string;
      company: string;
      location: string;
      startDate: string;
      endDate: string;
      description: string;
    }[];
    projects: {
      name: string;
      description: string;
      technologies: string[];
      link: string;
    }[];
    education: {
      institution: string;
      degree: string;
      graduationYear: string;
      major: string;
    }[];
  };
  onSave: (updatedData: Partial<UserDashboardProps['portfolio']>) => void;
  activeTab: string;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ portfolio, onSave, activeTab }) => {
  return (
    <div className="space-y-8">
      {activeTab === "displayName" && (
        <div className="rounded-lg bg-white shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 capitalize">Display Name</h2>
          <input
            type="text"
            value={portfolio.displayName}
            onChange={(e) => onSave({ displayName: e.target.value })}
            placeholder="Enter your display name..."
            className="border p-2 mb-4 w-full text-gray-900"
          />
        </div>
      )}

      {activeTab === "skills" && (
        <SkillsEditor skills={portfolio.skills} onSave={onSave} />
      )}

      {activeTab === "projects" && (
        <ProjectsEditor projects={portfolio.projects} onSave={(updatedProjects) => onSave({ projects: updatedProjects })} />
      )}

      {activeTab === "experience" && (
        <ExperienceEditor experience={portfolio.experience} onSave={onSave} />
      )}

      {activeTab === "education" && (
        <EducationEditor education={portfolio.education} onSave={async (data) => onSave(data)} />
      )}
    </div>
  );
};

export default UserDashboard;
