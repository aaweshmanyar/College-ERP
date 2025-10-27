
import React, { useState, useEffect } from 'react';
import * as api from '../../../services/mockApiService';
import type { Attendance } from '../../../types';
import { students } from '../../../data/seedData';
import Table from '../../common/Table';

interface AttendanceManagementProps {
    teacherId: number;
}

const AttendanceManagement: React.FC<AttendanceManagementProps> = ({ teacherId }) => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      const data = await api.getAttendanceForTeacher(teacherId);
      setAttendance(data);
      setLoading(false);
    };
    fetchAttendance();
  }, [teacherId]);

  const handleStatusChange = async (id: number, status: 'Present' | 'Absent' | 'Late') => {
    await api.updateAttendance(id, status);
    setAttendance(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };
  
  const columns = [
    { header: 'Date', accessor: 'date' as keyof Attendance },
    { 
        header: 'Student', 
        accessor: (item: Attendance) => students.find(s => s.id === item.studentId)?.name || 'N/A' 
    },
    { 
        header: 'Status', 
        accessor: (item: Attendance) => (
            <select
              value={item.status}
              onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
              className={`p-1 rounded text-xs ${item.status === 'Present' ? 'bg-green-100 text-green-800' : item.status === 'Absent' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
        )
    },
  ];

  if (loading) {
    return <div>Loading attendance records...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Manage Attendance</h2>
      <Table<Attendance> columns={columns} data={attendance} />
    </div>
  );
};

export default AttendanceManagement;
