import React, { useState } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { Mail, MapPin, Facebook, Twitter, Linkedin, Github } from 'lucide-react';
import Modal from './modals/Modal';

const ContactManager: React.FC = () => {
  const { contactInfo, setContactInfo } = usePortfolioStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(contactInfo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactInfo(formData);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Contact Information</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Edit Contact Info
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="text-blue-500" />
              <span>{contactInfo.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="text-blue-500" />
              <span>{contactInfo.location}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Facebook className="text-blue-500" />
              <a href={contactInfo.socialLinks.facebook} target="_blank" rel="noopener noreferrer" 
                 className="text-blue-500 hover:underline">
                Facebook Profile
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Twitter className="text-blue-500" />
              <a href={contactInfo.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                 className="text-blue-500 hover:underline">
                Twitter Profile
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Linkedin className="text-blue-500" />
              <a href={contactInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                 className="text-blue-500 hover:underline">
                LinkedIn Profile
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Github className="text-blue-500" />
              <a href={contactInfo.socialLinks.github} target="_blank" rel="noopener noreferrer"
                 className="text-blue-500 hover:underline">
                GitHub Profile
              </a>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Contact Information"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Facebook URL</label>
            <input
              type="url"
              name="socialLinks.facebook"
              value={formData.socialLinks.facebook}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Twitter URL</label>
            <input
              type="url"
              name="socialLinks.twitter"
              value={formData.socialLinks.twitter}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
            <input
              type="url"
              name="socialLinks.linkedin"
              value={formData.socialLinks.linkedin}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
            <input
              type="url"
              name="socialLinks.github"
              value={formData.socialLinks.github}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ContactManager;