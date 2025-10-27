import React, { useState, useEffect, useMemo } from 'react';
import * as api from '../../../services/mockApiService';
import type { Student, Class } from '../../../types';
import TransferCertificate from '../common/TransferCertificate';
import BonafideCertificate from '../common/BonafideCertificate';
import EventCertificate from '../common/EventCertificate';

type CertificateType = 'transfer' | 'bonafide' | 'event';

const CertificateGeneration: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [certificateType, setCertificateType] = useState<CertificateType>('transfer');
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    const [eventName, setEventName] = useState<string>('');
    const [achievement, setAchievement] = useState<string>('');


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [studentData, classData] = await Promise.all([api.getStudents(), api.getClasses()]);
            setStudents(studentData);
            setClasses(classData);
            setLoading(false);
        };
        fetchData();
    }, []);

    const selectedStudent = useMemo(() => {
        if (!selectedStudentId) return null;
        return students.find(s => s.id === parseInt(selectedStudentId));
    }, [selectedStudentId, students]);

    const selectedStudentClass = useMemo(() => {
        if (!selectedStudent) return null;
        return classes.find(c => c.id === selectedStudent.classId);
    }, [selectedStudent, classes]);

    const renderCertificatePreview = () => {
        if (!selectedStudent || !selectedStudentClass) return null;

        switch (certificateType) {
            case 'transfer':
                return <TransferCertificate student={selectedStudent} studentClass={selectedStudentClass} />;
            case 'bonafide':
                return <BonafideCertificate student={selectedStudent} studentClass={selectedStudentClass} />;
            case 'event':
                 if (!eventName || !achievement) return <p className="text-center text-red-500">Please fill in the event name and achievement.</p>;
                return <EventCertificate student={selectedStudent} eventName={eventName} achievement={achievement} />;
            default:
                return null;
        }
    }


    if (loading) {
        return <div>Loading student data...</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Generate Certificates</h2>

            <div className="bg-white p-6 rounded-lg shadow-md">
                {/* Certificate Type Selection */}
                <div className="mb-6">
                    <h3 className="block text-lg font-medium text-gray-800 mb-3">1. Select Certificate Type</h3>
                    <div className="flex space-x-4">
                        {(['transfer', 'bonafide', 'event'] as CertificateType[]).map(type => (
                            <label key={type} className="flex items-center space-x-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="certificateType" 
                                    value={type} 
                                    checked={certificateType === type}
                                    onChange={() => setCertificateType(type)}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <span className="text-gray-700 capitalize">{type} Certificate</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Student and Event Details */}
                <div className="mb-6 border-t pt-6">
                    <h3 className="block text-lg font-medium text-gray-800 mb-3">2. Enter Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="student-select" className="block text-sm font-medium text-gray-700 mb-2">
                                Select Student
                            </label>
                            <select
                                id="student-select"
                                value={selectedStudentId}
                                onChange={(e) => setSelectedStudentId(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">-- Please choose a student --</option>
                                {students.map(student => (
                                    <option key={student.id} value={student.id}>
                                        {student.name} ({student.rollNumber})
                                    </option>
                                ))}
                            </select>
                        </div>
                        {certificateType === 'event' && (
                            <>
                                <div>
                                    <label htmlFor="event-name" className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
                                    <input type="text" id="event-name" value={eventName} onChange={e => setEventName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., Annual Sports Day 2024" />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="achievement" className="block text-sm font-medium text-gray-700 mb-2">Achievement / Position</label>
                                    <input type="text" id="achievement" value={achievement} onChange={e => setAchievement(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., 1st Place in 100m Race or Participation" />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {selectedStudent && (
                    <div className="border-t pt-6">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">3. Certificate Preview</h3>
                        <div className="p-4 border rounded-md bg-gray-50">
                            {renderCertificatePreview()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CertificateGeneration;