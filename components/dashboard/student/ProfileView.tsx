import React from 'react';
import { Student } from '../../../types';

interface ProfileViewProps {
  student: Student;
}

const ProfileView: React.FC<ProfileViewProps> = ({ student }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-4">My Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <h3 className="text-lg font-medium text-gray-700">Personal Information</h3>
          <ul className="mt-2 space-y-2 text-sm text-gray-600">
            <li><strong>Name:</strong> {student.name}</li>
            <li><strong>Date of Birth:</strong> {student.dob}</li>
            <li><strong>Gender:</strong> {student.gender}</li>
            <li><strong>Address:</strong> {student.address}</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-700">Academic Information</h3>
          <ul className="mt-2 space-y-2 text-sm text-gray-600">
            <li><strong>Roll Number:</strong> {student.rollNumber}</li>
            <li><strong>Class:</strong> {student.section}</li>
            <li><strong>Admission Date:</strong> {student.admissionDate}</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-700">Guardian Information</h3>
          <ul className="mt-2 space-y-2 text-sm text-gray-600">
            <li><strong>Guardian Name:</strong> {student.guardianName}</li>
            <li><strong>Guardian Contact:</strong> {student.guardianContact}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
