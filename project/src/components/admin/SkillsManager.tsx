import React, { useState } from 'react';
import usePortfolioStore from "../../store/portfolioStore";
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Skill } from '../../types/portfolio';
import Modal from './modals/Modal';
import SkillForm from './forms/SkillForm';
import styles from './SkillsManager.module.css'; // Import the CSS module

const SkillsManager: React.FC = () => {
  const { skills, deleteSkill, addSkill, updateSkill } = usePortfolioStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | undefined>();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  const handleEdit = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      deleteSkill(id);
    }
  };

  const handleSubmit = (data: Skill) => {
    if (selectedSkill) {
      updateSkill(selectedSkill.id, { ...data, id: selectedSkill.id });
    } else {
      addSkill({ ...data, id: crypto.randomUUID() });
    }
    setIsModalOpen(false);
    setSelectedSkill(undefined);
  };

  const handleImageUpload = (imageUrl: string | null) => {
    setUploadedImageUrl(imageUrl);
    setImageUploadError(null);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Skills Manager</h2>
      <button onClick={() => setIsModalOpen(true)} className={styles.addButton}><Plus /> Add Skill</button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map(skill => (
          <div key={skill.id} className={styles.skillCard}>
            <h3 className="text-xl font-semibold">{skill.name}</h3>
            {skill.imageUrl && <img src={skill.imageUrl} alt={skill.name} className={styles.skillImage} />}
            <p className={styles.skillDescription}>Skill Description: {skill.description}</p>
            <p className={styles.skillLevel}>Level: {skill.level}</p>
            <p className={styles.skillCategory}>Category: {skill.category}</p>
            <ul className={styles.listItems}>
              {skill.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <div className={styles.buttonGroup}>
              <button onClick={() => handleEdit(skill)}><Pencil /></button>
              <button onClick={() => handleDelete(skill.id)}><Trash2 /></button>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <SkillForm onSubmit={handleSubmit} skill={selectedSkill} onImageUpload={handleImageUpload} />
      </Modal>
    </div>
  );
};

export default SkillsManager;