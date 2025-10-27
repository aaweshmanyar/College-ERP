
import React, { ReactNode } from 'react';

interface CardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${color}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
