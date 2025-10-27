import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as api from '../../../services/mockApiService';
import type { Subject } from '../../../types';
import Table from '../../common/Table';
import Modal from '../../common/Modal';
import { PencilIcon, TrashIcon, PlusIcon } from '../../icons/Icons';

const SubjectManagement: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Partial<Subject> | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = await api.getSubjects();
    setSubjects(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (subject: Partial<Subject> | null = null) => {
    setEditingSubject(subject ? { ...subject } : {});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSubject) return;

    if (editingSubject.id) {
      await api.updateSubject(editingSubject.id, editingSubject);
    } else {
      await api.addSubject(editingSubject as Omit<Subject, 'id'>);
    }
    handleCloseModal();
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      await api.deleteSubject(id);
      fetchData();
    }
  };

  const columns = useMemo(() => [
    { header: 'Subject Name', accessor: 'name' as keyof Subject },
    { header: 'Subject Code', accessor: 'code' as keyof Subject },
  ], []);

  if (loading) return <div>Loading subjects...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Manage Subjects</h2>
        <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          <PlusIcon /> <span className="ml-2">Add Subject</span>
        </button>
      </div>
      <Table<Subject>
        columns={columns}
        data={subjects}
        renderActions={(subject) => (
          <>
            <button onClick={() => handleOpenModal(subject)} className="text-indigo-600 hover:text-indigo-900"><PencilIcon /></button>
            <button onClick={() => handleDelete(subject.id)} className="text-red-600 hover:text-red-900"><TrashIcon /></button>
          </>
        )}
      />

      {isModalOpen && editingSubject && (
        <Modal title={editingSubject.id ? "Edit Subject" : "Add Subject"} onClose={handleCloseModal}>
          <form onSubmit={handleSave} className="space-y-4">
            <input type="text" placeholder="Subject Name" value={editingSubject.name || ''} onChange={e => setEditingSubject({ ...editingSubject, name: e.target.value })} className="w-full p-2 border rounded" required />
            <input type="text" placeholder="Subject Code" value={editingSubject.code || ''} onChange={e => setEditingSubject({ ...editingSubject, code: e.target.value })} className="w-full p-2 border rounded" required />
            <div className="flex justify-end mt-4">
              <button type="button" onClick={handleCloseModal} className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-md">Cancel</button>
              <button type="submit" className="px-4 py-2 text-white bg-indigo-600 rounded-md">Save</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default SubjectManagement;