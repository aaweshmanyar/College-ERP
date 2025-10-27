import React, { useState, useEffect } from 'react';
import * as api from '../../../services/mockApiService';
import { Student, Class, Subject } from '../../../types';
import Card from '../../common/Card';
import { UsersIcon, PresentationChartLineIcon } from '../../icons/Icons';
import StudentPerformanceDashboard from '../common/StudentPerformanceDashboard';

interface PerformanceData {
    totalStudents: number;
    schoolAverage: string;
    topPerformers: { name: string; percentage: string }[];
}

const SchoolPerformanceDashboard: React.FC = () => {
    const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
    const [allStudents, setAllStudents] = useState<Student[]>([]);
    const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [perfData, studentsData, subjectsData] = await Promise.all([
                api.getSchoolWidePerformanceData(),
                api.getStudents(),
                api.getSubjects()
            ]);
            setPerformanceData(perfData);
            setAllStudents(studentsData);
            setAllSubjects(subjectsData);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleStudentSelect = (studentId: string) => {
        if (studentId) {
            const student = allStudents.find(s => s.id === parseInt(studentId, 10));
            setSelectedStudent(student || null);
        } else {
            setSelectedStudent(null);
        }
    };

    if (loading) return <div>Loading performance data...</div>;

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">School-wide Performance</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card title="Total Students" value={performanceData?.totalStudents || 0} icon={<UsersIcon />} color="bg-blue-100 text-blue-600" />
                <Card title="School Average" value={`${performanceData?.schoolAverage || 0}%`} icon={<PresentationChartLineIcon />} color="bg-green-100 text-green-600" />
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-sm font-medium text-gray-500">Top Performers</h3>
                    <ul className="mt-2 space-y-1 text-gray-800">
                        {performanceData?.topPerformers.map((p, i) => (
                           <li key={i} className="flex justify-between items-center text-sm">
                               <span>{i + 1}. {p.name}</span>
                               <span className="font-bold">{p.percentage}%</span>
                           </li> 
                        ))}
                    </ul>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">View Individual Student Performance</h3>
                <div className="max-w-md">
                    <label htmlFor="student-select" className="block text-sm font-medium text-gray-700 mb-1">Select a Student:</label>
                    <select
                        id="student-select"
                        onChange={(e) => handleStudentSelect(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">-- Select Student --</option>
                        {allStudents.map(student => (
                            <option key={student.id} value={student.id}>{student.name} ({student.rollNumber})</option>
                        ))}
                    </select>
                </div>

                {selectedStudent && (
                    <div className="mt-8 border-t pt-6">
                        <StudentPerformanceDashboard student={selectedStudent} subjects={allSubjects} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SchoolPerformanceDashboard;