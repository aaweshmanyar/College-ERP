import React, { useState, useEffect } from 'react';
import * as api from '../../../services/mockApiService';
import { Student, Subject } from '../../../types';
import StudentPerformanceDashboard from '../common/StudentPerformanceDashboard';

interface TeacherPerformanceViewProps {
    teacherId: number;
}

const TeacherPerformanceView: React.FC<TeacherPerformanceViewProps> = ({ teacherId }) => {
    const [teacherStudents, setTeacherStudents] = useState<Student[]>([]);
    const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [studentsData, subjectsData] = await Promise.all([
                api.getStudentsForTeacher(teacherId),
                api.getSubjects()
            ]);
            setTeacherStudents(studentsData);
            setAllSubjects(subjectsData);
            setLoading(false);
        };
        fetchData();
    }, [teacherId]);

    const handleStudentSelect = (studentId: string) => {
        if (studentId) {
            const student = teacherStudents.find(s => s.id === parseInt(studentId, 10));
            setSelectedStudent(student || null);
        } else {
            setSelectedStudent(null);
        }
    };

    if (loading) return <div>Loading students...</div>;

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Students' Performance</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="max-w-md mb-6">
                    <label htmlFor="student-select" className="block text-sm font-medium text-gray-700 mb-1">Select a Student to View Report:</label>
                    <select
                        id="student-select"
                        onChange={(e) => handleStudentSelect(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">-- Select Student --</option>
                        {teacherStudents.map(student => (
                            <option key={student.id} value={student.id}>{student.name} ({student.rollNumber})</option>
                        ))}
                    </select>
                </div>
                
                {selectedStudent ? (
                    <div className="border-t pt-6">
                       <StudentPerformanceDashboard student={selectedStudent} subjects={allSubjects} />
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        <p>Select a student from the dropdown to see their detailed performance report.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherPerformanceView;