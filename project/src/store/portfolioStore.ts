import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, Service, Skill, ContactInfo, Certification, EducationExperience, ImageType, WorkExperience } from '../types/portfolio';
import { initialProjects, initialServices, initialSkills, initialContactInfo } from './initialData';

// Define interfaces
interface AboutContent {
  title: string;
  subtitle: string;
  description: string;
}

interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    accent: string;
    surface:string;
    text: {
      primary: string;
      secondary: string;
    };
  };
  sections: {
    home: {
      background: string;
      textColor: string;
    };
    about: {
      background: string;
      textColor: string;
      headingColor: string;
    };
    services: {
      background: string;
      textColor: string;
      hoverColor: string;
    };
    skills: {
      background: string;
      textColor: string;
    };
    projects: {
      background: string;
      textColor: string;
    };
    contact: {
      background: string;
      textColor: string;
    };
  };
}

// Define the PortfolioStore interface
interface PortfolioStore {
  projects: Project[];
  initialProjects: Project[];
  services: Service[];
  skills: Skill[];
  contactInfo: ContactInfo;
  profilePhoto: ImageType | null;
  aboutContent: AboutContent;
  certifications: Certification[];
  educationExperiences: EducationExperience[];
  workExperiences: WorkExperience[];
  theme: Theme;
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
  updateEducationExperiences: (educationExperiences: EducationExperience[]) => void;
  updateWorkExperiences: (workExperiences: WorkExperience[]) => void;
  updateTheme: (theme: Theme) => void;
}

// Initial states
const initialCertifications: Certification[] = [];
const initialLocalEducationExperiences: EducationExperience[] = [];
const initialWorkExperiences: WorkExperience[] = [];

const initialTheme: Theme = {
  colors: {
    primary: '#00abf0',
    secondary: '#00abf0',
    background: '#ffffff',
    accent: '#112e42',
    surface:'#081b29',
    text: {
      primary: '#2d3748',
      secondary: '#4a5568',
    },
  },
  sections: {
    home: {
      background: '#081b29',
      textColor: '#ededed',
    },
    about: {
      background: '#112e42',
      textColor: '#ffffff',
      headingColor: '#00abf0',
    },
    services: {
      background: '#081b29',
      textColor: '#ffffff',
      hoverColor: '#00abf0',
    },
    skills: {
      background: '#112e42',
      textColor: '#ffffff',
    },
    projects: {
      background: '#112e42',
      textColor: '#ffffff',
    },
    contact: {
      background: '#112e42',
      textColor: '#ffffff',
    },
  },
};

// Create the Zustand store
export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set) => ({
      projects: initialProjects,
      initialProjects: initialProjects,
      services: initialServices,
      skills: initialSkills,
      contactInfo: initialContactInfo,
      profilePhoto: null,
      aboutContent: {
        title: '',
        subtitle: '',
        description: '',
      },
      certifications: initialCertifications,
      educationExperiences: initialLocalEducationExperiences,
      workExperiences: initialWorkExperiences,
      theme: initialTheme,
      
      // State setters
      setProjects: (projects: Project[]) => set((state) => projects === state.projects ? {} : { projects }),
      setServices: (services: Service[]) => set((state) => services === state.services ? {} : { services }),
      setSkills: (skills: Skill[]) => set((state) => skills === state.skills ? {} : { skills }),
      setContactInfo: (contactInfo: ContactInfo) => set((state) => contactInfo === state.contactInfo ? {} : { contactInfo }),
      updateProfilePhoto: (photo: ImageType) => set((state) => photo === state.profilePhoto ? {} : { profilePhoto: photo }),
      updateAboutContent: (content: AboutContent) => set((state) => content === state.aboutContent ? {} : { aboutContent: content }),

      // Array operations
      updateProject: (id: string, updatedProject: Project) => set((state) => ({
        projects: state.projects.map(p => p.id === id ? { ...p, ...updatedProject } : p)
      })),
      deleteProject: (id: string) => set((state) => ({
        projects: state.projects.filter(p => p.id !== id)
      })),
      addProject: (project: Project) => set((state) => ({
        projects: [...state.projects, project]
      })),
      updateService: (id: string, updatedService: Service) => set((state) => ({
        services: state.services.map(s => s.id === id ? { ...s, ...updatedService } : s)
      })),
      deleteService: (id: string) => set((state) => ({
        services: state.services.filter(s => s.id !== id)
      })),
      addService: (service: Service) => set((state) => ({
        services: [...state.services, service]
      })),
      updateSkill: (id: string, updatedSkill: Skill) => set((state) => ({
        skills: state.skills.map(s => s.id === id ? { ...s, ...updatedSkill } : s)
      })),
      deleteSkill: (id: string) => set((state) => ({
        skills: state.skills.filter(s => s.id !== id)
      })),
      addSkill: (skill: Skill) => set((state) => ({
        skills: [...state.skills, skill]
      })),
      updateCertifications: (certifications: Certification[]) => set((state) => certifications === state.certifications ? {} : { certifications }),
      updateEducationExperiences: (educationExperiences: EducationExperience[]) => set((state) => educationExperiences === state.educationExperiences ? {} : { educationExperiences }),
      updateWorkExperiences: (workExperiences: WorkExperience[]) => set((state) => workExperiences === state.workExperiences ? {} : { workExperiences }),
      updateTheme: (theme: Theme) => set((state) => ({ ...state, theme })),
    }),
    {
      name: 'portfolio-storage',
      partialize: (state) => ({
        projects: state.projects,
        services: state.services,
        skills: state.skills,
        contactInfo: state.contactInfo,
        profilePhoto: state.profilePhoto,
        aboutContent: state.aboutContent,
        certifications: state.certifications,
        educationExperiences: state.educationExperiences,
        workExperiences: state.workExperiences,
        theme: state.theme,
      }),
    }
  )
);

export default usePortfolioStore;