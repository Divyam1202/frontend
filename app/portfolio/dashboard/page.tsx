"use client";

import React, { useEffect, useState } from "react";
import { getUser, logout } from "@/app/utils/auth"; // Import the getUser and logout functions
import { useTheme } from "@/app/providers/theme-providers"; // Theme hook

type Skill = string;
type Project = {
  name: string;
  description: string;
  technologies: string[];
  link: string;
};
type Experience = {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
};
type Education = {
  institution: string;
  degree: string;
  graduationYear: string;
  major: string;
};

type Portfolio = {
  displayName: string;
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  published: boolean;
};

export default function DashboardPage() {
  const [portfolio, setPortfolio] = useState<Portfolio>({
    displayName: "",
    skills: [],
    experience: [],
    projects: [],
    education: [],
    published: false,
  });
  const [activeTab, setActiveTab] = useState("displayName");
  const [username, setUsername] = useState<string>(""); // State for username
  const [newSkill, setNewSkill] = useState(""); // State for new skill input
  const { theme, toggleTheme } = useTheme(); // Theme toggler
  const [savedProfile, setSavedProfile] = useState<Portfolio | null>(null); // State to hold saved profile

  useEffect(() => {
    const user = getUser();
    if (user && user.username) {
      setUsername(user.username); // Set the username state
    }

    const storedProfile = localStorage.getItem("savedProfile");
    if (storedProfile) {
      setPortfolio(JSON.parse(storedProfile));
      setSavedProfile(JSON.parse(storedProfile));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("savedProfile", JSON.stringify(portfolio));
  }, [portfolio]);

  const handleAddItem = (section: keyof Portfolio) => {
    const newItem =
      section === "projects"
        ? { name: "", description: "", technologies: [], link: "" }
        : section === "experience"
        ? {
            title: "",
            company: "",
            location: "",
            startDate: "",
            endDate: "",
            description: "",
          }
        : { institution: "", degree: "", graduationYear: "", major: "" };

    setPortfolio((prev) => {
      // Ensure the section is an array
      const currentSection = prev[section];
      return {
        ...prev,
        [section]: Array.isArray(currentSection)
          ? [...currentSection, newItem] // If it's an array, add the new item
          : [newItem], // If it's not an array, create a new array with the new item
      };
    });
  };

  const handleDeleteItem = (section: keyof Portfolio, index: number) => {
    setPortfolio((prev) => {
      // Ensure the section is an array before deleting
      const currentSection = prev[section];
      return {
        ...prev,
        [section]: Array.isArray(currentSection)
          ? currentSection.filter((_, i) => i !== index) // If it's an array, filter out the item
          : [], // If it's not an array, set it to an empty array
      };
    });
  };

  const handleChange = (
    section: keyof Portfolio,
    index: number,
    field: string,
    value: string
  ) => {
    setPortfolio((prev) => {
      const currentSection = prev[section];

      if (Array.isArray(currentSection)) {
        const updatedSection = [...currentSection]; // Spread only if it's an array

        // Type assertion to ensure TypeScript knows the item is the right type
        if (section === "experience" && updatedSection[index]) {
          // Ensure that it's of type Experience
          updatedSection[index] = {
            ...(updatedSection[index] as Experience), // Type assertion
            [field]: value,
          };
        } else if (section === "projects" && updatedSection[index]) {
          // Ensure that it's of type Project
          updatedSection[index] = {
            ...(updatedSection[index] as Project), // Type assertion
            [field]: value,
          };
        } else if (section === "education" && updatedSection[index]) {
          // Ensure that it's of type Education
          updatedSection[index] = {
            ...(updatedSection[index] as Education), // Type assertion
            [field]: value,
          };
        }

        return { ...prev, [section]: updatedSection };
      }

      console.error(`Section "${section}" is not an array`);
      return prev;
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setPortfolio((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill(""); // Reset input after adding
    }
  };

  const handleDeleteSkill = (index: number) => {
    setPortfolio((prev) => {
      const updatedSkills = prev.skills.filter((_, i) => i !== index);
      return { ...prev, skills: updatedSkills };
    });
  };

  // const handleSaveProfile = () => {
  //   // Save the profile by setting it to the savedProfile state and local storage
  //   setSavedProfile(portfolio);
  //   localStorage.setItem("savedProfile", JSON.stringify(portfolio));
  //   alert("Profile saved successfully!");
  // };

  const handleTogglePublish = () => {
    setPortfolio((prev) => ({
      ...prev,
      published: !prev.published,
    }));
  };
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/portfolio`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(portfolio),
      });

      const responseText = await response.text();
      try {
        const data = JSON.parse(responseText);
        if (response.ok) {
          const completeProfile: Portfolio = {
            displayName: data.displayName || "",
            skills: data.skills || [],
            experience: data.experience || [],
            projects: data.projects || [],
            education: data.education || [],
            published: data.published || false,
          };
          setSavedProfile(completeProfile);
          alert("Profile saved successfully!");
        } else {
          alert(`Error saving profile: ${data.message || responseText}`);
        }
      } catch (e) {
        console.error("Failed to parse response as JSON:", e);
        alert(`Unexpected response: ${responseText}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(`Failed to save profile: ${error.message}`);
      } else {
        alert("Failed to save profile: An unknown error occurred.");
      }
    }
  };

  const renderSection = (
    section: keyof Portfolio,
    items: Experience[] | Project[] | Education[], // Explicitly type the `items` array
    handleChange: (
      section: keyof Portfolio,
      index: number,
      field: string,
      value: string
    ) => void,
    handleAddItem: (section: keyof Portfolio) => void,
    handleDeleteItem: (section: keyof Portfolio, index: number) => void
  ) => {
    return (
      <div className="rounded-lg bg-white shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 capitalize">{section}</h2>
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={index} className="mb-4">
              {/* Render each field based on its type */}
              {Object.keys(item).map((key) => (
                <input
                  key={key}
                  type="text"
                  value={item[key as keyof typeof item]}
                  onChange={(e) =>
                    handleChange(section, index, key, e.target.value)
                  }
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  className="border p-2 mb-2 w-full text-gray-900"
                />
              ))}
              <button
                onClick={() => handleDeleteItem(section, index)}
                className="bg-red-600 text-white capitalize px-4 py-2 rounded hover:bg-red-700 mt-2"
              >
                Delete {section.slice(0)}
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            No {section} yet. Click "Add {section}" to start.
          </p>
        )}
        <button
          onClick={() => handleAddItem(section)}
          className="bg-blue-600 capitalize text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
        >
          Add {section.slice(0)}
        </button>
      </div>
    );
  };

  const renderProfile = (portfolio: Portfolio | null) => {
    if (!portfolio) {
      return <p className="text-gray-500">No profile data available.</p>;
    }

    return (
      <div className="rounded-lg bg-white shadow-md p-6 mb-8">
        <h2 className="text-2xl text-gray-900 font-semibold mb-4">
          Profile Summary
        </h2>
        <div className="mb-4">
          <h3 className="text-xl text-gray-900 font-semibold">Display Name:</h3>
          <p className="text-gray-700">
            {portfolio.displayName || "No display name provided."}
          </p>
        </div>
        <div className="mb-4">
          <h3 className="text-xl text-gray-900 font-semibold">Skills:</h3>
          <ul className="list-disc pl-5">
            {portfolio.skills && portfolio.skills.length > 0 ? (
              portfolio.skills.map((skill, index) => (
                <li key={index} className="text-gray-700">
                  {skill}
                </li>
              ))
            ) : (
              <p className="text-gray-500">No skills added.</p>
            )}
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="text-xl text-gray-900 font-semibold">Experience:</h3>
          {portfolio.experience && portfolio.experience.length > 0 ? (
            portfolio.experience.map((exp, index) => (
              <div key={index} className="mb-2 text-gray-700">
                <p>
                  <strong>Title:</strong> {exp.title}
                </p>
                <p>
                  <strong>Company:</strong> {exp.company}
                </p>
                <p>
                  <strong>Location:</strong> {exp.location}
                </p>
                <p>
                  <strong>Duration:</strong> {exp.startDate} - {exp.endDate}
                </p>
                <p>
                  <strong>Description:</strong> {exp.description}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No experience added.</p>
          )}
        </div>
        <div className="mb-4">
          <h3 className="text-xl text-gray-900 font-semibold">Projects:</h3>
          {portfolio.projects && portfolio.projects.length > 0 ? (
            portfolio.projects.map((project, index) => (
              <div key={index} className="mb-2 text-gray-700">
                <p>
                  <strong>Name:</strong> {project.name}
                </p>
                <p>
                  <strong>Description:</strong> {project.description}
                </p>
                <p>
                  <strong>Technologies:</strong>{" "}
                  {project.technologies.join(", ")}
                </p>
                <p>
                  <strong>Link:</strong> {project.link}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No projects added.</p>
          )}
        </div>
        <div className="mb-4">
          <h3 className="text-xl text-gray-900 font-semibold">Education:</h3>
          {portfolio.education && portfolio.education.length > 0 ? (
            portfolio.education.map((edu, index) => (
              <div key={index} className="mb-2 text-gray-700">
                <p>
                  <strong>Institution:</strong> {edu.institution}
                </p>
                <p>
                  <strong>Degree:</strong> {edu.degree}
                </p>
                <p>
                  <strong>Major:</strong> {edu.major}
                </p>
                <p>
                  <strong>Graduation Year:</strong> {edu.graduationYear}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No education details added.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8 px-4 lg:px-12">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-50">
              Welcome, {username || "No Username"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your personal portfolio details.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "🌞" : "🌙"}
            </button>
            {savedProfile && (
              <>
                <button
                  onClick={handleTogglePublish}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                    portfolio.published
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {portfolio.published ? "Unpublish" : "Publish"}
                </button>

                {/* Preview Button */}
                <button
                  onClick={() => window.open("/portfolio/preview", "_blank")}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                >
                  Preview
                </button>
              </>
            )}
            <button
              onClick={async () => {
                logout(); // Clear session
                await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for session clear
                window.location.href = "/portfolio/login"; // Redirect to login page
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Portfolio Sections */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
          <nav className="flex gap-4 mb-6">
            {[
              "displayName",
              "skills",
              "experience",
              "projects",
              "education",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab ? "text-blue-600" : "text-gray-700"
                } font-medium text-lg`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>

          {activeTab === "displayName" && (
            <div className="rounded-lg bg-white shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4 capitalize">
                Display Name
              </h2>
              <input
                type="text"
                value={portfolio.displayName}
                onChange={(e) =>
                  setPortfolio({ ...portfolio, displayName: e.target.value })
                }
                placeholder="Enter your display name..."
                className="border p-2 mb-4 w-full text-gray-900"
              />
            </div>
          )}

          {activeTab === "skills" && (
            <div className="rounded-lg bg-white shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4 capitalize">Skills</h2>
              <textarea
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a new skill...
                preferrref format: Python | JavaScript | React and no abreviations..."
                className="border p-2 mb-4 w-full text-gray-900"
              />
              <button
                onClick={handleAddSkill}
                className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
              >
                Add Skill
              </button>
              <ul className="list-disc pl-5 mt-4 text-gray-900">
                {portfolio.skills.map((skill, index) => (
                  <li key={index} className="flex items-center">
                    {skill}
                    <button
                      onClick={() => handleDeleteSkill(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab !== "skills" &&
            activeTab !== "displayName" &&
            renderSection(
              activeTab as keyof Portfolio,
              portfolio[activeTab as keyof Portfolio] as any[],
              handleChange,
              handleAddItem,
              handleDeleteItem
            )}
        </div>

        {/* Save Profile Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSaveProfile}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Save Profile
          </button>
        </div>

        {/* Display Saved Profile */}
        {savedProfile && (
          <div className="mt-8">
            <h2 className="text-3xl font-semibold">Saved Profile</h2>
            {renderProfile(savedProfile)}
          </div>
        )}
      </div>
    </main>
  );
}
