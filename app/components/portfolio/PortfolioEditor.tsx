"use client";

import React, { useState } from "react";
import { Portfolio } from "@/app/types/portfolio";
import { ProjectForm } from "./editor/ProjectForm";
import { ExperienceForm } from "./editor/ExperienceForm";
import { Button } from "@/components/ui/button";
import { updatePortfolio } from "../../../lib/api/portfolio";
import { useToast } from "@/hooks/use-toast";

interface PortfolioEditorProps {
  portfolio: Portfolio;
  onSave: (data: Partial<Portfolio>) => void;
}

const PortfolioEditor: React.FC<PortfolioEditorProps> = ({ portfolio, onSave }) => {
  const [bio, setBio] = useState(portfolio.bio);
  const [about, setAbout] = useState(portfolio.about || '');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleSave = async (data: Partial<Portfolio>) => {
    setIsLoading(true);
    try {
      const token = "your-auth-token"; // Replace with actual token retrieval logic
      await updatePortfolio(data, token);
      toast({
        title: "Success",
        description: "Portfolio updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update portfolio",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">About</label>
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="flex justify-end">
        <Button onClick={() => handleSave({ bio, about })} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Add section buttons */}
      <div className="flex space-x-4">
        <Button
          variant="outline"
          onClick={() => setActiveSection("project")}
        >
          Add Project
        </Button>
        <Button
          variant="outline"
          onClick={() => setActiveSection("experience")}
        >
          Add Experience
        </Button>
      </div>

      {/* Forms */}
      {activeSection === "project" && (
        <ProjectForm
          onSubmit={() => {
            // Handle project addition
            setActiveSection(null);
          }}
          onCancel={() => setActiveSection(null)}
        />
      )}

      {activeSection === "experience" && (
        <ExperienceForm
          onSubmit={() => {
            // Handle experience addition
            setActiveSection(null);
          }}
          onCancel={() => setActiveSection(null)}
        />
      )}
    </div>
  );
};

export default PortfolioEditor;