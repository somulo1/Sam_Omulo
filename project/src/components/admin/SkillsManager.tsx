import React, { useState, useEffect } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { supabase } from '../../lib/supabaseClient';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Skill } from '../../types/portfolio';
import Modal from './modals/Modal';
import SkillForm from './forms/SkillForm';

interface CardStyleProps {
  cardBackgroundColor?: string;
  cardTextColor?: string;
  cardPadding?: string;
  cardBorderRadius?: string;
  cardShadow?: string;
}

interface Image {
  id: string;
  file_path: string;
  file_name: string;
}

const SkillsManager: React.FC = () => {
  const { skills, deleteSkill, addSkill, updateSkill } = usePortfolioStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | undefined>();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('skills') // Use the actual skills table name
      .select('*');

    if (error) {
      console.error('Error fetching images:', error);
    } else {
      setImages(data); // Assuming data contains the images
    }
    setLoading(false);
  };

  useEffect(() => {
    loadImages(); // Load images on component mount

    const subscription = supabase
      .from('skills') // Use the actual skills table name
      .on('INSERT', payload => {
        loadImages(); // Re-fetch images on new insert
      })
      .on('DELETE', payload => {
        loadImages(); // Re-fetch images on delete
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription); // Clean up subscription on unmount
    };
  }, []); // Run once on mount

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

  // Default card styles
  const defaultCardStyle: CardStyleProps = {
    cardBackgroundColor: 'bg-white',
    cardTextColor: 'text-black',
    cardPadding: 'p-4',
    cardBorderRadius: 'rounded-lg',
    cardShadow: 'shadow-md',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Skills</h2>
        <button
          onClick={() => {
            setSelectedSkill(undefined);
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Skill</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className={`${defaultCardStyle.cardBackgroundColor} ${defaultCardStyle.cardTextColor} ${defaultCardStyle.cardPadding} ${defaultCardStyle.cardBorderRadius} ${defaultCardStyle.cardShadow}`}
          >
            <div className="text-4xl">{skill.icon}</div>
            <h3 className="text-xl font-semibold">{skill.category}</h3>
            {skill.imageUrl && <img src={skill.imageUrl} alt={skill.category} className="skill-image" />}
            <ul className="list-disc list-inside space-y-2">
              {skill.items.map((item, index) => (
                <li key={index} className="text-gray-600">
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(skill)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
              >
                <Pencil size={20} />
              </button>
              <button
                onClick={() => handleDelete(skill.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={20} />
              </button>
            </div>
            {selectedSkill && selectedSkill.id === skill.id && (
              <div>
                <h2>Skill Images</h2>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  images.map((image) => (
                    <img key={image.id} src={image.file_path} alt={image.file_name} />
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSkill(undefined);
        }}
        title={selectedSkill ? 'Edit Skill' : 'Add Skill'}
      >
        <SkillForm
          skill={selectedSkill}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedSkill(undefined);
          }}
        />
      </Modal>
    </div>
  );
};

export default SkillsManager;
