export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  technologies: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Portfolio {
  _id: string;
  user: {
    username: string;
    firstName: string;
    lastName: string;
  };
  portfolioUrl: string;
  bio: string;
  skills: string[];
  about?: string;
  projects: {
    name: string;
    description: string;
    technologies: string[];
    link: string;
  }[];
  experience: {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    role: string;
  }[];
  education: {
    institution: string;
    degree: string;
    graduationYear: string;
    major: string;
  }[];
  patentsOrPapers: {
    title: string;
    link?: string;
    description?: string;
  }[];
  profileLinks: {
    platform: string;
    url: string;
  }[];
  published: boolean;
}

export type PortfolioSection = keyof Portfolio;
