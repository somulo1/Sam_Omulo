import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  FileText, 
  Image, 
  MessageSquare,
  LogOut,
  Plus,
  ChevronDown,
  Database
} from 'lucide-react';

// State Management imports
import useAuthStore from '../stores/authStore';
import { useAdminStore } from '../stores/adminStore';

// Core Management Components
import ProjectsManager from '../components/admin/ProjectsManager';
import SkillsManager from '../components/admin/SkillsManager';
import ServicesManager from '../components/admin/ServicesManager';
import ContactManager from '../components/admin/ContactManager';
import SettingsManager from '../components/admin/SettingsManager';
import { CustomizationSettings } from '../components/admin/CustomizationSettings';
import { NotificationSettings } from '../components/admin/NotificationSettings';
import {PerformanceSettings} from '../components/admin/PerformanceSettings';
import { SEOSettings } from '../components/admin/SEOSettings';
import SecuritySettings from '../components/admin/SecuritySettings';
import Analytics from '../components/admin/Analytics';
import ThemeEditor from '../components/admin/ThemeEditor';
import AdminModals from '../components/admin/modals/AdminModals';
import AccessControl from '../components/admin/AccessControl';
import ImageUpload from '../components/admin/ImageUpload';
import AboutController from '../components/admin/AboutController';
import { ImageUploadTest } from '../components/ImageUploadTest';

interface ImageUploaderProps {
  projectId: string;
  setImages: (images: any[]) => void;
  name: string;
  onChange: (imageUrl: string | null) => void;
  onError?: (error: string | { message: string; code?: string }) => void;
  defaultImage?: string;
  bucket?: string;
  onSubmit?: (imageUrl: string) => void;
}

const ImageUploader = (props: Partial<ImageUploaderProps>) => {
  // Provide default values for required props
  const defaultProps: ImageUploaderProps = {
    projectId: props.projectId || 'default',
    name: props.name || 'image-upload',
    setImages: props.setImages || (() => {}),
    onChange: props.onChange || (() => {}),
    ...props
  };
  
  return <ImageUpload {...defaultProps} />;
};

const adminTabs = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    component: Analytics
  },
  {
    name: 'Project Section',
    icon: FileText,
    component: ProjectsManager
  },
  {
    name: 'Skill Section',
    icon: Users,
    component: SkillsManager
  },
  {
    name: 'Services Section',
    icon: MessageSquare,
    component: ServicesManager
  },
  {
    name: 'About Section',
    icon: FileText,
    component: AboutController
  },
  {
    name: 'Contact section',
    icon: MessageSquare,
    component: ContactManager
  },
  {
    name: 'Storage Test',
    icon: Database,
    component: ImageUploadTest
  },
  {
    name: 'Settings',
    icon: Settings,
    component: SettingsManager
  },
  {
    name: 'Site Customization',
    icon: Settings,
    component: CustomizationSettings,
  },
  {
    name: 'Notifications',
    icon: MessageSquare,
    component: NotificationSettings,
  },
  {
    name: 'Performance',
    icon: Settings,
    component: PerformanceSettings,
  },
  {
    name: 'SEO',
    icon: Settings,
    component: SEOSettings,
  },
  {
    name: 'Security',
    icon: Settings,
    component: SecuritySettings,
  },
  {
    name: 'Analytics',
    icon: Settings,
    component: Analytics,
  },
  {
    name: 'Themes Settings',
    icon: Settings,
    component: ThemeEditor,
  },
  {
    name: 'Access Control',
    icon: Settings,
    component: AccessControl,
  },
  {
    name: 'Socia Media',
    icon: Image,
    component: ContactManager,
  },
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [selectedTab, setSelectedTab] = useState(0);
  const [currentForm, setCurrentForm] = useState<string | null>(null);
  const adminStore = useAdminStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleAddNew = (type: 'project' | 'skill' | 'service') => {
    setCurrentForm(type);
    setActiveModal('new');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleOpenModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
              </div>
              <div className="block md:hidden">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="ml-3 p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                >
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <div className="relative ml-3">
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center max-w-xs bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-800">
                        {user.email?.[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {user.email}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                  </button>
                </div>
                {isUserMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden ${isUserMenuOpen ? 'block fixed top-0 left-0 w-full h-screen bg-white shadow-md z-50' : 'hidden'}`}>  
        <div className="flex flex-col p-4">
          {adminTabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedTab(index);
                setIsUserMenuOpen(false); // Close menu on tab selection
              }}
              className="flex items-center p-2 text-gray-700 hover:bg-gray-100"
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <div className="flex gap-8">
            {/* Sidebar Navigation */}
            <div className="hidden md:block w-64 flex-shrink-0"> 
              <Tab.List className="flex flex-col space-y-1">
                {adminTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Tab
                      key={tab.name}
                      className={({ selected }) =>
                        `flex items-center p-2 rounded-md ${selected ? 'bg-gray-100' : 'text-gray-700 hover:bg-gray-100'}`
                      }
                    >
                      <Icon className="mr-2 h-5 w-5" />
                      {tab.name}
                    </Tab>
                  );
                })}
              </Tab.List>

              {/* Add New Button */}
              <button
                onClick={() => handleAddNew('project')}
                className="mt-6 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-grow">
              <Tab.Panels>
                {adminTabs.map((tab, index) => (
                  <Tab.Panel key={index} className="p-4">
                    <tab.component
                      settings={adminStore.settings}
                      updateSettings={adminStore.updateSettings}
                      onAddNew={handleAddNew}
                      updateTheme={adminStore.updateTheme}
                      toggleMaintenanceMode={adminStore.toggleMaintenanceMode}
                      togglePublicAccess={adminStore.togglePublicAccess}
                      addAllowedIP={adminStore.addAllowedIP}
                      removeAllowedIP={adminStore.removeAllowedIP}
                      updateFonts={adminStore.updateFonts}
                      updateFontSizes={adminStore.updateFontSizes}
                      updateSpacing={adminStore.updateSpacing}
                      updateEffects={adminStore.updateEffects}
                      updateSEO={adminStore.updateSEO}
                      updateSecurity={adminStore.updateSecurity}
                      updateNotifications={adminStore.updateNotifications}
                      updatePerformance={adminStore.updatePerformance}
                      ImageUploader={ImageUploader}
                    />
                    
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </div>
          </div>
        </Tab.Group>
        {/* Modals */}
        <AdminModals
          activeModal={activeModal}
          currentForm={currentForm}
          onClose={() => setActiveModal(null)}
        />
        </div>
    </div>
  );
};

export default AdminDashboard;
