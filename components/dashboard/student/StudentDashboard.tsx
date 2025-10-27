import React, { useState, useEffect } from 'react';
import { UserRole, type User, type Mark, type Attendance, type TimetableEntry, type Subject, type Teacher, type Class } from '../../../types';
import * as api from '../../../services/mockApiService';
import { students } from '../../../data/seedData';
import Card from '../../common/Card';
import { PresentationChartLineIcon, ClipboardListIcon } from '../../icons/Icons';
import Table from '../../common/Table';
import AnnouncementsView from '../common/AnnouncementsView';
import DetailedStudentProfile from '../common/DetailedStudentProfile';
import FeeManagement from '../common/FeeManagement';
import LeaveRequestView from '../common/LeaveRequestView';
import StudentIDCard from '../common/StudentIDCard';
import PromotionHistoryView from '../common/PromotionHistoryView';
import Modal from '../../common/Modal';
import StudentMessages from './StudentMessages';


interface StudentDashboardProps {
  activeView: string;
  user: User;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ activeView, user }) => {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const studentInfo = students.find(s => s.userId === user.id);

  useEffect(() => {
    if (!studentInfo) return;
    const fetchData = async () => {
      setLoading(true);
      const [marksData, attendanceData, timetableData, subjectsData, teachersData, classesData] = await Promise.all([
        api.getMarksForStudent(studentInfo.id),
        api.getAttendanceForStudent(studentInfo.id),
        api.getTimetableForStudent(studentInfo.classId),
        api.getSubjects(),
        api.getTeachers(),
        api.getClasses(),
      ]);
      setMarks(marksData);
      setAttendance(attendanceData);
      setTimetable(timetableData);
      setSubjects(subjectsData);
      setTeachers(teachersData);
      setClasses(classesData);
      setLoading(false);
    };
    fetchData();
  }, [studentInfo]);

  useEffect(() => {
    if (selectedTeacherId) {
        const fetchTeacherTimetable = async () => {
            const data = await api.getTimetableForTeacher(parseInt(selectedTeacherId, 10));
            setTimetable(data);
        };
        fetchTeacherTimetable();
    } else {
        if (studentInfo) {
            const fetchOwnTimetable = async () => {
                const data = await api.getTimetableForStudent(studentInfo.classId);
                setTimetable(data);
            }
            fetchOwnTimetable();
        }
    }
  }, [selectedTeacherId, studentInfo]);

  const calculateOverallPercentage = () => {
    if (marks.length === 0) return 'N/A';
    const totalMarks = marks.reduce((acc, curr) => acc + curr.marks, 0);
    const totalPossible = marks.reduce((acc, curr) => acc + curr.total, 0);
    if (totalPossible === 0) return 'N/A';
    return `${((totalMarks / totalPossible) * 100).toFixed(2)}%`;
  }

  const calculateAttendancePercentage = () => {
      if (attendance.length === 0) return 'N/A';
      const presentDays = attendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
      return `${((presentDays / attendance.length) * 100).toFixed(2)}%`;
  }
  
  const renderContent = () => {
    if (loading) return <div>Loading dashboard...</div>;
    if (!studentInfo) return <div>Student data not found.</div>;

    switch (activeView) {
      case 'My Profile':
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <DetailedStudentProfile student={studentInfo} allClasses={classes} allSubjects={subjects} />
            </div>
        );
      case 'My Marks':
        const marksColumns = [
            { header: 'Subject', accessor: (item: Mark) => subjects.find(s => s.id === item.subjectId)?.name || 'N/A'},
            { header: 'Exam', accessor: 'examName' as keyof Mark },
            { header: 'Marks Obtained', accessor: 'marks' as keyof Mark },
            { header: 'Total Marks', accessor: 'total' as keyof Mark },
            { header: 'Grade', accessor: 'grade' as keyof Mark },
        ];
        return (
            <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Marks</h2>
                <Table<Mark> columns={marksColumns} data={marks} />
            </div>
        );
      case 'My Attendance':
        const attendanceColumns = [
            { header: 'Date', accessor: 'date' as keyof Attendance },
            { header: 'Status', accessor: 'status' as keyof Attendance },
        ];
        return (
            <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Attendance</h2>
                <Table<Attendance> columns={attendanceColumns} data={attendance} />
            </div>
        );
      case 'My Timetable':
        const timetableColumns = [
            { header: 'Day', accessor: 'day' as keyof TimetableEntry },
            { header: 'Time Slot', accessor: 'timeSlot' as keyof TimetableEntry },
            { header: 'Subject', accessor: (item: TimetableEntry) => subjects.find(s => s.id === item.subjectId)?.name || 'N/A' },
            { header: 'Teacher', accessor: (item: TimetableEntry) => teachers.find(t => t.id === item.teacherId)?.name || 'N/A' },
            { header: 'Room', accessor: 'room' as keyof TimetableEntry },
        ];
        return (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">My Timetable</h2>
                    <div>
                        <label htmlFor="teacher-select" className="mr-2 text-sm font-medium">View Teacher's Timetable:</label>
                        <select
                            id="teacher-select"
                            value={selectedTeacherId}
                            onChange={(e) => setSelectedTeacherId(e.target.value)}
                            className="p-2 border rounded"
                        >
                            <option value="">My Timetable</option>
                            {teachers.map(teacher => (
                                <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <Table<TimetableEntry> columns={timetableColumns} data={timetable} />
            </div>
        );
      case 'Fee Management':
        return <FeeManagement studentId={studentInfo.id} />;
      case 'Leave Requests':
        return <LeaveRequestView studentId={studentInfo.id} />;
      case 'Messages':
        return <StudentMessages />;
      case 'My ID Card':
        return (
            <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">My ID Card</h2>
                <div className="flex justify-center">
                    <StudentIDCard student={studentInfo} studentClass={classes.find(c => c.id === studentInfo.classId)} />
                </div>
            </div>
        );
      case 'Promotion History':
        return <PromotionHistoryView studentId={studentInfo.id} />;
      case 'Announcements':
        return <AnnouncementsView role={UserRole.STUDENT} />;
      case 'Dashboard':
      default:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Student Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Overall Percentage" value={calculateOverallPercentage()} icon={<PresentationChartLineIcon />} color="bg-green-100 text-green-600" />
              <Card title="Attendance" value={calculateAttendancePercentage()} icon={<ClipboardListIcon />} color="bg-yellow-100 text-yellow-600" />
            </div>
            <div className="mt-8">
                <AnnouncementsView role={UserRole.STUDENT} />
            </div>
          </div>
        );
    }
  };

  return <div>{renderContent()}</div>;
};

export default StudentDashboard;