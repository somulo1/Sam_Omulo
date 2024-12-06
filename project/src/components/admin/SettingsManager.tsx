import React, { useState, useRef } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { uploadFile, getPublicUrl } from '../../utils/supabase';
import { trackEvent } from '../../utils/analytics';

const SettingsManager: React.FC = () => {
  const { 
    contactInfo, 
    setContactInfo, 
    profilePhoto, 
    updateProfilePhoto 
  } = usePortfolioStore();
  const [formData, setFormData] = useState(contactInfo);
  const [isHovering, setIsHovering] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactInfo(formData);
    alert('Settings updated successfully!');
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

  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Reset previous errors
      setUploadError(null);

      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setUploadError('Please upload a valid image (JPEG, PNG, or GIF)');
        return;
      }

      if (file.size > maxSize) {
        setUploadError('File size should be less than 5MB');
        return;
      }

      // Upload file to Supabase storage
      const uploadResult = await uploadFile(file, 'profile-photos');
      
      if (uploadResult) {
        const publicUrl = getPublicUrl('profile-photos', uploadResult.path);
        updateProfilePhoto(publicUrl);

        // Track event for analytics
        trackEvent('admin_profile_photo_uploaded', { 
          fileType: file.type, 
          fileSize: file.size 
        });
      }
    } catch (error) {
      console.error('Profile image upload error:', error);
      setUploadError('Failed to upload profile image');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Photo Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Profile Photo</h3>
          <div 
            className="relative w-64 h-64 mx-auto rounded-full overflow-hidden cursor-pointer group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={triggerFileInput}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/jpeg,image/png,image/gif"
              onChange={handleProfileImageUpload}
            />
            <img 
              src={profilePhoto} 
              alt="Profile" 
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50"
            />
            {isHovering && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white text-lg">Upload Photo</span>
              </div>
            )}
          </div>
          {uploadError && (
            <p className="text-red-500 text-sm text-center mt-2">{uploadError}</p>
          )}
        </div>

        {/* Contact Information Section */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <div className="space-y-4">
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
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Social Links</h3>
            <div className="space-y-4">
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
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsManager;