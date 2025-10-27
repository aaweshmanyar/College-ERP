import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import DashboardLayout from '../layouts/DashboardLayout';
import PrincipalDashboard from '../components/dashboard/principal/PrincipalDashboard';
import TeacherDashboard from '../components/dashboard/teacher/TeacherDashboard';
import StudentDashboard from '../components/dashboard/student/StudentDashboard';
import ParentDashboard from '../components/dashboard/parent/ParentDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('Dashboard');

  if (!user) {
    return null; 
  }

  const renderDashboardContent = () => {
    switch (user.role) {
      case UserRole.PRINCIPAL:
        return <PrincipalDashboard activeView={activeView} />;
      case UserRole.TEACHER:
        return <TeacherDashboard activeView={activeView} user={user} />;
      case UserRole.STUDENT:
        return <StudentDashboard activeView={activeView} user={user} />;
      case UserRole.PARENT:
        return <ParentDashboard activeView={activeView} user={user} />;
      default:
        return <div>Invalid Role</div>;
    }
  };

  return (
    <DashboardLayout activeView={activeView} setActiveView={setActiveView}>
      {renderDashboardContent()}
    </DashboardLayout>
  );
};

export default Dashboard;