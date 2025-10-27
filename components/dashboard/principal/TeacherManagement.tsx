import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as api from '../../../services/mockApiService';
import type { Teacher, TimetableEntry, Subject } from '../../../types';
import Table from '../../common/Table';
import Modal from '../../common/Modal';
import { PencilIcon, TrashIcon, PlusIcon, EyeIcon } from '../../icons/Icons';
import DetailedTeacherProfile from '../common/DetailedTeacherProfile';

const TeacherManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Partial<Teacher> | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [teacherData, timetableData, subjectData] = await Promise.all([
        api.getTeachers(),
        api.getTimetable(),
        api.getSubjects()
    ]);
    setTeachers(teacherData);
    setTimetable(timetableData);
    setSubjects(subjectData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (teacher: Partial<Teacher> | null = null) => {
    setEditingTeacher(teacher ? { ...teacher } : {});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTeacher(null);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTeacher) return;

    if (editingTeacher.id) {
      await api.updateTeacher(editingTeacher.id, editingTeacher);
    } else {
      const dummyUserData = { userId: Math.floor(Math.random() * 1000), ...editingTeacher };
      await api.addTeacher(dummyUserData as Omit<Teacher, 'id'>);
    }
    handleCloseModal();
    fetchData();
  };

  const handleDelete = async (teacherId: number) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      await api.deleteTeacher(teacherId);
      fetchData();
    }
  };
  
  const getTeacherSubjects = useCallback((teacherId: number) => {
    const teacherSubjectsIds = timetable
        .filter(entry => entry.teacherId === teacherId)
        .map(entry => entry.subjectId);
    const uniqueSubjectIds = [...new Set(teacherSubjectsIds)];
    return uniqueSubjectIds
        .map(id => subjects.find(s => s.id === id)?.name)
        .filter(Boolean);
  }, [timetable, subjects]);

  const columns = useMemo(() => [
    { header: 'Name', accessor: 'name' as keyof Teacher },
    { 
        header: 'Subjects Taught', 
        accessor: (teacher: Teacher) => getTeacherSubjects(teacher.id).join(', ') || 'N/A'
    },
    { header: 'Department', accessor: 'department' as keyof Teacher },
    { header: 'Phone', accessor: 'phone' as keyof Teacher },
    { header: 'Joining Date', accessor: 'joiningDate' as keyof Teacher },
  ], [getTeacherSubjects]);

  if (loading) return <div>Loading teachers...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Manage Teachers</h2>
        <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          <PlusIcon /> <span className="ml-2">Add Teacher</span>
        </button>
      </div>
      <Table<Teacher>
        columns={columns}
        data={teachers}
        renderActions={(teacher) => (
          <>
            <button onClick={() => setViewingTeacher(teacher)} className="text-gray-600 hover:text-gray-900" title="View Profile"><EyeIcon /></button>
            <button onClick={() => handleOpenModal(teacher)} className="text-indigo-600 hover:text-indigo-900"><PencilIcon /></button>
            <button onClick={() => handleDelete(teacher.id)} className="text-red-600 hover:text-red-900"><TrashIcon /></button>
          </>
        )}
      />

      {isModalOpen && editingTeacher && (
        <Modal title={editingTeacher.id ? "Edit Teacher" : "Add Teacher"} onClose={handleCloseModal}>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" value={editingTeacher.name || ''} onChange={e => setEditingTeacher({ ...editingTeacher, name: e.target.value })} className="p-2 border rounded" required />
              <input type="text" placeholder="Department" value={editingTeacher.department || ''} onChange={e => setEditingTeacher({ ...editingTeacher, department: e.target.value })} className="p-2 border rounded" required />
              <input type="tel" placeholder="Phone Number" value={editingTeacher.phone || ''} onChange={e => setEditingTeacher({ ...editingTeacher, phone: e.target.value })} className="p-2 border rounded" required />
              <input type="text" placeholder="Qualification" value={editingTeacher.qualification || ''} onChange={e => setEditingTeacher({ ...editingTeacher, qualification: e.target.value })} className="p-2 border rounded" required />
              <div><label className="text-xs">Joining Date</label><input type="date" value={editingTeacher.joiningDate || ''} onChange={e => setEditingTeacher({ ...editingTeacher, joiningDate: e.target.value })} className="w-full p-2 border rounded" required /></div>
            </div>
            <div className="flex justify-end mt-4">
              <button type="button" onClick={handleCloseModal} className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-md">Cancel</button>
              <button type="submit" className="px-4 py-2 text-white bg-indigo-600 rounded-md">Save</button>
            </div>
          </form>
        </Modal>
      )}

      {viewingTeacher && (
        <Modal title={`${viewingTeacher.name}'s Profile`} onClose={() => setViewingTeacher(null)}>
            <DetailedTeacherProfile teacher={viewingTeacher} subjectsTaught={getTeacherSubjects(viewingTeacher.id)} />
        </Modal>
      )}
    </div>
  );
};

export default TeacherManagement;