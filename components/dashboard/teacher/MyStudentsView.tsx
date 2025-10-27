import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as api from '../../../services/mockApiService';
import type { Student, Class, Attendance, Subject, TimetableEntry } from '../../../types';
import Table from '../../common/Table';
import Card from '../../common/Card';
import { UsersIcon, EyeIcon } from '../../icons/Icons';
import ExporterButton from '../../common/ExporterButton';
import { prepareStudentExportData } from '../../../utils/exportUtils';
import Modal from '../../common/Modal';
import DetailedStudentProfile from '../common/DetailedStudentProfile';

interface MyStudentsViewProps {
    teacherId: number;
}

const MyStudentsView: React.FC<MyStudentsViewProps> = ({ teacherId }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
    const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const [studentData, classData, attendanceData, subjectData, timetableData] = await Promise.all([
            api.getStudentsForTeacher(teacherId),
            api.getClasses(),
            api.getAttendanceForTeacher(teacherId),
            api.getSubjects(),
            api.getTimetableForTeacher(teacherId)
        ]);
        setStudents(studentData);
        setClasses(classData);
        setAttendance(attendanceData);
        setSubjects(subjectData);
        setTimetable(timetableData);
        setLoading(false);
    }, [teacherId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const teacherSubjects = useMemo(() => {
        const subjectIds = new Set(timetable.map(entry => entry.subjectId));
        return subjects.filter(s => subjectIds.has(s.id));
    }, [timetable, subjects]);

    const filteredStudents = useMemo(() => {
        if (selectedSubjectId === 'all') {
            return students;
        }
        const subjectIdNum = parseInt(selectedSubjectId, 10);
        const classIdsForSubject = new Set(
            timetable
                .filter(entry => entry.subjectId === subjectIdNum)
                .map(entry => entry.classId)
        );
        return students.filter(student => classIdsForSubject.has(student.classId));
    }, [selectedSubjectId, students, timetable]);

    const today = new Date().toISOString().split('T')[0];
    const presentTodayCount = useMemo(() => {
        const studentIds = new Set(filteredStudents.map(s => s.id));
        return attendance.filter(a => a.date === today && a.status === 'Present' && studentIds.has(a.studentId)).length;
    }, [attendance, today, filteredStudents]);

    const handleExport = async () => {
        const studentIds = filteredStudents.map(s => s.id);
        const fullStudentData = (await api.getFullStudentData()).filter(s => studentIds.includes(s.id));
        const exportData = await prepareStudentExportData(fullStudentData, subjects, classes);
        return exportData;
    }

    const columns = useMemo(() => [
        { header: 'Roll No.', accessor: 'rollNumber' as keyof Student },
        { header: 'Name', accessor: 'name' as keyof Student },
        {
            header: 'Class', accessor: (item: Student) => {
                const studentClass = classes.find(c => c.id === item.classId);
                return studentClass ? `${studentClass.name}-${studentClass.section}` : 'N/A';
            }
        },
        { header: 'Guardian', accessor: 'guardianName' as keyof Student },
    ], [classes]);


    if (loading) return <div>Loading students...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">My Students</h2>
                <div className="flex items-center space-x-4">
                    <div>
                        <label htmlFor="subject-filter" className="text-sm font-medium mr-2">Filter by Subject:</label>
                        <select
                            id="subject-filter"
                            value={selectedSubjectId}
                            onChange={(e) => setSelectedSubjectId(e.target.value)}
                            className="p-2 border rounded-md text-sm"
                        >
                            <option value="all">All Subjects</option>
                            {teacherSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <ExporterButton fetchData={handleExport} filename="My_Students_Report" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card title="Total Students" value={filteredStudents.length} icon={<UsersIcon />} color="bg-blue-100 text-blue-600" />
                <Card title="Present Today" value={presentTodayCount} icon={<UsersIcon />} color="bg-green-100 text-green-600" />
            </div>

            <Table<Student>
                columns={columns}
                data={filteredStudents}
                renderActions={(student) => (
                    <button onClick={() => setViewingStudent(student)} className="text-gray-600 hover:text-gray-900" title="View Profile">
                        <EyeIcon />
                    </button>
                )}
            />

            {viewingStudent && (
                <Modal title={`${viewingStudent.name}'s Profile`} onClose={() => setViewingStudent(null)}>
                    <DetailedStudentProfile student={viewingStudent} allClasses={classes} allSubjects={subjects} />
                </Modal>
            )}
        </div>
    );
};

export default MyStudentsView;