import React from 'react';
import { Teacher } from '../../../types';

interface DetailedTeacherProfileProps {
  teacher: Teacher;
  subjectsTaught: string[];
}

const DetailedTeacherProfile: React.FC<DetailedTeacherProfileProps> = ({ teacher, subjectsTaught }) => {
  return (
    <div className="space-y-6 text-sm">
      {/* Personal Info */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <div><strong>Name:</strong> {teacher.name}</div>
            <div><strong>Department:</strong> {teacher.department}</div>
            <div><strong>Phone:</strong> {teacher.phone}</div>
        </div>
      </div>

      {/* Academic Info */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Academic & Professional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <div><strong>Qualification:</strong> {teacher.qualification}</div>
            <div><strong>Joining Date:</strong> {teacher.joiningDate}</div>
            <div className="md:col-span-2"><strong>Subjects Taught:</strong> {subjectsTaught.join(', ') || 'N/A'}</div>
        </div>
      </div>
    </div>
  );
};

export default DetailedTeacherProfile;
