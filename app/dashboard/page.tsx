"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PortfolioDashboard() {
  const [user, setUser] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]); // Assuming portfolio has projects as well.
  const [skills, setSkills] = useState<string[]>([]);
  const [bio, setBio] = useState<string>("");
  const [portfolioUrl, setPortfolioUrl] = useState<string>("");
  const router = useRouter();
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchPortfolioData = async () => {
      const response = await fetch(`${API_BASE_URL}/api/portfolio/user/me`, {
        // Use 'me' to get logged in user's portfolio
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        router.push("/login");
        return;
      }

      const data = await response.json();
      setUser(data.user);
      setPortfolio(data);
      setSkills(data.skills || []);
      setBio(data.bio || "");
      setPortfolioUrl(data.portfolioUrl || "");
      setProjects(data.projects || []); // Assuming this part exists in your backend
    };

    fetchPortfolioData();
  }, [router]);

  const handleUpdatePortfolio = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    const response = await fetch(
      `${API_BASE_URL}/api/portfolio/${portfolio._id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: portfolio.user,
          portfolioUrl,
          bio,
          skills,
        }),
      }
    );

    if (!response.ok) {
      console.error("Error updating portfolio");
      return;
    }

    const data = await response.json();
    setPortfolio(data.portfolio);
    alert("Portfolio updated successfully!");
  };

  const handleAddSkill = () => {
    setSkills((prevSkills) => [...prevSkills, ""]);
  };

  const handleChangeSkill = (index: number, value: string) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  if (!user || !portfolio) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-extrabold text-gray-900">
        Portfolio Dashboard
      </h2>
      <p>
        Welcome, {user.firstName} {user.lastName}!
      </p>

      {/* Portfolio Section */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-800">Bio</h3>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full mt-2 p-2 border border-gray-300 rounded-md"
          placeholder="Write your bio"
        ></textarea>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-800">Portfolio URL</h3>
        <input
          type="url"
          value={portfolioUrl}
          onChange={(e) => setPortfolioUrl(e.target.value)}
          className="w-full mt-2 p-2 border border-gray-300 rounded-md"
          placeholder="Enter your portfolio URL"
        />
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-800">Skills</h3>
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center mt-2">
            <input
              type="text"
              value={skill}
              onChange={(e) => handleChangeSkill(index, e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
              placeholder={`Skill ${index + 1}`}
            />
          </div>
        ))}
        <button onClick={handleAddSkill} className="text-blue-500 mt-2">
          Add another skill
        </button>
      </div>

      {/* Projects Section */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-800">Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          {projects.map((project: any, index: number) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-4">
              <h4 className="text-xl font-semibold">{project.name}</h4>
              <p className="mt-2 text-gray-600">{project.description}</p>
              <a
                href={project.link}
                target="_blank"
                className="text-blue-500 mt-4 inline-block"
              >
                View Project
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8">
        <button
          onClick={handleUpdatePortfolio}
          className="bg-blue-500 text-white py-2 px-6 rounded-lg"
        >
          Update Portfolio
        </button>
      </div>
    </div>
  );
}
