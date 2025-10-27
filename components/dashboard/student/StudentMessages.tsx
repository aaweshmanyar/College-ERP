import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as api from '../../../services/mockApiService';
import type { Communication, Teacher, TimetableEntry } from '../../../types';
import { students, teachers, timetable as allTimetable } from '../../../data/seedData';
import { useAuth } from '../../../hooks/useAuth';
import Modal from '../../common/Modal';
import { PlusIcon } from '../../icons/Icons';

const StudentMessages: React.FC = () => {
    const { user } = useAuth();
    const studentInfo = useMemo(() => students.find(s => s.userId === user?.id), [user]);

    const [communications, setCommunications] = useState<Communication[]>([]);
    const [studentTeachers, setStudentTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMessage, setNewMessage] = useState({ teacherId: '', subject: '', message: '' });

    const fetchData = useCallback(async () => {
        if (!studentInfo) return;
        setLoading(true);
        const data = await api.getCommunicationsForStudent(studentInfo.id);
        setCommunications(data);

        // Determine teachers for this student from their timetable
        const studentTimetable = allTimetable.filter(t => t.classId === studentInfo.classId);
        const teacherIds = [...new Set(studentTimetable.map(t => t.teacherId))];
        const studentTeachers = teachers.filter(t => teacherIds.includes(t.id));
        setStudentTeachers(studentTeachers);

        setLoading(false);
    }, [studentInfo]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentInfo || !newMessage.teacherId || !newMessage.subject || !newMessage.message) {
            alert("Please fill all fields.");
            return;
        }

        await api.addCommunication({
            studentId: studentInfo.id,
            teacherId: parseInt(newMessage.teacherId, 10),
            subject: newMessage.subject,
            message: newMessage.message,
        });
        
        setIsModalOpen(false);
        setNewMessage({ teacherId: '', subject: '', message: '' });
        fetchData();
    };

    if (loading) return <div>Loading messages...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">My Messages</h2>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                    <PlusIcon /> <span className="ml-2">New Message</span>
                </button>
            </div>

            <div className="space-y-4">
                {communications.length > 0 ? communications.map(comm => (
                    <div key={comm.id} className="p-4 bg-white rounded-lg shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500">To: {teachers.find(t => t.id === comm.teacherId)?.name || 'N/A'}</p>
                                <h3 className="text-lg font-bold text-gray-800">{comm.subject}</h3>
                            </div>
                            <span className="text-xs text-gray-500">{comm.date}</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-700">{comm.message}</p>
                        {comm.reply && (
                            <div className="mt-4 p-3 bg-gray-50 border-l-4 border-indigo-400 rounded-r-lg">
                                <p className="text-sm font-semibold text-gray-800">Reply from teacher ({comm.replyDate}):</p>
                                <p className="mt-1 text-sm text-gray-600">{comm.reply}</p>
                            </div>
                        )}
                    </div>
                )) : (
                    <p className="text-gray-500 text-center py-8">You have not sent any messages.</p>
                )}
            </div>
            
            {isModalOpen && (
                <Modal title="Compose New Message" onClose={() => setIsModalOpen(false)}>
                    <form onSubmit={handleSendMessage} className="space-y-4">
                        <div>
                            <label htmlFor="teacher-select" className="block text-sm font-medium">To Teacher</label>
                            <select id="teacher-select" value={newMessage.teacherId} onChange={e => setNewMessage({...newMessage, teacherId: e.target.value})} className="w-full p-2 border rounded" required>
                                <option value="">-- Select a teacher --</option>
                                {studentTeachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium">Subject</label>
                            <input type="text" id="subject" value={newMessage.subject} onChange={e => setNewMessage({...newMessage, subject: e.target.value})} className="w-full p-2 border rounded" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Message</label>
                            <textarea value={newMessage.message} onChange={e => setNewMessage({...newMessage, message: e.target.value})} className="w-full p-2 border rounded" rows={5} required />
                        </div>
                        <div className="flex justify-end mt-4">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-md">Cancel</button>
                            <button type="submit" className="px-4 py-2 text-white bg-indigo-600 rounded-md">Send Message</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default StudentMessages;
