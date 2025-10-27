import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../../../services/mockApiService';
import { LeaveRequest } from '../../../types';
import Table from '../../common/Table';
import { students, timetable, teachers } from '../../../data/seedData';
import Modal from '../../common/Modal';
import { PlusIcon } from '../../icons/Icons';

interface LeaveRequestViewProps {
    studentId: number;
}

const LeaveRequestView: React.FC<LeaveRequestViewProps> = ({ studentId }) => {
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRequest, setNewRequest] = useState({ fromDate: '', toDate: '', reason: '' });

    const fetchData = useCallback(async () => {
        setLoading(true);
        const data = await api.getLeaveRequestsForStudent(studentId);
        setLeaveRequests(data);
        setLoading(false);
    }, [studentId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleApplyLeave = async (e: React.FormEvent) => {
        e.preventDefault();
        const student = students.find(s => s.id === studentId);
        if (!student) return;
        
        // Simple logic to find a teacher for the student's class
        const entry = timetable.find(t => t.classId === student.classId);
        if (!entry) {
            alert("Could not determine teacher for leave request.");
            return;
        }

        await api.addLeaveRequest({ ...newRequest, studentId, teacherId: entry.teacherId });
        setIsModalOpen(false);
        setNewRequest({ fromDate: '', toDate: '', reason: '' });
        fetchData();
    };
    
    const getStatusColor = (status: LeaveRequest['status']) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    const columns = [
        { header: 'From', accessor: 'fromDate' as keyof LeaveRequest },
        { header: 'To', accessor: 'toDate' as keyof LeaveRequest },
        { header: 'Reason', accessor: 'reason' as keyof LeaveRequest },
        { header: 'Approver', accessor: (item: LeaveRequest) => teachers.find(t => t.id === item.teacherId)?.name || 'N/A' },
        { header: 'Status', accessor: (item: LeaveRequest) => (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                {item.status}
            </span>
        )},
    ];

    if (loading) return <div>Loading leave requests...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Leave Requests</h2>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                    <PlusIcon /> <span className="ml-2">Apply for Leave</span>
                </button>
            </div>
            <Table<LeaveRequest> columns={columns} data={leaveRequests} />
            
            {isModalOpen && (
                <Modal title="Apply for Leave" onClose={() => setIsModalOpen(false)}>
                    <form onSubmit={handleApplyLeave} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">From Date</label>
                                <input type="date" value={newRequest.fromDate} onChange={e => setNewRequest({...newRequest, fromDate: e.target.value})} className="w-full p-2 border rounded" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">To Date</label>
                                <input type="date" value={newRequest.toDate} onChange={e => setNewRequest({...newRequest, toDate: e.target.value})} className="w-full p-2 border rounded" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Reason</label>
                            <textarea value={newRequest.reason} onChange={e => setNewRequest({...newRequest, reason: e.target.value})} className="w-full p-2 border rounded" rows={3} required />
                        </div>
                        <div className="flex justify-end mt-4">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-md">Cancel</button>
                            <button type="submit" className="px-4 py-2 text-white bg-indigo-600 rounded-md">Submit</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default LeaveRequestView;