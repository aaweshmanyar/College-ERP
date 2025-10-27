import React, { useState, useEffect } from 'react';
import * as api from '../../../services/mockApiService';
import type { Mark, Subject } from '../../../types';
import { students } from '../../../data/seedData';
import Table from '../../common/Table';

interface MarksManagementProps {
    teacherId: number;
}

const MarksManagement: React.FC<MarksManagementProps> = ({ teacherId }) => {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarks = async () => {
      setLoading(true);
      const [marksData, subjectsData] = await Promise.all([
          api.getMarksForTeacher(teacherId),
          api.getSubjects()
      ]);
      setMarks(marksData);
      setSubjects(subjectsData);
      setLoading(false);
    };
    fetchMarks();
  }, [teacherId]);

  const handleMarksChange = (id: number, value: string) => {
    const newMarks = parseInt(value, 10);
    if (!isNaN(newMarks)) {
      setMarks(prev => prev.map(m => m.id === id ? { ...m, marks: newMarks } : m));
    }
  };

  const handleUpdate = async (id: number) => {
    const markRecord = marks.find(m => m.id === id);
    if (markRecord) {
        await api.updateMark(id, markRecord.marks);
        alert('Marks updated!');
    }
  };

  const columns = [
    { 
        header: 'Student', 
        accessor: (item: Mark) => students.find(s => s.id === item.studentId)?.name || 'N/A' 
    },
    { 
        header: 'Subject', 
        accessor: (item: Mark) => subjects.find(s => s.id === item.subjectId)?.name || 'N/A'
    },
    { header: 'Exam', accessor: 'examName' as keyof Mark },
    { 
        header: 'Marks', 
        accessor: (item: Mark) => (
            <input 
                type="number" 
                value={item.marks} 
                onChange={(e) => handleMarksChange(item.id, e.target.value)}
                className="w-20 p-1 border rounded"
            />
        )
    },
    { header: 'Total', accessor: 'total' as keyof Mark },
    { header: 'Grade', accessor: 'grade' as keyof Mark },
  ];

  if (loading) {
    return <div>Loading marks...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Manage Marks</h2>
      <Table<Mark> 
        columns={columns} 
        data={marks} 
        renderActions={(item) => (
            <button
                onClick={() => handleUpdate(item.id)}
                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
            >
                Update
            </button>
        )}
      />
    </div>
  );
};

export default MarksManagement;
