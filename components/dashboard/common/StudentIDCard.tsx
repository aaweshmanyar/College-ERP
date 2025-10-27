import React from 'react';
import { Student, Class } from '../../../types';
import { SchoolIcon, UserCircleIcon } from '../../icons/Icons';

interface StudentIDCardProps {
    student: Student;
    studentClass?: Class;
}

const StudentIDCard: React.FC<StudentIDCardProps> = ({ student, studentClass }) => {
    return (
        <div className="w-80 h-auto bg-white rounded-lg shadow-lg border border-gray-200 font-sans">
            {/* Header */}
            <div className="bg-blue-600 text-white p-3 rounded-t-lg flex items-center justify-between">
                <div className="flex items-center">
                    <SchoolIcon />
                    <h1 className="text-lg font-bold ml-2">SCHOOL NAME</h1>
                </div>
                <span className="text-xs font-semibold">2024-2025</span>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-3 border-4 border-blue-200">
                    <UserCircleIcon />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{student.name}</h2>
                <p className="text-sm text-gray-500">Student</p>
            </div>

            {/* Details */}
            <div className="px-4 pb-4 text-sm text-gray-700 space-y-2">
                <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Roll No:</span>
                    <span>{student.rollNumber}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Class:</span>
                    <span>{studentClass ? `${studentClass.name}-${studentClass.section}` : 'N/A'}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Date of Birth:</span>
                    <span>{student.dob}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Guardian:</span>
                    <span>{student.guardianName}</span>
                </div>
                 <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Contact:</span>
                    <span>{student.guardianContact}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 p-2 text-center text-xs text-gray-600 rounded-b-lg">
                <p>If found, please return to the school office.</p>
                <p className="font-bold">www.schoolwebsite.edu</p>
            </div>
        </div>
    );
};

export default StudentIDCard;
