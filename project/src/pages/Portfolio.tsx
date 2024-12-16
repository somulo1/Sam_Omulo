import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePortfolioStore from "../store/portfolioStore";
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
  const { projects, services, skills, contactInfo, profilePhoto, aboutContent, certifications, educationExperiences, workExperiences, updateAboutContent, theme } = usePortfolioStore();
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
  style={{ backgroundColor: isHovering ? theme.colors.backgroundLight : theme.colors.background }}
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
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background, color: theme.colors.text.primary }}>
<header className="fixed top-0 left-0 w-full p-8 flex justify-between items-center" style={{ backgroundColor: theme.colors.background }}>
  <h1 className="text-4xl font-bold">
    <a href="#home" style={{ color: theme.colors.text.primary }}>Samuel</a>
  </h1>

  {/* Hamburger Icon */}
  <div className="md:hidden">
    {/* Implement your hamburger icon here */}
  </div>

  {/* Navigation Links */}
  <nav className={`hidden md:flex md:gap-8`}>
    <a href="#home" className="text-lg hover:text-[#00abf0] px-4" style={{ color: theme.colors.text.primary }}>Home</a>
    <a href="#about" className="text-lg hover:text-[#00abf0] px-4" style={{ color: theme.colors.text.primary }}>About</a>
    <a href="#services" className="text-lg hover:text-[#00abf0] px-4" style={{ color: theme.colors.text.primary }}>Services</a>
    <a href="#skills" className="text-lg hover:text-[#00abf0] px-4" style={{ color: theme.colors.text.primary }}>Skills</a>
    <a href="#portfolio" className="text-lg hover:text-[#00abf0] px-4" style={{ color: theme.colors.text.primary }}>Portfolio</a>
    <a href="#contact" className="text-lg hover:text-[#00abf0] px-4" style={{ color: theme.colors.text.primary }}>Contact</a>
    {/* Login/Logout Button */}
    {isAuthenticated ? (
            <button 
              onClick={() => navigate('/login')} 
              className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              style={{ backgroundColor: theme.colors.error, color: theme.colors.text.primary }}
            >
              Logout
            </button>
          ) : (
            <button 
              onClick={handleLoginClick} 
              className="ml-4 px-4 py-2 bg-[#00abf0] text-[#081b29] rounded-lg hover:bg-opacity-80 transition-colors"
              style={{ backgroundColor: theme.colors.primary, color: theme.colors.text.primary }}
            >
              Login
            </button>
          )}
  </nav>
  
</header>

      {/* Home Section */}
      <section id="home" className="min-h-screen flex flex-col md:flex-row items-center justify-center px-8 pt-40 space-y-4 md:space-y-0 md:justify-center" style={{ backgroundColor: theme.colors.background }}>
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
          <h1 className="text-5xl font-bold" style={{ color: theme.colors.text.primary }}>Hi, I'm Samuel</h1>
          <h2 className="text-2xl text-[#00abf0]" style={{ color: theme.colors.primary }}><b>Software Developer</b></h2>
          <p className="text-lg" style={{ color: theme.colors.text.primary }}>
            I'm highly motivated and results-driven software developer with a strong academic background in computer security and forensics and hands-on experience in software development. Skilled in Go programming, full-stack development, and cloud technologies, I am committed to delivering efficient, scalable solutions. With a focus on continuous learning and problem-solving, I seek to contribute to innovative projects and collaborate with cross-functional teams to drive organizational success.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="#contact" className="px-6 py-3 border-2 border-[#00abf0] rounded-lg hover:bg-[#00abf0] hover:text-[#081b29] transition-colors"
              style={{ color: theme.colors.text.primary, borderColor: theme.colors.primary, hover: { backgroundColor: theme.colors.primary, color: theme.colors.text.secondary } }}
            >
              Hire Me
            </a>
            <a href="#contact" className="px-6 py-3 bg-[#00abf0] text-[#081b29] rounded-lg hover:bg-transparent hover:text-[#00abf0] border-2 border-[#00abf0] transition-colors"
              style={{ backgroundColor: theme.colors.secondary, color: theme.colors.text.secondary, hover: { backgroundColor: theme.colors.background, color: theme.colors.primary } }}
            >
              Let's Talk
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about py-20 px-8" style={{ backgroundColor: theme.colors.background }}>
        <div className="about-content space-y-6 text-center">
          <h2 className="heading text-4xl font-bold" style={{ color: theme.colors.primary }}>{aboutContent.title}</h2>
          <div className="about-section" style={{ backgroundColor: theme.colors.background, padding: '20px', borderRadius: '8px' }}>
            <h2 className="text-4xl font-bold text-center mb-16" style={{ color: theme.colors.text.primary }}>About <span className="text-[#00abf0]" style={{ color: theme.colors.primary }}>Me </span></h2>
            <p className="text-lg mb-2" style={{ color: theme.colors.text.primary }}>{subtitle}</p>
            <p className="text-lg mb-4 text-center mx-auto max-w-[75%]" style={{ color: theme.colors.text.primary }}>{description}</p>
          </div>
          <div className="about-grid grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* First Column: Certifications */}
            
            <div className="about-certifications rounded-lg" style={{ backgroundColor: theme.colors.accent, padding: '20px', borderRadius: '12px' }}>
            <div className="timeline relative rounded-lg" style={{ backgroundColor: theme.colors.background, borderColor: theme.colors.primary }}>
              <h3 className="text-3xl font-semibold" style={{ color: theme.colors.primary }}>Certifications</h3>
              
                <div className="absolute left-0 top-0 h-full border-l-4 border-[#00abf0]" style={{ borderColor: theme.colors.primary }}></div>
                <div className="timeline rounded-lg" style={{ backgroundColor: theme.colors.background, borderColor: theme.colors.primary }}>
                  {certifications.map((cert, index) => (
                    <div key={index} className="timeline-item flex items-center text-left relative mb-8">
                      <div className="w-4 h-4 bg-[#00abf0] rounded-full absolute left-[-8px] top-1/2 transform -translate-y-1/2 border-2 border-white" style={{ backgroundColor: theme.colors.primary }}></div>
                      <div className="ml-8">
                        <span className="date text-[#00abf0] mr-4 relative z-10" style={{ color: theme.colors.primary }}>{cert.date}</span>
                        <h4 className="text-lg font-bold relative z-10" style={{ color: theme.colors.text.primary }}>{cert.title}</h4>
                        <p className="text-gray-300 relative z-10" style={{ color: theme.colors.text.primary }}>{cert.institution}</p>
                        <ul className="list-disc pl-5">
                          {cert.details.map((detail: string, i: number) => <li key={i} style={{ color: theme.colors.text.primary }}>{detail}</li>)}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Second Column: Education & Experience */}
            <div className="about-experience" style={{ backgroundColor: theme.colors.accent, padding: '20px', borderRadius: '12px'}}>
              <h3 className="text-3xl font-semibold" style={{ color: theme.colors.primary }}>Education &amp; Experience</h3>
              <div className="education-experience-section relative rounded-lg" style={{ backgroundColor: theme.colors.background, borderColor: theme.colors.primary }}>
                <div className="absolute left-0 top-0 h-full border-l-4 border-[#00abf0]" style={{ borderColor: theme.colors.primary }}></div>
                <h4 className="text-2xl font-bold text-white mb-2" style={{ color: theme.colors.primary }}>Work & Experience</h4>
                {workExperiences.length > 0 ? (
                  workExperiences.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((work, index) => (
                    <div key={index} className="timeline-item flex items-center text-left relative mb-8">
                      <div className="w-4 h-4 bg-[#00abf0] rounded-full absolute left-[-8px] top-1/2 transform -translate-y-1/2 border-2 border-white" style={{ backgroundColor: theme.colors.primary }}></div>
                      <div className="ml-8">
                        <span className="date text-[#00abf0] mr-4 relative z-10" style={{ color: theme.colors.primary }}>{work.date}</span>
                        <h5 className="text-lg font-bold relative z-10" style={{ color: theme.colors.text.primary }}>{work.position}</h5>
                        <p className="text-gray-300 relative z-10" style={{ color: theme.colors.text.primary }}>{work.company}</p>
                        <ul className="list-disc pl-5">
                          {work.responsibilities.map((resp, i) => <li key={i} style={{ color: theme.colors.text.primary }}>{resp}</li>)}
                        </ul>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500" style={{ color: theme.colors.text.primary }}>No work experience available.</p>
                )}
                <h4 className="text-2xl font-bold text-white mb-2" style={{ color: theme.colors.primary }}>Education</h4>
                {educationExperiences.length > 0 ? (
                  educationExperiences.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((edu, index) => (
                    <div key={index} className="timeline-item flex items-center text-left relative mb-8">
                      <div className="w-4 h-4 bg-[#00abf0] rounded-full absolute left-[-8px] top-1/2 transform -translate-y-1/2 border-2 border-white" style={{ backgroundColor: theme.colors.primary }}></div>
                      <div className="ml-8">
                        <span className="date text-[#00abf0] mr-4 relative z-10" style={{ color: theme.colors.primary }}>{edu.date}</span>
                        <h5 className="text-lg font-bold relative z-10" style={{ color: theme.colors.text.primary }}>{edu.title}</h5>
                        <p className="text-gray-300 relative z-10" style={{ color: theme.colors.text.primary }}>{edu.institution}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500" style={{ color: theme.colors.text.primary }}>No education experience available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="btn-box1 flex justify-center my-8">
          <a href="/src/resume/SAMUELOKOTHOMULORESUME.pdf" target="_blank" className="bg-[#00abf0] text-white py-2 px-4 rounded shadow hover:bg-[#0091c0] transition duration-200"
            style={{ backgroundColor: theme.colors.secondary, color: theme.colors.text.secondary, hover: { backgroundColor: theme.colors.secondary } }}
          >
            View Resume
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-8" style={{ backgroundColor: theme.colors.background }}>
        <h2 className="text-4xl font-bold text-center mb-16" style={{ color: theme.colors.text.primary }}>My <span className="text-[#00abf0]" style={{ color: theme.colors.primary }}>Services</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-[#081b29] p-8 rounded-lg hover:border-[#00abf0] border-2 border-transparent transition-all transform hover:scale-105"
              style={{ backgroundColor: theme.colors.accent, borderColor: theme.colors.primary }}
            >
              <i className={`text-5xl text-[#00abf0] mb-4 block text-center ${service.icon}`} style={{ color: theme.colors.primary }}></i>
              <h3 className="text-3xl font-bold mb-4 text-center" style={{ color: theme.colors.text.primary }}>{service.title}</h3><div className="flex justify-center items-center">
                </div>
              <p className="text-lg" style={{ color: theme.colors.text.primary }}>{service.description}</p>
              <ul className="flex flex-wrap gap-2">
                {service.bulletPoints.map((point, index) => (
                  <li key={index} className="bg-[#081b29] px-4 py-2 rounded-full text-center border-2 border-[#00abf0] transition-colors hover:border-[#3FFF3C] hover:bg-[#3FFF3C] hover:text-[#081b29]"
                    style={{ backgroundColor: theme.colors.surface, color: theme.colors.primary }}>
                    <span className="w-2 h-2 bg-[#00abf0] rounded-full" style={{ backgroundColor: theme.colors.accent  }}></span>
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
        <h2 className="text-4xl font-bold text-center mb-16" style={{ color: theme.colors.text.primary }}>
          Skills <span className="text-[#00abf0]" style={{ color: theme.colors.primary }}>Summary</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skills.map((skill) => (
            <div key={skill.id} className="bg-[#112e42] p-8 rounded-lg border-2 border-transparent transition-all transform hover:scale-105 hover:border-[#00abf0]"
              style={{ backgroundColor: theme.colors.accent, borderColor: theme.colors.primary }}
            >
              <i className={`text-5xl text-[#00abf0] mb-4 block text-center ${skill.icon}`} style={{ color: theme.colors.primary }}></i>
              <h3 className="text-3xl font-bold mb-4 text-center" style={{ color: theme.colors.text.primary }}>{skill.category}</h3>
              <ul className="flex flex-wrap gap-2">
                {skill.items.map((item, index) => (
                  <li key={index} className="bg-[#081b29] px-4 py-2 rounded-full text-center border-2 border-[#00abf0] transition-colors hover:border-[#3FFF3C] hover:bg-[#3FFF3C] hover:text-[#081b29]"
                    style={{ backgroundColor: theme.colors.surface, color: theme.colors.primary, maxWidth: 'fit-content' }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="portfolio" className="py-20 px-8" style={{ backgroundColor: theme.colors.background }}>
        <h2 className="text-4xl font-bold text-center mb-16" style={{ color: theme.colors.text.primary }}>Latest <span className="text-[#00abf0]" style={{ color: theme.colors.primary }}>Projects</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-[#081b29] rounded-lg overflow-hidden hover:border-[#00abf0] border-2 border-transparent transition-all transform hover:scale-105"
              style={{ backgroundColor: theme.colors.accent, borderColor: theme.colors.primary }}
            >
              <Image 
                src={project.imageUrl} 
                alt={project.title}
                className="w-full h-48 object-cover"
                onLoadError={(error) => console.error('Failed to load project image:', error)}
              />
              <div className="p-6">
                <h3 className="text-3xl font-bold mb-4" style={{ color: theme.colors.text.primary }}>{project.title}</h3>
                <p className="text-lg" style={{ color: theme.colors.text.primary }}>{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="bg-[#112e42] px-3 py-1 rounded-full text-sm"
                      style={{ backgroundColor: theme.colors.background, color: theme.colors.text.primary }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer" 
                     className="flex-1 text-center px-4 py-2 bg-[#00abf0] text-[#081b29] rounded-lg hover:bg-transparent hover:text-[#00abf0] border-2 border-[#00abf0] transition-colors"
                     style={{ backgroundColor: theme.colors.secondary, color: theme.colors.text.secondary, hover: { backgroundColor: theme.colors.background, color: theme.colors.primary } }}
                  >
                    View Code
                  </a>
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                       className="flex-1 text-center px-4 py-2 border-2 border-[#00abf0] rounded-lg hover:bg-[#00abf0] hover:text-[#081b29] transition-colors"
                       style={{ borderColor: theme.colors.primary, hover: { backgroundColor: theme.colors.primary, color: theme.colors.text.secondary } }}
                    >
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
        <h2 className="text-4xl font-bold text-center mb-16" style={{ color: theme.colors.text.primary }}>Get in <span className="text-[#00abf0]" style={{ color: theme.colors.primary }}>Touch</span></h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#112e42] p-8 rounded-lg" style={{ backgroundColor: theme.colors.accent }}>
            <h3 className="text-3xl font-bold mb-6" style={{ color: theme.colors.text.primary }}>Send Me a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="Your Name" 
                  className="w-full p-3 bg-[#081b29] rounded-lg focus:ring-2 focus:ring-[#00abf0] outline-none"
                  style={{ backgroundColor: theme.colors.background, borderColor: theme.colors.primary }}
                />
              </div>
              <div>
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="Your Email" 
                  className="w-full p-3 bg-[#081b29] rounded-lg focus:ring-2 focus:ring-[#00abf0] outline-none"
                  style={{ backgroundColor: theme.colors.background, borderColor: theme.colors.primary }}
                />
              </div>
              <div>
                <textarea 
                  rows={6} 
                  name="message"
                  required
                  placeholder="Your Message" 
                  className="w-full p-3 bg-[#081b29] rounded-lg focus:ring-2 focus:ring-[#00abf0] outline-none"
                  style={{ backgroundColor: theme.colors.background, borderColor: theme.colors.primary }}
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full py-3 bg-[#00abf0] text-[#081b29] rounded-lg hover:bg-transparent hover:text-[#00abf0] border-2 border-[#00abf0] transition-colors"
                style={{ backgroundColor: theme.colors.secondary, color: theme.colors.text.secondary, hover: { backgroundColor: theme.colors.background, color: theme.colors.primary } }}
              >
                Send Message
              </button>
            </form>
          </div>
          <div className="bg-[#112e42] p-8 rounded-lg" style={{ backgroundColor: theme.colors.accent }}>
            <h3 className="text-3xl font-bold mb-6" style={{ color: theme.colors.text.primary }}>Contact Details</h3>
            <div className="space-y-4">
              <p className="flex items-center gap-3">
                <i className="bx bx-mail-send text-[#00abf0] text-5xl" style={{ color: theme.colors.primary }}></i>
                {contactInfo.email}
              </p>
              <p className="flex items-center gap-3">
                <i className="bx bx-map text-[#00abf0] text-5xl" style={{ color: theme.colors.primary }}></i>
                {contactInfo.location}
              </p>
              <div className="flex gap-4 mt-8">
                <a href={contactInfo.socialLinks.facebook} className="text-5xl text-[#00abf0] hover:text-[#ededed]"
                  style={{ color: theme.colors.primary, hover: { color: theme.colors.text.secondary } }}
                >
                  <i className="bx bxl-facebook"></i>
                </a>
                <a href={contactInfo.socialLinks.twitter} className="text-5xl text-[#00abf0] hover:text-[#ededed]"
                  style={{ color: theme.colors.primary, hover: { color: theme.colors.text.secondary } }}
                >
                  <i className="bx bxl-twitter"></i>
                </a>
                <a href={contactInfo.socialLinks.linkedin} className="text-5xl text-[#00abf0] hover:text-[#ededed]"
                  style={{ color: theme.colors.primary, hover: { color: theme.colors.text.secondary } }}
                >
                  <i className="bx bxl-linkedin"></i>
                </a>
                <a href={contactInfo.socialLinks.github} className="text-5xl text-[#00abf0] hover:text-[#ededed]"
                  style={{ color: theme.colors.primary, hover: { color: theme.colors.text.secondary } }}
                >
                  <i className="bx bxl-github"></i>
                </a>
                <a href={contactInfo.socialLinks.instagram} className="text-5xl text-[#00abf0] hover:text-[#ededed]"
                  style={{ color: theme.colors.primary, hover: { color: theme.colors.text.secondary } }}
                >
                  <i className="bx bxl-instagram"></i>
                </a>
                <a href={contactInfo.socialLinks.youtube} className="text-5xl text-[#00abf0] hover:text-[#ededed]"
                  style={{ color: theme.colors.primary, hover: { color: theme.colors.text.secondary } }}
                >
                  <i className="bx bxl-youtube"></i>
                </a>
                <a href={contactInfo.socialLinks.whatsapp} className="text-5xl text-[#00abf0] hover:text-[#ededed]"
                  style={{ color: theme.colors.primary, hover: { color: theme.colors.text.secondary } }}
                >
                  <i className="bx bxl-whatsapp"></i>
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#081b29] py-8 text-center" style={{ backgroundColor: theme.colors.background }}>
        <p className="text-lg" style={{ color: theme.colors.text.primary }}> 2024 Samuel Omulo | All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Portfolio;