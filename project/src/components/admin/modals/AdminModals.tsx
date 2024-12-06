import React from 'react';
import Modal from './Modal';
import ProjectForm from '../forms/ProjectForm';
import SkillForm from '../forms/SkillForm';

interface AdminModalsProps {
  activeModal: string | null;
  onClose: () => void;
}

const AdminModals: React.FC<AdminModalsProps> = ({ activeModal, onClose }) => {
  return (
    <>
      {/* Project Modal */}
      <Modal
        isOpen={activeModal === 'project'}
        onClose={onClose}
        title="Project Management"
        size="lg"
      >
        <ProjectForm />
      </Modal>

      {/* Skills Modal */}
      <Modal
        isOpen={activeModal === 'skill'}
        onClose={onClose}
        title="Skill Management"
        size="lg"
      >
        <SkillForm />
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={activeModal === 'settings'}
        onClose={onClose}
        title="Settings"
        size="xl"
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">General Settings</h2>
          {/* Add settings content here */}
        </div>
      </Modal>

      {/* Analytics Modal */}
      <Modal
        isOpen={activeModal === 'analytics'}
        onClose={onClose}
        title="Analytics Dashboard"
        size="xl"
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Analytics Overview</h2>
          {/* Add analytics content here */}
        </div>
      </Modal>

      {/* Security Modal */}
      <Modal
        isOpen={activeModal === 'security'}
        onClose={onClose}
        title="Security Settings"
        size="lg"
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Security Configuration</h2>
          {/* Add security settings content here */}
        </div>
      </Modal>
    </>
  );
};

export default AdminModals;
