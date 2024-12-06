import React, { useState } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Project } from '../../types/portfolio';
import Modal from './modals/Modal';
import ProjectForm from './forms/ProjectForm';

const ProjectsManager: React.FC = () => {
  const { projects, deleteProject, addProject, updateProject } = usePortfolioStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
    }
  };

  const handleSubmit = (data: Project) => {
    if (selectedProject) {
      updateProject(selectedProject.id, { ...data, id: selectedProject.id });
    } else {
      addProject({ ...data, id: crypto.randomUUID() });
    }
    setIsModalOpen(false);
    setSelectedProject(undefined);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Projects</h2>
        <button 
          onClick={() => {
            setSelectedProject(undefined);
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-md p-4 space-y-4"
          >
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            <h3 className="text-xl font-semibold">{project.title}</h3>
            <p className="text-gray-600">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(project)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
              >
                <Pencil size={20} />
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(undefined);
        }}
        title={selectedProject ? 'Edit Project' : 'Add Project'}
      >
        <ProjectForm
          project={selectedProject}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedProject(undefined);
          }}
        />
      </Modal>
    </div>
  );
};

export default ProjectsManager;