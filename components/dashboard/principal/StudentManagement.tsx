import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as api from '../../../services/mockApiService';
import type { Student, Class, Subject } from '../../../types';
import Table from '../../common/Table';
import Modal from '../../common/Modal';
import { PencilIcon, TrashIcon, PlusIcon, EyeIcon, IdIcon } from '../../icons/Icons';
import ExporterButton from '../../common/ExporterButton';
import { prepareStudentExportData } from '../../../utils/exportUtils';
import DetailedStudentProfile from '../common/DetailedStudentProfile';
import StudentIDCard from '../common/StudentIDCard';

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Partial<Student> | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [generatingIdCardFor, setGeneratingIdCardFor] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [studentData, classData, subjectData] = await Promise.all([api.getStudents(), api.getClasses(), api.getSubjects()]);
    setStudents(studentData);
    setClasses(classData);
    setSubjects(subjectData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredStudents = useMemo(() => {
    if (!searchQuery) {
        return students;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return students.filter(student =>
        student.name.toLowerCase().includes(lowercasedQuery) ||
        student.rollNumber.toLowerCase().includes(lowercasedQuery)
    );
  }, [students, searchQuery]);

  const handleOpenModal = (student: Partial<Student> | null = null) => {
    setEditingStudent(student ? {...student} : { gender: 'Male' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingStudent) return;
    
    const requiredFields: (keyof Student)[] = ['name', 'rollNumber', 'classId', 'admissionDate', 'dob', 'guardianName', 'guardianContact'];
    for (const field of requiredFields) {
        if (!editingStudent[field]) {
            alert(`Field '${field}' is required.`);
            return;
        }
    }

    if (editingStudent.id) {
      await api.updateStudent(editingStudent.id, editingStudent);
    } else {
      const dummyUserData = { userId: Math.floor(Math.random() * 1000), ...editingStudent };
      await api.addStudent(dummyUserData as Omit<Student, 'id'>);
    }
    handleCloseModal();
    fetchData();
  };

  const handleDelete = async (studentId: number) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      await api.deleteStudent(studentId);
      fetchData();
    }
  };

  const handleExport = async () => {
    const fullStudentData = await api.getFullStudentData();
    const exportData = await prepareStudentExportData(fullStudentData, await api.getSubjects(), await api.getClasses());
    return exportData;
  }

  const columns = useMemo(() => [
    { header: 'Roll No.', accessor: 'rollNumber' as keyof Student },
    { header: 'Name', accessor: 'name' as keyof Student },
    { header: 'Class', accessor: (item: Student) => {
        const studentClass = classes.find(c => c.id === item.classId);
        return studentClass ? `${studentClass.name}-${studentClass.section}` : 'N/A';
      }
    },
    { header: 'Guardian', accessor: 'guardianName' as keyof Student },
    { header: 'Contact', accessor: 'guardianContact' as keyof Student },
  ], [classes]);

  if (loading) return <div>Loading students...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Manage Students</h2>
        <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search by name or roll no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <ExporterButton fetchData={handleExport} filename="All_Students_Report" />
            <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                <PlusIcon /> <span className="ml-2">Add Student</span>
            </button>
        </div>
      </div>
      <Table<Student>
        columns={columns}
        data={filteredStudents}
        renderActions={(student) => (
          <>
            <button onClick={() => setGeneratingIdCardFor(student)} className="text-blue-600 hover:text-blue-900" title="Generate ID Card"><IdIcon /></button>
            <button onClick={() => setViewingStudent(student)} className="text-gray-600 hover:text-gray-900" title="View Profile"><EyeIcon /></button>
            <button onClick={() => handleOpenModal(student)} className="text-indigo-600 hover:text-indigo-900" title="Edit"><PencilIcon /></button>
            <button onClick={() => handleDelete(student.id)} className="text-red-600 hover:text-red-900" title="Delete"><TrashIcon /></button>
          </>
        )}
      />

      {isModalOpen && editingStudent && (
        <Modal title={editingStudent.id ? "Edit Student" : "Add Student"} onClose={handleCloseModal}>
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" value={editingStudent.name || ''} onChange={e => setEditingStudent({...editingStudent, name: e.target.value})} className="p-2 border rounded" required/>
              <input type="text" placeholder="Roll Number" value={editingStudent.rollNumber || ''} onChange={e => setEditingStudent({...editingStudent, rollNumber: e.target.value})} className="p-2 border rounded" required/>
              <select value={editingStudent.classId || ''} onChange={e => setEditingStudent({...editingStudent, classId: parseInt(e.target.value)})} className="p-2 border rounded" required>
                <option value="">Select Class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}-{c.section}</option>)}
              </select>
              <select value={editingStudent.gender || ''} onChange={e => setEditingStudent({...editingStudent, gender: e.target.value as any})} className="p-2 border rounded" required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <div><label className="text-xs">Date of Birth</label><input type="date" value={editingStudent.dob || ''} onChange={e => setEditingStudent({...editingStudent, dob: e.target.value})} className="w-full p-2 border rounded" required/></div>
              <div><label className="text-xs">Admission Date</label><input type="date" value={editingStudent.admissionDate || ''} onChange={e => setEditingStudent({...editingStudent, admissionDate: e.target.value})} className="w-full p-2 border rounded" required/></div>
              <input type="text" placeholder="Guardian Name" value={editingStudent.guardianName || ''} onChange={e => setEditingStudent({...editingStudent, guardianName: e.target.value})} className="p-2 border rounded" required/>
              <input type="text" placeholder="Guardian Contact" value={editingStudent.guardianContact || ''} onChange={e => setEditingStudent({...editingStudent, guardianContact: e.target.value})} className="p-2 border rounded" required/>
              <textarea placeholder="Address" value={editingStudent.address || ''} onChange={e => setEditingStudent({...editingStudent, address: e.target.value})} className="md:col-span-2 p-2 border rounded" required></textarea>
            </div>
            <div className="flex justify-end mt-4">
              <button type="button" onClick={handleCloseModal} className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-md">Cancel</button>
              <button type="submit" className="px-4 py-2 text-white bg-indigo-600 rounded-md">Save</button>
            </div>
          </form>
        </Modal>
      )}

      {viewingStudent && (
        <Modal title={`${viewingStudent.name}'s Profile`} onClose={() => setViewingStudent(null)}>
            <DetailedStudentProfile student={viewingStudent} allClasses={classes} allSubjects={subjects} />
        </Modal>
      )}
      
      {generatingIdCardFor && (
        <Modal title="Student ID Card" onClose={() => setGeneratingIdCardFor(null)}>
            <StudentIDCard student={generatingIdCardFor} studentClass={classes.find(c => c.id === generatingIdCardFor.classId)} />
        </Modal>
      )}

    </div>
  );
};

export default StudentManagement;