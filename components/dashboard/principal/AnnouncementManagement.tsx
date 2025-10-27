import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as api from '../../../services/mockApiService';
import type { Announcement } from '../../../types';
import Table from '../../common/Table';
import Modal from '../../common/Modal';
import { PencilIcon, TrashIcon, PlusIcon } from '../../icons/Icons';

const AnnouncementManagement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Partial<Announcement> | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = await api.getAnnouncements();
    setAnnouncements(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (announcement: Partial<Announcement> | null = null) => {
    setEditingAnnouncement(announcement ? { ...announcement } : { roleVisibility: 'All', date: new Date().toISOString().split('T')[0] });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAnnouncement(null);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingAnnouncement) return;

    if (editingAnnouncement.id) {
      await api.updateAnnouncement(editingAnnouncement.id, editingAnnouncement);
    } else {
      await api.addAnnouncement(editingAnnouncement as Omit<Announcement, 'id'>);
    }
    handleCloseModal();
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      await api.deleteAnnouncement(id);
      fetchData();
    }
  };

  const columns = useMemo(() => [
    { header: 'Date', accessor: 'date' as keyof Announcement },
    { header: 'Title', accessor: 'title' as keyof Announcement },
    { header: 'Visibility', accessor: 'roleVisibility' as keyof Announcement },
  ], []);

  if (loading) return <div>Loading announcements...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Manage Announcements</h2>
        <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          <PlusIcon /> <span className="ml-2">New Announcement</span>
        </button>
      </div>
      <Table<Announcement>
        columns={columns}
        data={announcements}
        renderActions={(announcement) => (
          <>
            <button onClick={() => handleOpenModal(announcement)} className="text-indigo-600 hover:text-indigo-900"><PencilIcon /></button>
            <button onClick={() => handleDelete(announcement.id)} className="text-red-600 hover:text-red-900"><TrashIcon /></button>
          </>
        )}
      />

      {isModalOpen && editingAnnouncement && (
        <Modal title={editingAnnouncement.id ? "Edit Announcement" : "New Announcement"} onClose={handleCloseModal}>
          <form onSubmit={handleSave} className="space-y-4">
            <input type="text" placeholder="Title" value={editingAnnouncement.title || ''} onChange={e => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })} className="w-full p-2 border rounded" required />
            <textarea placeholder="Message" value={editingAnnouncement.message || ''} onChange={e => setEditingAnnouncement({ ...editingAnnouncement, message: e.target.value })} className="w-full p-2 border rounded" rows={4} required></textarea>
            <div>
              <label className="text-sm font-medium">Visible to:</label>
              <select value={editingAnnouncement.roleVisibility || 'All'} onChange={e => setEditingAnnouncement({ ...editingAnnouncement, roleVisibility: e.target.value as any })} className="w-full p-2 border rounded" required>
                <option value="All">All</option>
                <option value="Teachers">Teachers</option>
                <option value="Students">Students</option>
              </select>
            </div>
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

export default AnnouncementManagement;