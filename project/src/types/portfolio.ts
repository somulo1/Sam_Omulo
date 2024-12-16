import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the Theme interface
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
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

// Initialize the theme object
const theme: Theme = {
  colors: {
    primary: '#3490dc',
    secondary: '#ffed4a',
    background: '#ffffff',
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
const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set) => ({
      theme,
      // Other state properties...
    }),
    {
      name: 'portfolio-storage',
      // Other persist options...
    }
  )
);

// Export the store
export default usePortfolioStore;