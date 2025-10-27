import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as api from '../../../services/mockApiService';
import type { TimetableEntry, Teacher, Subject, Class } from '../../../types';
import Table from '../../common/Table';
import { PencilIcon, TrashIcon, PlusIcon } from '../../icons/Icons';
import Modal from '../../common/Modal';

const TimetableManagement: React.FC = () => {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Partial<TimetableEntry> | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [ttData, tData, sData, cData] = await Promise.all([
      api.getTimetable(),
      api.getTeachers(),
      api.getSubjects(),
      api.getClasses()
    ]);
    setTimetable(ttData);
    setTeachers(tData);
    setSubjects(sData);
    setClasses(cData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (entry: Partial<TimetableEntry> | null = null) => {
    setEditingEntry(entry ? { ...entry } : { day: 'Monday' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEntry(null);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingEntry) return;

    if (editingEntry.id) {
      await api.updateTimetableEntry(editingEntry.id, editingEntry);
    } else {
      await api.addTimetableEntry(editingEntry as Omit<TimetableEntry, 'id'>);
    }
    handleCloseModal();
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      await api.deleteTimetableEntry(id);
      fetchData();
    }
  }

  const filteredTimetable = useMemo(() => {
    if (!selectedClassId) {
        return timetable;
    }
    return timetable.filter(entry => entry.classId === parseInt(selectedClassId));
  }, [selectedClassId, timetable]);

  const columns = useMemo(() => [
    { header: 'Day', accessor: 'day' as keyof TimetableEntry },
    { header: 'Time Slot', accessor: 'timeSlot' as keyof TimetableEntry },
    {
      header: 'Class',
      accessor: (item: TimetableEntry) => {
        const c = classes.find(c => c.id === item.classId);
        return c ? `${c.name}-${c.section}` : 'N/A';
      }
    },
    {
      header: 'Subject',
      accessor: (item: TimetableEntry) => subjects.find(s => s.id === item.subjectId)?.name || 'N/A'
    },
    {
      header: 'Teacher',
      accessor: (item: TimetableEntry) => teachers.find(t => t.id === item.teacherId)?.name || 'N/A'
    },
    { header: 'Room', accessor: 'room' as keyof TimetableEntry },
  ], [classes, subjects, teachers]);

  if (loading) {
    return <div>Loading timetable...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl font-semibold text-gray-800">Manage Timetable</h2>
            <div className="mt-2">
                <label htmlFor="class-filter" className="text-sm font-medium text-gray-700 mr-2">Filter by Class:</label>
                <select 
                    id="class-filter"
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md shadow-sm"
                >
                    <option value="">All Classes</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}-{c.section}</option>)}
                </select>
            </div>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          <PlusIcon /> <span className="ml-2">Add Entry</span>
        </button>
      </div>
      <Table<TimetableEntry>
        columns={columns}
        data={filteredTimetable}
        renderActions={(item) => (
          <>
            <button onClick={() => handleOpenModal(item)} className="text-indigo-600 hover:text-indigo-900"><PencilIcon /></button>
            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><TrashIcon /></button>
          </>
        )}
      />

      {isModalOpen && editingEntry && (
        <Modal title={editingEntry.id ? "Edit Timetable Entry" : "Add Timetable Entry"} onClose={handleCloseModal}>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select value={editingEntry.day || ''} onChange={e => setEditingEntry({ ...editingEntry, day: e.target.value as any })} className="p-2 border rounded" required>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
              <input type="text" placeholder="Time Slot (e.g. 09:00-10:00)" value={editingEntry.timeSlot || ''} onChange={e => setEditingEntry({ ...editingEntry, timeSlot: e.target.value })} className="p-2 border rounded" required />
              <select value={editingEntry.classId || ''} onChange={e => setEditingEntry({ ...editingEntry, classId: parseInt(e.target.value) })} className="p-2 border rounded" required>
                <option value="">Select Class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}-{c.section}</option>)}
              </select>
              <select value={editingEntry.subjectId || ''} onChange={e => setEditingEntry({ ...editingEntry, subjectId: parseInt(e.target.value) })} className="p-2 border rounded" required>
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select value={editingEntry.teacherId || ''} onChange={e => setEditingEntry({ ...editingEntry, teacherId: parseInt(e.target.value) })} className="p-2 border rounded" required>
                <option value="">Select Teacher</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <input type="text" placeholder="Room Number" value={editingEntry.room || ''} onChange={e => setEditingEntry({ ...editingEntry, room: e.target.value })} className="p-2 border rounded" required />
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

export default TimetableManagement;