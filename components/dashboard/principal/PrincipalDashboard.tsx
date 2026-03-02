import React, { useState, useEffect } from 'react';
import StudentManagement from './StudentManagement';
import TeacherManagement from './TeacherManagement';
import TimetableManagement from './TimetableManagement';
import Card from '../../common/Card';
import { UsersIcon, BookOpenIcon, BuildingLibraryIcon } from '../../icons/Icons';
import * as api from '../../../services/mockApiService';
import ClassManagement from './ClassManagement';
import SubjectManagement from './SubjectManagement';
import AnnouncementManagement from './AnnouncementManagement';
import CertificateGeneration from './CertificateGeneration';
import SchoolPerformanceDashboard from './SchoolPerformanceDashboard';


import { User } from '../../../types';
import BiometricAttendance from '../common/BiometricAttendance';

interface PrincipalDashboardProps {
  activeView: string;
  user: User;
}

const PrincipalDashboard: React.FC<PrincipalDashboardProps> = ({ activeView, user }) => {
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [classCount, setClassCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const [students, teachers, classes] = await Promise.all([
        api.getStudents(),
        api.getTeachers(),
        api.getClasses(),
      ]);
      setStudentCount(students.length);
      setTeacherCount(teachers.length);
      setClassCount(classes.length);
    };
    fetchData();
  }, []);

  const renderContent = () => {
    switch (activeView) {
      case 'Students':
        return <StudentManagement />;
      case 'Teachers':
        return <TeacherManagement />;
      case 'Classes':
        return <ClassManagement />;
      case 'Subjects':
        return <SubjectManagement />;
      case 'Timetable':
        return <TimetableManagement />;
      case 'Announcements':
        return <AnnouncementManagement />;
      case 'Certificates':
        return <CertificateGeneration />;
      case 'Performance':
        return <SchoolPerformanceDashboard />;
      case 'Dashboard':
      default:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Principal's Dashboard</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card title="Total Students" value={studentCount} icon={<UsersIcon />} color="bg-blue-100 text-blue-600" />
                  <Card title="Total Teachers" value={teacherCount} icon={<UsersIcon />} color="bg-green-100 text-green-600" />
                  <Card title="Total Classes" value={classCount} icon={<BuildingLibraryIcon />} color="bg-yellow-100 text-yellow-600" />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4">School-wide Biometric Status</h3>
                  <div className="flex justify-around items-center py-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600">98%</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Attendance Today</p>
                    </div>
                    <div className="border-l h-12"></div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">42</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Active Terminals</p>
                    </div>
                    <div className="border-l h-12"></div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-600">03</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Sync Errors</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <BiometricAttendance
                  userName={user.name}
                  role="Principal"
                  isVerified={true}
                  variant="simple"
                />
              </div>
            </div>
          </div>
        );
    }
  };


  return <div>{renderContent()}</div>;
};

export default PrincipalDashboard;