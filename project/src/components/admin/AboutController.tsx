import { usePortfolioStore } from '../../store/portfolioStore';
import React, { useState } from 'react';

const AboutController = () => {
  const { aboutContent, updateAboutContent, certifications, updateCertifications, educationExperience, updateEducationExperience } = usePortfolioStore();
  const [successMessage, setSuccessMessage] = useState('');

  const handleSaveAboutChanges = () => {
    updateAboutContent(aboutContent);
    setSuccessMessage('About section changes saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSaveCertifications = () => {
    updateCertifications(certifications);
    setSuccessMessage('Certifications updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSaveEducation = () => {
    updateEducationExperience(educationExperience);
    setSuccessMessage('Education & Experience updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleAddCertification = () => {
    const newCert = { title: '', institution: '', date: '', details: [] };
    updateCertifications([...certifications, newCert]);
  };

  const handleAddEducation = () => {
    const newEdu = { title: '', institution: '', date: '', details: [] };
    updateEducationExperience([...educationExperience, newEdu]);
  };

  return (
    <div className="about-controller space-y-4 p-4 bg-white rounded shadow-md">
      <h2 className="text-3xl font-bold mb-4">Edit About Section</h2>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-lg font-medium">Title:</label>
          <input type="text" className="input-title p-2 border border-gray-300 rounded" value={aboutContent.title} onChange={(e) => updateAboutContent({ ...aboutContent, title: e.target.value })} placeholder="Title" />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-lg font-medium">Subtitle:</label>
          <input type="text" className="input-subtitle p-2 border border-gray-300 rounded" value={aboutContent.subtitle} onChange={(e) => updateAboutContent({ ...aboutContent, subtitle: e.target.value })} placeholder="Subtitle" />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-lg font-medium">Description:</label>
          <textarea className="input-description p-2 border border-gray-300 rounded" value={aboutContent.description} onChange={(e) => updateAboutContent({ ...aboutContent, description: e.target.value })} placeholder="Description" rows={5} />
        </div>
      </div>
      <button onClick={handleSaveAboutChanges} className="btn-save bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save About Changes</button>
      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}

      <h2 className="text-3xl font-bold mb-4">Edit Certifications</h2>
      {certifications.map((cert, index) => (
        <div key={index} className="flex flex-col space-y-2">
          <label className="text-lg font-medium">Certification Title:</label>
          <input type="text" className="p-2 border border-gray-300 rounded" value={cert.title} onChange={(e) => updateCertifications([...certifications.slice(0, index), { ...cert, title: e.target.value }, ...certifications.slice(index + 1)])} placeholder="Certification Title" />
          <label className="text-lg font-medium">Institution:</label>
          <input type="text" className="p-2 border border-gray-300 rounded" value={cert.institution} onChange={(e) => updateCertifications([...certifications.slice(0, index), { ...cert, institution: e.target.value }, ...certifications.slice(index + 1)])} placeholder="Institution" />
          <label className="text-lg font-medium">Date:</label>
          <input type="text" className="p-2 border border-gray-300 rounded" value={cert.date} onChange={(e) => updateCertifications([...certifications.slice(0, index), { ...cert, date: e.target.value }, ...certifications.slice(index + 1)])} placeholder="Date" />
        </div>
      ))}
      <button onClick={handleSaveCertifications} className="btn-save bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save Certifications</button>
      <button onClick={handleAddCertification} className="btn-add bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Add Certification</button>

      <h2 className="text-3xl font-bold mb-4">Edit Education & Experience</h2>
      {educationExperience.map((edu, index) => (
        <div key={index} className="flex flex-col space-y-2">
          <label className="text-lg font-medium">Education Title:</label>
          <input type="text" className="p-2 border border-gray-300 rounded" value={edu.title} onChange={(e) => updateEducationExperience([...educationExperience.slice(0, index), { ...edu, title: e.target.value }, ...educationExperience.slice(index + 1)])} placeholder="Education Title" />
          <label className="text-lg font-medium">Institution:</label>
          <input type="text" className="p-2 border border-gray-300 rounded" value={edu.institution} onChange={(e) => updateEducationExperience([...educationExperience.slice(0, index), { ...edu, institution: e.target.value }, ...educationExperience.slice(index + 1)])} placeholder="Institution" />
          <label className="text-lg font-medium">Date:</label>
          <input type="text" className="p-2 border border-gray-300 rounded" value={edu.date} onChange={(e) => updateEducationExperience([...educationExperience.slice(0, index), { ...edu, date: e.target.value }, ...educationExperience.slice(index + 1)])} placeholder="Date" />
        </div>
      ))}
      <button onClick={handleSaveEducation} className="btn-save bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save Education & Experience</button>
      <button onClick={handleAddEducation} className="btn-add bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Add Education</button>
    </div>
  );
};

export default AboutController;
