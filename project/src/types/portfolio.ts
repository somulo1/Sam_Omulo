export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  imagePath?: string;
  githubUrl: string;
  liveUrl?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  bulletPoints: string[];
}

export interface Skill {
  id: string;
  category: string;
  icon: string;
  items: string[];
}

export interface ContactInfo {
  email: string;
  location: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
    github: string;
  };
}