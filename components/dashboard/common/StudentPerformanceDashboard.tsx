import React, { useState, useEffect, useMemo } from 'react';
import { Student, Mark, Attendance, Subject } from '../../../types';
import * as api from '../../../services/mockApiService';
import Card from '../../common/Card';
import { PresentationChartLineIcon, ClipboardListIcon } from '../../icons/Icons';
import Table from '../../common/Table';

interface StudentPerformanceDashboardProps {
    student: Student;
    subjects: Subject[];
}

const StudentPerformanceDashboard: React.FC<StudentPerformanceDashboardProps> = ({ student, subjects }) => {
    const [marks, setMarks] = useState<Mark[]>([]);
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [marksData, attendanceData] = await Promise.all([
                api.getMarksForStudent(student.id),
                api.getAttendanceForStudent(student.id)
            ]);
            setMarks(marksData);
            setAttendance(attendanceData);
            setLoading(false);
        };
        fetchData();
    }, [student.id]);

    const overallPercentage = useMemo(() => {
        if (marks.length === 0) return 'N/A';
        const totalMarks = marks.reduce((acc, curr) => acc + curr.marks, 0);
        const totalPossible = marks.reduce((acc, curr) => acc + curr.total, 0);
        return totalPossible > 0 ? `${((totalMarks / totalPossible) * 100).toFixed(2)}%` : 'N/A';
    }, [marks]);

    const attendancePercentage = useMemo(() => {
        if (attendance.length === 0) return 'N/A';
        const presentDays = attendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
        return `${((presentDays / attendance.length) * 100).toFixed(2)}%`;
    }, [attendance]);

    const subjectPerformance = useMemo(() => {
        return subjects.map(subject => {
            const subjectMarks = marks.filter(m => m.subjectId === subject.id);
            if (subjectMarks.length === 0) return { name: subject.name, percentage: 0 };
            
            const totalMarks = subjectMarks.reduce((acc, curr) => acc + curr.marks, 0);
            const totalPossible = subjectMarks.reduce((acc, curr) => acc + curr.total, 0);
            const percentage = totalPossible > 0 ? (totalMarks / totalPossible) * 100 : 0;
            return { name: subject.name, percentage };
        });
    }, [marks, subjects]);

    const marksColumns = useMemo(() => [
        { header: 'Subject', accessor: (item: Mark) => subjects.find(s => s.id === item.subjectId)?.name || 'N/A' },
        { header: 'Exam', accessor: 'examName' as keyof Mark },
        { header: 'Marks Obtained', accessor: 'marks' as keyof Mark },
        { header: 'Total Marks', accessor: 'total' as keyof Mark },
        { header: 'Grade', accessor: 'grade' as keyof Mark },
    ], [subjects]);
    
    if (loading) return <div>Loading performance details for {student.name}...</div>;

    return (
        <div className="space-y-8">
            <h3 className="text-xl font-bold text-gray-900">Performance Report for {student.name}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Overall Academic %" value={overallPercentage} icon={<PresentationChartLineIcon />} color="bg-green-100 text-green-600" />
                <Card title="Overall Attendance %" value={attendancePercentage} icon={<ClipboardListIcon />} color="bg-yellow-100 text-yellow-600" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Subject-wise Performance</h4>
                <div className="space-y-4">
                    {subjectPerformance.map(sub => (
                        <div key={sub.name}>
                            <div className="flex justify-between items-center mb-1 text-sm">
                                <span className="font-medium text-gray-700">{sub.name}</span>
                                <span className="font-semibold text-gray-600">{sub.percentage.toFixed(2)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${sub.percentage}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                 <h4 className="text-lg font-semibold text-gray-800 mb-4">Recent Marks</h4>
                 <Table<Mark> columns={marksColumns} data={marks} />
            </div>
        </div>
    );
};

export default StudentPerformanceDashboard;