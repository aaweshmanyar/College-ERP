import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../../../services/mockApiService';
import type { Communication } from '../../../types';
import { students } from '../../../data/seedData';
import Modal from '../../common/Modal';

interface TeacherMessagesProps {
    teacherId: number;
}

const TeacherMessages: React.FC<TeacherMessagesProps> = ({ teacherId }) => {
    const [communications, setCommunications] = useState<Communication[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedComm, setSelectedComm] = useState<Communication | null>(null);
    const [replyText, setReplyText] = useState('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        const data = await api.getCommunicationsForTeacher(teacherId);
        setCommunications(data);
        setLoading(false);
    }, [teacherId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleViewMessage = async (comm: Communication) => {
        setSelectedComm(comm);
        setIsModalOpen(true);
        if (!comm.isReadByTeacher) {
            await api.updateCommunication(comm.id, { isReadByTeacher: true });
            fetchData();
        }
    };

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedComm || !replyText) return;
        
        await api.updateCommunication(selectedComm.id, { reply: replyText });
        setReplyText('');
        setIsModalOpen(false);
        setSelectedComm(null);
        fetchData();
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedComm(null);
        setReplyText('');
    }

    if (loading) return <div>Loading messages...</div>;

    const unreadCount = communications.filter(c => !c.isReadByTeacher).length;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Student Messages</h2>
                {unreadCount > 0 && (
                    <span className="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-full">
                        {unreadCount} New
                    </span>
                )}
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {communications.length > 0 ? communications.map(comm => (
                        <li key={comm.id} onClick={() => handleViewMessage(comm)} className={`p-4 hover:bg-gray-50 cursor-pointer ${!comm.isReadByTeacher ? 'bg-indigo-50' : ''}`}>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    {!comm.isReadByTeacher && <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{comm.subject}</p>
                                        <p className="text-sm text-gray-600">From: {students.find(s => s.id === comm.studentId)?.name || 'N/A'}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">{comm.date}</p>
                            </div>
                        </li>
                    )) : (
                        <li className="p-4 text-center text-gray-500">You have no messages.</li>
                    )}
                </ul>
            </div>
            
            {isModalOpen && selectedComm && (
                <Modal title={selectedComm.subject} onClose={handleCloseModal}>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-semibold">From: {students.find(s => s.id === selectedComm.studentId)?.name}</p>
                            <p className="text-sm font-semibold">Date: {selectedComm.date}</p>
                            <p className="mt-2 text-gray-700">{selectedComm.message}</p>
                        </div>

                        {selectedComm.reply ? (
                            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                                <p className="text-sm font-semibold">Your Reply ({selectedComm.replyDate}):</p>
                                <p className="mt-1 text-gray-700">{selectedComm.reply}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSendReply}>
                                <label className="block text-sm font-medium mb-1">Your Reply</label>
                                <textarea value={replyText} onChange={e => setReplyText(e.target.value)} className="w-full p-2 border rounded" rows={4} required />
                                <div className="flex justify-end mt-4">
                                    <button type="button" onClick={handleCloseModal} className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-md">Close</button>
                                    <button type="submit" className="px-4 py-2 text-white bg-indigo-600 rounded-md">Send Reply</button>
                                </div>
                            </form>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default TeacherMessages;
