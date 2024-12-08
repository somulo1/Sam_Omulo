import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolioStore } from '../store/portfolioStore';
import useAuthStore from '../stores/authStore';
import Image from '../components/common/Image';
import { fetchProjectImages } from '../lib/imageUpload';

// Define the ImageType interface
interface ImageType {
    id: string;
    file_path: string;
    file_name: string;
}

const Portfolio: React.FC = () => {
  const navigate = useNavigate();
  const { projects, services, skills, contactInfo, profilePhoto, aboutContent, certifications, educationExperiences, workExperiences, updateAboutContent } = usePortfolioStore();
  const { isAuthenticated } = useAuthStore();
  const [isHovering, setIsHovering] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ImageType[]>([]);
  const [subtitle, setSubtitle] = useState(aboutContent.subtitle);
  const [description, setDescription] = useState(aboutContent.description);

  const triggerFileInput = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fileInputRef.current?.click();
  };
  const handleImageFetch = async (projectId: string) => {
    try {
      const fetchedImages = await fetchProjectImages(projectId);
      // Handle fetched images...
    } catch (error) {
      setUploadError('Failed to fetch images. Please try again.');
    }
  };
  
  // In your render method or return statement
  {uploadError && <div className="error-message">{uploadError}</div>}
<div 
  onMouseEnter={() => setIsHovering(true)} 
  onMouseLeave={() => setIsHovering(false)} 
  style={{ backgroundColor: isHovering ? 'lightblue' : 'white' }}
>
  {/* Your content here */}
</div>
  const handleLoginClick = () => {
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };

    try {
      const response = await fetch('http://localhost:5000/api/send-email', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      });
      
      if (response.ok || response.status === 204) {
        alert('Message sent successfully!');
        (event.target as HTMLFormElement).reset();
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while sending the message. Please try again later.');
    }
  };

  const handleSaveChanges = () => {
    updateAboutContent({ title: aboutContent.title, subtitle, description });
  };

  const loadImages = async () => {
    // Check if initialProjects is defined and has items
    if (!projects || projects.length === 0) {
      console.error('No projects available or initialProjects is undefined');
      return;
    }

    const projectId = projects[0].id; // Assuming the first project's ID

    // Validate the project ID format
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId)) {
      console.error('Invalid project ID:', projectId);
      return;
    }

    try {
      console.log('Fetching images for project ID:', projectId);
      const fetchedImages = await fetchProjectImages(projectId);
      // Transform fetchedImages to match ImageType if necessary
      const formattedImages: ImageType[] = fetchedImages.map(image => ({
        id: image.id,
        file_path: image.storage_path, // Adjust as necessary
        file_name: image.image_url, // Adjust as necessary
      }));

      setImages(formattedImages);
    } catch (error) {
      console.error('Error fetching project images:', error);
      // Optionally, handle the error by displaying a message to the user
    }
  };

  useEffect(() => {
    setSubtitle(aboutContent.subtitle);
    setDescription(aboutContent.description);
  }, [aboutContent]);

  useEffect(() => {
    // Update the component state or UI when education or work experiences change
    // This is a placeholder for any logic you might want to implement
  }, [educationExperiences, workExperiences]);

  useEffect(() => {
    loadImages();
  }, [projects]);

  return (
    <div className="min-h-screen bg-[#081b29] text-[#ededed]">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full p-8 bg-[#081b29] flex justify-between items-center z-50">
        <h1 className="text-4xl font-bold">
          <a href="#home" className="text-[#ededed]">Samuel</a>
        </h1>

        {/* Hamburger Icon */}
        <button onClick={toggleMenu} className="md:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {/* Navigation Links */}
        <nav className={`flex flex-col md:flex-row md:gap-8 ${menuOpen ? 'block' : 'hidden'} md:block`}>
          <a href="#home" className="text-lg hover:text-[#00abf0] px-4">Home</a>
          <a href="#about" className="text-lg hover:text-[#00abf0] px-4">About</a>
          <a href="#services" className="text-lg hover:text-[#00abf0] px-4">Services</a>
          <a href="#skills" className="text-lg hover:text-[#00abf0] px-4">Skills</a>
          <a href="#portfolio" className="text-lg hover:text-[#00abf0] px-4">Portfolio</a>
          <a href="#contact" className="text-lg hover:text-[#00abf0] px-4">Contact</a>
          
          {/* Login/Logout Button */}
          {isAuthenticated ? (
            <button 
              onClick={() => navigate('/login')} 
              className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          ) : (
            <button 
              onClick={handleLoginClick} 
              className="ml-4 px-4 py-2 bg-[#00abf0] text-[#081b29] rounded-lg hover:bg-opacity-80 transition-colors"
            >
              Login
            </button>
          )}
        </nav>
      </header>

      {/* Home Section */}
      <section id="home" className="min-h-screen flex flex-col md:flex-row items-center justify-center px-8 pt-40 space-y-4 md:space-y-0 md:justify-center"> 
        <div className="relative w-80 h-80 rounded-full overflow-hidden mb-2 md:mb-0 md:mr-8">
          <img 
            src={'/src/imj/profilepic.png'} 
            alt="Profile" 
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          {profilePhoto ? (
            <img src={profilePhoto.file_path} alt="Profile Photo" />
          ) : (
            <img src="defaultProfilePhotoPath.jpg" alt="Default Profile Photo" />
          )}
        </div>
        <div className="max-w-[75%] md:max-w-[75vw] flex flex-col items-center text-center space-y-2">
          <h1 className="text-5xl font-bold">Hi, I'm Samuel</h1>
          <h3 className="text-2xl text-[#00abf0]">Software Developer</h3>
          <p className="text-lg">
            I'm highly motivated and results-driven software developer with a strong academic background in computer security and forensics and hands-on experience in software development. Skilled in Go programming, full-stack development, and cloud technologies, I am committed to delivering efficient, scalable solutions. With a focus on continuous learning and problem-solving, I seek to contribute to innovative projects and collaborate with cross-functional teams to drive organizational success.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="#contact" className="px-6 py-3 border-2 border-[#00abf0] rounded-lg hover:bg-[#00abf0] hover:text-[#081b29] transition-colors">
              Hire Me
            </a>
            <a href="#contact" className="px-6 py-3 bg-[#00abf0] text-[#081b29] rounded-lg hover:bg-transparent hover:text-[#00abf0] border-2 border-[#00abf0] transition-colors">
              Let's Talk
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about bg-[#112e42] py-20 px-8 space-y-8" id="about">
        <div className="about-content space-y-6 text-center">
          <h2 className="heading text-4xl font-bold text-[#00abf0]">{aboutContent.title}</h2>
          <div className="about-section">
            <h2 className="text-3xl font-bold text-[#00abf0] mb-4">About Me</h2>
            <p className="text-lg mb-2 text-white">{subtitle}</p>
            <p className="text-base text-white mb-4 text-center mx-auto max-w-[75%]">{description}</p>
          </div>
          <div className="about-grid grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* First Column: Certifications */}
            <div className="about-certifications bg-[#081b29] p-6 rounded-lg shadow-lg border-l-4 border-[#00abf0]">
              <h3 className="text-3xl font-semibold text-[#00abf0]">Certifications</h3>
              <div className="timeline relative">
                <div className="absolute left-0 top-0 h-full border-l-4 border-[#00abf0]"></div>
                <div className="timeline">
                  {certifications.map((cert, index) => (
                    <div key={index} className="timeline-item flex items-center text-left relative mb-8">
                      <div className="w-4 h-4 bg-[#00abf0] rounded-full absolute left-[-8px] top-1/2 transform -translate-y-1/2 border-2 border-white"></div>
                      <div className="ml-8">
                        <span className="date text-[#00abf0] mr-4 relative z-10">{cert.date}</span>
                        <h4 className="text-lg font-bold relative z-10">{cert.title}</h4>
                        <p className="text-gray-300 relative z-10">{cert.institution}</p>
                        <ul className="list-disc pl-5">
                          {cert.details.map((detail: string, i: number) => <li key={i}>{detail}</li>)}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Second Column: Education & Experience */}
            <div className="about-experience bg-[#081b29] p-6 rounded-lg shadow-lg border-l-4 border-[#00abf0]">
              <h3 className="text-3xl font-semibold text-[#00abf0]">Education &amp; Experience</h3>
              <div className="education-experience-section relative">
                <div className="absolute left-0 top-0 h-full border-l-4 border-[#00abf0]"></div>
                <h4 className="text-2xl font-bold text-white mb-2">Work & Experience</h4>
                {workExperiences.length > 0 ? (
                  workExperiences.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((work, index) => (
                    <div key={index} className="timeline-item flex items-center text-left relative mb-8">
                      <div className="w-4 h-4 bg-[#00abf0] rounded-full absolute left-[-8px] top-1/2 transform -translate-y-1/2 border-2 border-white"></div>
                      <div className="ml-8">
                        <span className="date text-[#00abf0] mr-4 relative z-10">{work.date}</span>
                        <h5 className="text-lg font-bold relative z-10">{work.position}</h5>
                        <p className="text-gray-300 relative z-10">{work.company}</p>
                        <ul className="list-disc pl-5">
                          {work.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                        </ul>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No work experience available.</p>
                )}
                <h4 className="text-2xl font-bold text-white mb-2">Education</h4>
                {educationExperiences.length > 0 ? (
                  educationExperiences.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((edu, index) => (
                    <div key={index} className="timeline-item flex items-center text-left relative mb-8">
                      <div className="w-4 h-4 bg-[#00abf0] rounded-full absolute left-[-8px] top-1/2 transform -translate-y-1/2 border-2 border-white"></div>
                      <div className="ml-8">
                        <span className="date text-[#00abf0] mr-4 relative z-10">{edu.date}</span>
                        <h5 className="text-lg font-bold relative z-10">{edu.title}</h5>
                        <p className="text-gray-300 relative z-10">{edu.institution}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No education experience available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="btn-box1 flex justify-center my-8">
          <a href="/src/resume/SAMUELOKOTHOMULORESUME.pdf" target="_blank" className="bg-[#00abf0] text-white py-2 px-4 rounded shadow hover:bg-[#0091c0] transition duration-200">View Resume</a>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-8 bg-[#112e42]">
        <h2 className="text-4xl font-bold text-center mb-16">My <span className="text-[#00abf0]">Services</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-[#081b29] p-8 rounded-lg hover:border-[#00abf0] border-2 border-transparent transition-all transform hover:scale-105">
              <i className={`text-4xl text-[#00abf0] mb-4 block ${service.icon}`}></i>
              <h3 className="text-3xl font-bold mb-4">{service.title}</h3>
              <p className="text-lg">{service.description}</p>
              <ul className="space-y-2">
                {service.bulletPoints.map((point, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#00abf0] rounded-full"></span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-8">
        <h2 className="text-4xl font-bold text-center mb-16">Skills <span className="text-[#00abf0]">Summary</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skills.map((skill) => (
            <div key={skill.id} className="bg-[#112e42] p-8 rounded-lg hover:border-[#00abf0] border-2 border-transparent transition-all transform hover:scale-105">
              <i className={`text-4xl text-[#00abf0] mb-4 block ${skill.icon}`}></i>
              <h3 className="text-3xl font-bold mb-4">{skill.category}</h3>
              <ul className="space-y-2">
                {skill.items.map((item, index) => (
                  <li key={index} className="bg-[#081b29] px-4 py-2 rounded-full text-center hover:bg-[#00abf0] hover:text-[#081b29] transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="portfolio" className="py-20 px-8 bg-[#112e42]">
        <h2 className="text-4xl font-bold text-center mb-16">Latest <span className="text-[#00abf0]">Projects</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-[#081b29] rounded-lg overflow-hidden hover:border-[#00abf0] border-2 border-transparent transition-all transform hover:scale-105">
              <Image 
                src={project.imageUrl} 
                alt={project.title}
                className="w-full h-48 object-cover"
                onLoadError={(error) => console.error('Failed to load project image:', error)}
              />
              <div className="p-6">
                <h3 className="text-3xl font-bold mb-4">{project.title}</h3>
                <p className="text-lg">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="bg-[#112e42] px-3 py-1 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer" 
                     className="flex-1 text-center px-4 py-2 bg-[#00abf0] text-[#081b29] rounded-lg hover:bg-transparent hover:text-[#00abf0] border-2 border-[#00abf0] transition-colors">
                    View Code
                  </a>
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                       className="flex-1 text-center px-4 py-2 border-2 border-[#00abf0] rounded-lg hover:bg-[#00abf0] hover:text-[#081b29] transition-colors">
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2>Portfolio Images</h2>
          {images.map(image => (
            <img key={image.id} src={image.file_path} alt={image.file_name} />
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-8">
        <h2 className="text-4xl font-bold text-center mb-16">Get in <span className="text-[#00abf0]">Touch</span></h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#112e42] p-8 rounded-lg">
            <h3 className="text-3xl font-bold mb-6">Send Me a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="Your Name" 
                  className="w-full p-3 bg-[#081b29] rounded-lg focus:ring-2 focus:ring-[#00abf0] outline-none"
                />
              </div>
              <div>
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="Your Email" 
                  className="w-full p-3 bg-[#081b29] rounded-lg focus:ring-2 focus:ring-[#00abf0] outline-none"
                />
              </div>
              <div>
                <textarea 
                  rows={6} 
                  name="message"
                  required
                  placeholder="Your Message" 
                  className="w-full p-3 bg-[#081b29] rounded-lg focus:ring-2 focus:ring-[#00abf0] outline-none"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full py-3 bg-[#00abf0] text-[#081b29] rounded-lg hover:bg-transparent hover:text-[#00abf0] border-2 border-[#00abf0] transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
          <div className="bg-[#112e42] p-8 rounded-lg">
            <h3 className="text-3xl font-bold mb-6">Contact Details</h3>
            <div className="space-y-4">
              <p className="flex items-center gap-3">
                <i className="bx bx-mail-send text-[#00abf0] text-2xl"></i>
                {contactInfo.email}
              </p>
              <p className="flex items-center gap-3">
                <i className="bx bx-map text-[#00abf0] text-2xl"></i>
                {contactInfo.location}
              </p>
              <div className="flex gap-4 mt-8">
                <a href={contactInfo.socialLinks.facebook} className="text-2xl text-[#00abf0] hover:text-[#ededed]">
                  <i className="bx bxl-facebook"></i>
                </a>
                <a href={contactInfo.socialLinks.twitter} className="text-2xl text-[#00abf0] hover:text-[#ededed]">
                  <i className="bx bxl-twitter"></i>
                </a>
                <a href={contactInfo.socialLinks.linkedin} className="text-2xl text-[#00abf0] hover:text-[#ededed]">
                  <i className="bx bxl-linkedin"></i>
                </a>
                <a href={contactInfo.socialLinks.github} className="text-2xl text-[#00abf0] hover:text-[#ededed]">
                  <i className="bx bxl-github"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#081b29] py-8 text-center">
        <p className="text-lg"> 2024 Samuel Omulo | All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Portfolio;