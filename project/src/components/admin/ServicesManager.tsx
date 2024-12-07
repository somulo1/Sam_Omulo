import React, { useState } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Service } from '../../types/portfolio';
import Modal from './modals/Modal';
import ServiceForm from './forms/ServiceForm';

const ServicesManager: React.FC = () => {
  const { services, deleteService, addService, updateService } = usePortfolioStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | undefined>();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteService(id);
    }
  };

  const handleSubmit = (data: Service) => {
    if (selectedService) {
      updateService(selectedService.id, { ...data, id: selectedService.id });
    } else {
      addService({ ...data, id: crypto.randomUUID() });
    }
    setIsModalOpen(false);
    setSelectedService(undefined);
  };

  const handleImageUpload = (imageUrl: string | null) => {
    setUploadedImageUrl(imageUrl);
    setValue('imageUrl', imageUrl);
    setImageUploadError(null);

    // Trigger validation for the imageUrl field
    trigger('imageUrl');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Services</h2>
        <button 
          onClick={() => {
            setSelectedService(undefined);
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-lg shadow-md p-4 space-y-4"
          >
            <div className="text-4xl">{service.icon}</div>
            <h3 className="text-xl font-semibold">{service.title}</h3>
            <p className="text-gray-600">{service.description}</p>
            <ul className="list-disc list-inside space-y-2">
              {service.bulletPoints.map((point, index) => (
                <li key={index} className="text-gray-600">
                  {point}
                </li>
              ))}
            </ul>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(service)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
              >
                <Pencil size={20} />
              </button>
              <button
                onClick={() => handleDelete(service.id)}
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
          setSelectedService(undefined);
        }}
        title={selectedService ? 'Edit Service' : 'Add Service'}
      >
        <ServiceForm
          service={selectedService}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedService(undefined);
          }}
        />
      </Modal>
    </div>
  );
};

export default ServicesManager;