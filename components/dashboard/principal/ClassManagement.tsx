import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as api from '../../../services/mockApiService';
import type { Class } from '../../../types';
import Table from '../../common/Table';
import Modal from '../../common/Modal';
import { PencilIcon, TrashIcon, PlusIcon, BookOpenIcon } from '../../icons/Icons';
import ClassDetails from './ClassDetails';

const ClassManagement: React.FC = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<Partial<Class> | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const data = await api.getClasses();
        setClasses(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenEditModal = (classItem: Partial<Class> | null = null) => {
        setEditingClass(classItem ? { ...classItem } : {});
        setIsEditModalOpen(true);
    };
    
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingClass(null);
    };

    const handleOpenDetailsModal = (classItem: Class) => {
        setSelectedClass(classItem);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedClass(null);
    }

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingClass) return;

        if (editingClass.id) {
            await api.updateClass(editingClass.id, editingClass);
        } else {
            await api.addClass(editingClass as Omit<Class, 'id'>);
        }
        handleCloseEditModal();
        fetchData();
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this class? This could affect students and timetables.')) {
            await api.deleteClass(id);
            fetchData();
        }
    };

    const columns = useMemo(() => [
        { header: 'Class Name', accessor: 'name' as keyof Class },
        { header: 'Section', accessor: 'section' as keyof Class },
    ], []);

    if (loading) return <div>Loading classes...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Manage Classes</h2>
                <button onClick={() => handleOpenEditModal()} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                    <PlusIcon /> <span className="ml-2">Add Class</span>
                </button>
            </div>
            <Table<Class>
                columns={columns}
                data={classes}
                renderActions={(classItem) => (
                    <>
                        <button onClick={() => handleOpenDetailsModal(classItem)} className="text-blue-600 hover:text-blue-900" title="Manage Subjects & Timetable"><BookOpenIcon /></button>
                        <button onClick={() => handleOpenEditModal(classItem)} className="text-indigo-600 hover:text-indigo-900" title="Edit Class Details"><PencilIcon /></button>
                        <button onClick={() => handleDelete(classItem.id)} className="text-red-600 hover:text-red-900" title="Delete Class"><TrashIcon /></button>
                    </>
                )}
            />

            {isEditModalOpen && editingClass && (
                <Modal title={editingClass.id ? "Edit Class" : "Add Class"} onClose={handleCloseEditModal}>
                    <form onSubmit={handleSave} className="space-y-4">
                        <input type="text" placeholder="Class Name (e.g., 10)" value={editingClass.name || ''} onChange={e => setEditingClass({ ...editingClass, name: e.target.value })} className="w-full p-2 border rounded" required />
                        <input type="text" placeholder="Section (e.g., A)" value={editingClass.section || ''} onChange={e => setEditingClass({ ...editingClass, section: e.target.value })} className="w-full p-2 border rounded" required />
                        <div className="flex justify-end mt-4">
                            <button type="button" onClick={handleCloseEditModal} className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-md">Cancel</button>
                            <button type="submit" className="px-4 py-2 text-white bg-indigo-600 rounded-md">Save</button>
                        </div>
                    </form>
                </Modal>
            )}

            {isDetailsModalOpen && selectedClass && (
                 <Modal title={`Manage Class: ${selectedClass.name}-${selectedClass.section}`} onClose={handleCloseDetailsModal}>
                    <ClassDetails classItem={selectedClass} />
                </Modal>
            )}
        </div>
    );
};

export default ClassManagement;