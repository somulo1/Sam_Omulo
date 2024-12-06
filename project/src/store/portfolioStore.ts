import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, Service, Skill, ContactInfo, Certification, EducationExperience } from '../types/portfolio';
import { initialProjects, initialServices, initialSkills, initialContactInfo } from './initialData';

interface AboutContent {
  title: string;
  subtitle: string;
  description: string;
}

interface PortfolioStore {
  projects: Project[];
  services: Service[];
  skills: Skill[];
  contactInfo: ContactInfo;
  profilePhoto?: string;
  aboutContent: AboutContent;
  certifications: Certification[];
  educationExperience: EducationExperience[];
  setProjects: (projects: Project[]) => void;
  setServices: (services: Service[]) => void;
  setSkills: (skills: Skill[]) => void;
  setContactInfo: (contactInfo: ContactInfo) => void;
  updateProfilePhoto: (photoUrl: string) => void;
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

const initialCertifications: Certification[] = [];
const initialEducationExperience: EducationExperience[] = [];

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set) => ({
      projects: initialProjects,
      services: initialServices,
      skills: initialSkills,
      contactInfo: initialContactInfo,
      profilePhoto: 'img/profilepic.png',
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
      updateProfilePhoto: (photoUrl) => set({ profilePhoto: photoUrl }),
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
  )
);