import React, { useState, useEffect } from 'react';
import { User, Student, UserRole, Mark, Attendance, TimetableEntry, Subject, Teacher, Class } from '../../../types';
import * as api from '../../../services/mockApiService';
import { parents } from '../../../data/seedData';
import Card from '../../common/Card';
import { PresentationChartLineIcon, ClipboardListIcon } from '../../icons/Icons';
import DetailedStudentProfile from '../common/DetailedStudentProfile';
import Table from '../../common/Table';
import FeeManagement from '../common/FeeManagement';
import LeaveRequestView from '../common/LeaveRequestView';
import AnnouncementsView from '../common/AnnouncementsView';
import StudentPerformanceDashboard from '../common/StudentPerformanceDashboard';

interface ParentDashboardProps {
  activeView: string;
  user: User;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ activeView, user }) => {
  const [child, setChild] = useState<Student | null>(null);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  const parentInfo = parents.find(p => p.userId === user.id);

  useEffect(() => {
    const fetchChildData = async () => {
        if (!parentInfo) {
            setLoading(false);
            return;
        }
        setLoading(true);
        const student = await api.getStudentForParent(parentInfo.id);
        if (student) {
            setChild(student);
            const [marksData, attendanceData, timetableData, subjectsData, teachersData, classesData] = await Promise.all([
                api.getMarksForStudent(student.id),
                api.getAttendanceForStudent(student.id),
                api.getTimetableForStudent(student.classId),
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
        }
        setLoading(false);
    };
    fetchChildData();
  }, [parentInfo]);
  
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
    if (loading) return <div>Loading data...</div>;
    if (!parentInfo || !child) return <div>Could not find child information for this account.</div>;

    switch (activeView) {
      case 'My Child\'s Profile':
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <DetailedStudentProfile student={child} allClasses={classes} allSubjects={subjects} />
            </div>
        );
      case 'Marks':
        const marksColumns = [
            { header: 'Subject', accessor: (item: Mark) => subjects.find(s => s.id === item.subjectId)?.name || 'N/A'},
            { header: 'Exam', accessor: 'examName' as keyof Mark },
            { header: 'Marks Obtained', accessor: 'marks' as keyof Mark },
            { header: 'Total Marks', accessor: 'total' as keyof Mark },
            { header: 'Grade', accessor: 'grade' as keyof Mark },
        ];
        return <Table<Mark> columns={marksColumns} data={marks} />;
      case 'Attendance':
        const attendanceColumns = [
            { header: 'Date', accessor: 'date' as keyof Attendance },
            { header: 'Status', accessor: 'status' as keyof Attendance },
        ];
        return <Table<Attendance> columns={attendanceColumns} data={attendance} />;
      case 'Timetable':
        const timetableColumns = [
            { header: 'Day', accessor: 'day' as keyof TimetableEntry },
            { header: 'Time Slot', accessor: 'timeSlot' as keyof TimetableEntry },
            { header: 'Subject', accessor: (item: TimetableEntry) => subjects.find(s => s.id === item.subjectId)?.name || 'N/A' },
            { header: 'Teacher', accessor: (item: TimetableEntry) => teachers.find(t => t.id === item.teacherId)?.name || 'N/A' },
            { header: 'Room', accessor: 'room' as keyof TimetableEntry },
        ];
        return <Table<TimetableEntry> columns={timetableColumns} data={timetable} />;
      case 'Fees':
        return <FeeManagement studentId={child.id} />;
      case 'Leave Requests':
        return <LeaveRequestView studentId={child.id} />;
      case 'Announcements':
        return <AnnouncementsView role={UserRole.PARENT} />;
      case 'Performance':
        return <StudentPerformanceDashboard student={child} subjects={subjects} />;
      case 'Dashboard':
      default:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Parent Dashboard for {child.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Overall Percentage" value={calculateOverallPercentage()} icon={<PresentationChartLineIcon />} color="bg-green-100 text-green-600" />
              <Card title="Attendance" value={calculateAttendancePercentage()} icon={<ClipboardListIcon />} color="bg-yellow-100 text-yellow-600" />
            </div>
            <div className="mt-8">
                <AnnouncementsView role={UserRole.PARENT} />
            </div>
          </div>
        );
    }
  };

  return <div>{renderContent()}</div>;
};

export default ParentDashboard;