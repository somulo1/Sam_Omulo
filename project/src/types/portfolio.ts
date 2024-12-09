// Import necessary modules and types
import { ImageType } from '../types/portfolio';

/**
 * Interface representing the content of the About section.
 */
interface AboutContent {
  title: string;
  subtitle: string;
  description: string;
}

/**
 * Interface representing the Portfolio Store state.
 */
interface PortfolioStore {
  projects: Project[];
  initialProjects: Project[];
  services: Service[];
  skills: Skill[];
  contactInfo: ContactInfo;
  profilePhoto: ImageType;
  aboutContent: AboutContent;
  certifications: Certification[];
  educationExperience: EducationExperience[];
  setProjects: (projects: Project[]) => void;
  setServices: (services: Service[]) => void;
  setSkills: (skills: Skill[]) => void;
  setContactInfo: (contactInfo: ContactInfo) => void;
  updateProfilePhoto: (photo: ImageType) => void;
  updateAboutContent: (content: AboutContent) => void;
  updateProject: (id: string, project: Project) => void;
  deleteProject: (id: string) => void;
  addProject: (project: Project) => void;
  updateService: (id: string, service: Service) => void;
  deleteService: (id: string) => void;
  addService: (service: Service) => void;
  updateSkill: (id: string, skill: Skill) => void;
  deleteSkill: (id: string) => void;
  addSkill: (skill: Skill) => void;
  updateCertifications: (certifications: Certification[]) => void;
  updateEducationExperience: (educationExperience: EducationExperience[]) => void;
}

/**
 * Interface representing a project.
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  imagePath?: string;
  github_url: string;
  liveUrl?: string;
}

/**
 * Interface representing a service.
 */
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  bulletPoints: string[];
}

/**
 * Interface representing a skill.
 */
export interface Skill {
  id: string;
  category: string;
  icon: string;
  items: string[];
}

/**
 * Interface representing contact information.
 */
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

/**
 * Interface representing a certification.
 */
export interface Certification {
  id: string;
  title: string;
  issuer: string;
  dateIssued: string;
  expirationDate?: string;
  credentialUrl?: string;
}

/**
 * Interface representing an education experience.
 */
export interface EducationExperience {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
}

/**
 * Interface representing an image.
 */
export type ImageType = {
  id: string;
  file_path: string;
  file_name: string;
};

const initialCertifications: Certification[] = [];
const initialEducationExperience: EducationExperience[] = [];

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set) => ({
      projects: [],
      initialProjects: [],
      services: [],
      skills: [],
      contactInfo: {
        email: '',
        location: '',
        socialLinks: {
          facebook: '',
          twitter: '',
          linkedin: '',
          github: '',
        },
      },
      profilePhoto: { id: '1', file_path: 'img/profilepic.png', file_name: 'profilepic.png' },
      aboutContent: {
        title: 'About Me',
        subtitle: 'Software Engineer & Cybersecurity Enthusiast',
        description: 'I am a dedicated Software Engineer with a strong interest in cybersecurity...',
      },
      certifications: initialCertifications,
      educationExperience: initialEducationExperience,
      setProjects: (projects) => set({ projects }),
      setServices: (services) => set({ services }),
      setSkills: (skills) => set({ skills }),
      setContactInfo: (contactInfo) => set({ contactInfo }),
      updateProfilePhoto: (photo) => set({ profilePhoto: photo }),
      updateAboutContent: (content) => set({ aboutContent: content }),
      updateProject: (id, updatedProject) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? updatedProject : project
          ),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        })),
      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, project],
        })),
      updateService: (id, updatedService) =>
        set((state) => ({
          services: state.services.map((service) =>
            service.id === id ? updatedService : service
          ),
        })),
      deleteService: (id) =>
        set((state) => ({
          services: state.services.filter((service) => service.id !== id),
        })),
      addService: (service) =>
        set((state) => ({
          services: [...state.services, service],
        })),
      updateSkill: (id, updatedSkill) =>
        set((state) => ({
          skills: state.skills.map((skill) =>
            skill.id === id ? updatedSkill : skill
          ),
        })),
      deleteSkill: (id) =>
        set((state) => ({
          skills: state.skills.filter((skill) => skill.id !== id),
        })),
      addSkill: (skill) =>
        set((state) => ({
          skills: [...state.skills, skill],
        })),
      updateCertifications: (certifications) => set({ certifications }),
      updateEducationExperience: (educationExperience) => set({ educationExperience }),
    }),
    {
      name: 'portfolio-storage',
    }
  ),
);