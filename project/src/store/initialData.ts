import { Project, Service, Skill, ContactInfo } from '../types/portfolio';

export const initialProjects: Project[] = [
  {
    id: '1',
    title: 'ASCII Art Web',
    description: 'A web application for converting text to ASCII art with multiple banner styles.',
    technologies: ['Go', 'HTML', 'CSS', 'JavaScript'],
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
    githubUrl: 'https://github.com/somulo1/ascii-art-web',
    liveUrl: 'https://ascii-art-web.netlify.app'
  }
];

export const initialServices: Service[] = [
  {
    id: '1',
    title: 'Web Development',
    description: 'Creating responsive, modern websites using the latest technologies and best practices.',
    icon: 'bx bx-code-alt',
    bulletPoints: [
      'HTML, CSS, JavaScript',
      'Responsive Web Design',
      'Cross-Browser Compatibility',
      'APIs',
      'Version Control: Git and Github'
    ]
  },
  {
    id: '2',
    title: 'Cybersecurity',
    description: 'Protecting networks and data with proactive security measures.',
    icon: 'bx bx-shield',
    bulletPoints: [
      'Threat Analysis & Risk Management',
      'Network Security',
      'Incident Response',
      'Data Encryption',
      'Vulnerability Testing'
    ]
  },
  {
    id: '3',
    title: 'Full-Stack Development',
    description: 'Building scalable, efficient, and secure applications.',
    icon: 'bx bx-layer',
    bulletPoints: [
      'JavaScript, golang',
      'Docker',
      'Database Management (SQL)',
      'C++'
    ]
  }
];

export const initialSkills: Skill[] = [
  {
    id: '1',
    category: 'Web Development',
    icon: 'bx bx-code-alt',
    items: [
      'HTML, CSS, JavaScript',
      'Bootstrap',
      'Responsive Design',
      'Website Design',
      'SEO optimization'
    ]
  },
  {
    id: '2',
    category: 'Cybersecurity',
    icon: 'bx bx-shield',
    items: [
      'Threat Analysis & Risk Management',
      'Network Security',
      'Incident Response',
      'Data Encryption',
      'Vulnerability Testing'
    ]
  }
];

export const initialContactInfo: ContactInfo = {
  email: 'mcomulosammy37@gmail.com',
  location: 'Zone01 Kisumu, Lake Basin Mall, Kisumu-Vihiga Road',
  socialLinks: {
    facebook: 'https://www.facebook.com/omulo.jnr',
    twitter: 'https://x.com/jnr_omulo',
    linkedin: 'https://www.linkedin.com/in/samuel-omulo-634694261',
    github: 'https://github.com/somulo1'
  }
};