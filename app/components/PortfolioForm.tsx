// app/portfolio/userDashboard/components/PortfolioForm.tsx
const PortfolioForm = ({
    portfolioData,
    setPortfolioData,
  }: {
    portfolioData: any;
    setPortfolioData: React.Dispatch<React.SetStateAction<any>>;
  }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPortfolioData({
        ...portfolioData,
        [e.target.name]: e.target.value,
      });
    };
  
    const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const newSkills = [...portfolioData.skills];
      newSkills[index] = e.target.value;
      setPortfolioData({
        ...portfolioData,
        skills: newSkills,
      });
    };
  
    return (
      <form>
        <div>
          <label>Bio</label>
          <input
            type="text"
            name="bio"
            value={portfolioData.bio}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Skills</label>
          {portfolioData.skills.map((skill: string, index: number) => (
            <input
              key={index}
              type="text"
              value={skill}
              onChange={(e) => handleSkillsChange(e, index)}
            />
          ))}
        </div>
        <div>
          <label>Portfolio URL</label>
          <input
            type="text"
            name="portfolioUrl"
            value={portfolioData.portfolioUrl}
            onChange={handleInputChange}
          />
        </div>
      </form>
    );
  };
  
  export default PortfolioForm;
  