import React, { useState, useEffect } from 'react';
import type { User } from '../../../types';
import AttendanceManagement from './AttendanceManagement';
import MarksManagement from './MarksManagement';
import Card from '../../common/Card';
import { UsersIcon, CalendarIcon } from '../../icons/Icons';
import * as api from '../../../services/mockApiService';
import { teachers, subjects, classes } from '../../../data/seedData';
import Table from '../../common/Table';
import MyStudentsView from './MyStudentsView';
import LeaveManagement from './LeaveManagement';
import TeacherMessages from './TeacherMessages';
import TeacherPerformanceView from './TeacherPerformanceView';

interface TeacherDashboardProps {
  activeView: string;
  user: User;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ activeView, user }) => {
  const [studentCount, setStudentCount] = useState(0);
  const [timetable, setTimetable] = useState([]);

  const teacherInfo = teachers.find(t => t.userId === user.id);
  
  useEffect(() => {
    if (!teacherInfo) return;
    const fetchData = async () => {
      const students = await api.getStudentsForTeacher(teacherInfo.id);
      const timetableData = await api.getTimetableForTeacher(teacherInfo.id);
      setStudentCount(students.length);
      setTimetable(timetableData);
    };
    fetchData();
  }, [teacherInfo]);

  const renderContent = () => {
    if (!teacherInfo) return <div>Teacher data not found.</div>;
    
    switch (activeView) {
      case 'My Students':
        return <MyStudentsView teacherId={teacherInfo.id} />;
      case 'Attendance':
        return <AttendanceManagement teacherId={teacherInfo.id} />;
      case 'Marks':
        return <MarksManagement teacherId={teacherInfo.id} />;
      case 'Leave Requests':
        return <LeaveManagement teacherId={teacherInfo.id} />;
      case 'Messages':
        return <TeacherMessages teacherId={teacherInfo.id} />;
      case 'Performance':
        return <TeacherPerformanceView teacherId={teacherInfo.id} />;
      case 'My Timetable':
          const columns = [
              { header: 'Day', accessor: 'day' },
              { header: 'Time Slot', accessor: 'timeSlot' },
              { header: 'Class', accessor: (item) => {
                  const c = classes.find(cls => cls.id === item.classId);
                  return c ? `${c.name}-${c.section}` : 'N/A';
              }},
              { header: 'Subject', accessor: (item) => subjects.find(s => s.id === item.subjectId)?.name || 'N/A' },
              { header: 'Room', accessor: 'room' },
          ];
          return (
              <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Timetable</h2>
                  <Table columns={columns} data={timetable} />
              </div>
          );
      case 'Dashboard':
      default:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Teacher's Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card title="Assigned Students" value={studentCount} icon={<UsersIcon />} color="bg-blue-100 text-blue-600" />
              <Card title="Today's Classes" value={timetable.filter(t => t.day === 'Monday').length} icon={<CalendarIcon />} color="bg-purple-100 text-purple-600" />
            </div>
          </div>
        );
    }
  };

  return <div>{renderContent()}</div>;
};

export default TeacherDashboard;