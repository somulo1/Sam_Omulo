import { usePortfolioStore } from '../../store/portfolioStore';
import React, { useState } from 'react';

const AboutController = () => {
  const { 
    aboutContent, 
    updateAboutContent, 
    certifications, 
    updateCertifications, 
    educationExperiences = [], 
    updateEducationExperiences, 
    workExperiences = [], 
    updateWorkExperiences 
  } = usePortfolioStore();
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

  const handleAddCertification = () => {
    const newCert = { title: '', institution: '', date: '', details: [] };
    updateCertifications([...certifications, newCert]);
  };

  const handleDeleteCertification = (index) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
        const updatedCertifications = certifications.filter((_, i) => i !== index);
        updateCertifications(updatedCertifications);
    }
  };

  const handleAddEducation = () => {
    const newEdu = { title: '', institution: '', date: '', details: [] };
    updateEducationExperiences([...educationExperiences, newEdu]);
  };

  const handleAddExperience = () => {
    const newExp = { position: '', company: '', date: '', responsibilities: [] };
    updateWorkExperiences([...workExperiences, newExp]);
  };

  const handleDeleteEducation = (index) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
        const updatedEducation = educationExperiences.filter((_, i) => i !== index);
        updateEducationExperiences(updatedEducation);
    }
  };

  const handleDeleteExperience = (index) => {
    if (window.confirm('Are you sure you want to delete this work experience entry?')) {
        const updatedExperience = workExperiences.filter((_, i) => i !== index);
        updateWorkExperiences(updatedExperience);
    }
  };

  const handleSaveEducation = () => {
    if (educationExperiences.some(edu => !edu.title || !edu.institution || !edu.date)) {
        setSuccessMessage('Please fill out all education fields before saving.');
        setTimeout(() => setSuccessMessage(''), 3000);
        return;
    }
    updateEducationExperiences(educationExperiences);
    setSuccessMessage('Education entries updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSaveExperience = () => {
    if (workExperiences.some(exp => !exp.position || !exp.company || !exp.date)) {
        setSuccessMessage('Please fill out all work experience fields before saving.');
        setTimeout(() => setSuccessMessage(''), 3000);
        return;
    }
    updateWorkExperiences(workExperiences);
    setSuccessMessage('Work experiences updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
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
          <button onClick={() => handleDeleteCertification(index)} className="btn-delete bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded w-50">Delete</button>
        </div>
      ))}
      <button onClick={handleSaveCertifications} className="btn-save bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save Certifications</button>
      <button onClick={handleAddCertification} className="btn-add bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Add Certification</button>

      <div className="experience-section mt-8">
        <div className="education-subsection mb-8">
          <h2 className="text-3xl font-bold mb-4">Education</h2>
          {educationExperiences && educationExperiences.length > 0 ? (
            educationExperiences.map((edu, index) => (
              <div key={index} className="flex flex-col space-y-2 p-4 border border-gray-200 rounded mb-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Education Entry #{index + 1}</h3>
                  <button 
                    onClick={() => handleDeleteEducation(index)} 
                    className="btn-delete bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </div>
                <label className="text-lg font-medium">Education Title:</label>
                <input 
                  type="text" 
                  className="p-2 border border-gray-300 rounded" 
                  value={edu.title} 
                  onChange={(e) => updateEducationExperiences([
                    ...educationExperiences.slice(0, index), 
                    { ...edu, title: e.target.value }, 
                    ...educationExperiences.slice(index + 1)
                  ])} 
                  placeholder="Degree/Certification Title" 
                />
                <label className="text-lg font-medium">Institution:</label>
                <input 
                  type="text" 
                  className="p-2 border border-gray-300 rounded" 
                  value={edu.institution} 
                  onChange={(e) => updateEducationExperiences([
                    ...educationExperiences.slice(0, index), 
                    { ...edu, institution: e.target.value }, 
                    ...educationExperiences.slice(index + 1)
                  ])} 
                  placeholder="School/University Name" 
                />
                <label className="text-lg font-medium">Date:</label>
                <input 
                  type="text" 
                  className="p-2 border border-gray-300 rounded" 
                  value={edu.date} 
                  onChange={(e) => updateEducationExperiences([
                    ...educationExperiences.slice(0, index), 
                    { ...edu, date: e.target.value }, 
                    ...educationExperiences.slice(index + 1)
                  ])} 
                  placeholder="e.g., 2020 - 2024" 
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500">No education entries available. Click 'Add Education' to add your first entry.</p>
          )}
          <div className="flex space-x-4 mt-4">
            <button 
              onClick={handleAddEducation} 
              className="btn-add bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Education
            </button>
            <button 
              onClick={handleSaveEducation} 
              className="btn-save bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Save Education
            </button>
          </div>
        </div>

        <div className="work-experience-subsection">
          <h2 className="text-3xl font-bold mb-4">Work Experience</h2>
          {workExperiences && workExperiences.length > 0 ? (
            workExperiences.map((exp, index) => (
              <div key={index} className="flex flex-col space-y-2 p-4 border border-gray-200 rounded mb-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Work Experience #{index + 1}</h3>
                  <button 
                    onClick={() => handleDeleteExperience(index)} 
                    className="btn-delete bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </div>
                <label className="text-lg font-medium">Position:</label>
                <input 
                  type="text" 
                  className="p-2 border border-gray-300 rounded" 
                  value={exp.position} 
                  onChange={(e) => updateWorkExperiences([
                    ...workExperiences.slice(0, index), 
                    { ...exp, position: e.target.value }, 
                    ...workExperiences.slice(index + 1)
                  ])} 
                  placeholder="Job Title" 
                />
                <label className="text-lg font-medium">Company:</label>
                <input 
                  type="text" 
                  className="p-2 border border-gray-300 rounded" 
                  value={exp.company} 
                  onChange={(e) => updateWorkExperiences([
                    ...workExperiences.slice(0, index), 
                    { ...exp, company: e.target.value }, 
                    ...workExperiences.slice(index + 1)
                  ])} 
                  placeholder="Company Name" 
                />
                <label className="text-lg font-medium">Date:</label>
                <input 
                  type="text" 
                  className="p-2 border border-gray-300 rounded" 
                  value={exp.date} 
                  onChange={(e) => updateWorkExperiences([
                    ...workExperiences.slice(0, index), 
                    { ...exp, date: e.target.value }, 
                    ...workExperiences.slice(index + 1)
                  ])} 
                  placeholder="e.g., Jan 2020 - Present" 
                />
                <label className="text-lg font-medium">Responsibilities:</label>
                <textarea 
                  className="p-2 border border-gray-300 rounded min-h-[100px]" 
                  value={exp.responsibilities.join('\n')} 
                  onChange={(e) => updateWorkExperiences([
                    ...workExperiences.slice(0, index), 
                    { ...exp, responsibilities: e.target.value.split('\n') }, 
                    ...workExperiences.slice(index + 1)
                  ])} 
                  placeholder="Enter each responsibility on a new line"
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500">No work experience entries available. Click 'Add Experience' to add your first entry.</p>
          )}
          <div className="flex space-x-4 mt-4">
            <button 
              onClick={handleAddExperience} 
              className="btn-add bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Experience
            </button>
            <button 
              onClick={handleSaveExperience} 
              className="btn-save bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Save Experience
            </button>
          </div>
        </div>
        {successMessage && (
          <p className="text-green-500 mt-4">{successMessage}</p>
        )}
      </div>
    </div>
  );
};

export default AboutController;
