import { Project, Service, Skill, ContactInfo } from '../types/portfolio';

export const initialProjects: Project[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'ASCII Art Web',
    description: 'A web application for converting text to ASCII art with multiple banner styles.',
    technologies: ['Go', 'HTML', 'CSS', 'JavaScript'],
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
    github_url: 'https://github.com/somulo1/ascii-art-web',
    liveUrl: 'https://ascii-art-web.netlify.app'
  }
];

export const initialServices: Service[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
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
    id: '550e8400-e29b-41d4-a716-446655440002',
    title: 'Cybersecurity',
    description: 'Protecting networks and data with proactive security measures.',
    icon: 'bx bx-shield',
    bulletPoints: [
      'Network Security',
      'Incident Response',
      'Data Encryption',
      'Vulnerability Testing'
    ]
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
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
    id: '550e8400-e29b-41d4-a716-446655440004',
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
    id: '550e8400-e29b-41d4-a716-446655440005',
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

interface ContactInfo {
  email: string;
  location: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
    github: string;
  };
  [key: string]: any; // Allow dynamic keys
}

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