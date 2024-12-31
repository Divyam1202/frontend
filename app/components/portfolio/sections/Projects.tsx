"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";

interface Project {
  name: string;
  description: string;
  technologies: string[];
  link: string;
}

interface ProjectsProps {
  projects: Project[];
  isEditing?: boolean;
  onSave?: (updatedProjects: Project[]) => void;
}

const Projects: React.FC<ProjectsProps> = ({ projects, isEditing = false, onSave }) => {
  const [editableProjects, setEditableProjects] = useState<Project[]>(projects);

  const handleInputChange = (index: number, field: keyof Project, value: string | string[]) => {
    const updatedProjects = [...editableProjects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setEditableProjects(updatedProjects);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editableProjects);
    }
  };

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {editableProjects.map((project, index) => (
          <Card key={index} className="overflow-hidden p-4">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={project.name}
                  onChange={(e) => handleInputChange(index, "name", e.target.value)}
                  className="border rounded-md p-2 w-full"
                />
                <textarea
                  placeholder="Project Description"
                  value={project.description}
                  onChange={(e) => handleInputChange(index, "description", e.target.value)}
                  className="border rounded-md p-2 w-full"
                />
                <input
                  type="text"
                  placeholder="Technologies (comma-separated)"
                  value={project.technologies.join(", ")}
                  onChange={(e) =>
                    handleInputChange(index, "technologies", e.target.value.split(",").map((tech) => tech.trim()))
                  }
                  className="border rounded-md p-2 w-full"
                />
                <input
                  type="text"
                  placeholder="Project Link"
                  value={project.link}
                  onChange={(e) => handleInputChange(index, "link", e.target.value)}
                  className="border rounded-md p-2 w-full"
                />
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="text-muted-foreground mt-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline mt-2 inline-block"
                >
                  View Project
                </a>
              </div>
            )}
          </Card>
        ))}
      </div>
      {isEditing && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Save Changes
          </button>
        </div>
      )}
    </section>
  );
};

export default Projects;
