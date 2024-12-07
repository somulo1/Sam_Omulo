import React from 'react';

interface SkillsManagerProps {
    imageUrl: string;
}

const SkillsManager: React.FC<SkillsManagerProps> = ({ imageUrl }) => {
    return (
        <div>
            <h2>Skills Manager</h2>
            <img src={imageUrl} alt="Project Skills" />
        </div>
    );
};

export default SkillsManager;
