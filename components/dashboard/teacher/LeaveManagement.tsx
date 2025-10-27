import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../../../services/mockApiService';
import { LeaveRequest } from '../../../types';
import Table from '../../common/Table';
import { students } from '../../../data/seedData';

interface LeaveManagementProps {
    teacherId: number;
}

const LeaveManagement: React.FC<LeaveManagementProps> = ({ teacherId }) => {
    const [requests, setRequests] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const data = await api.getLeaveRequestsForTeacher(teacherId);
        setRequests(data);
        setLoading(false);
    }, [teacherId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleUpdateRequest = async (id: number, status: 'Approved' | 'Rejected') => {
        await api.updateLeaveRequestStatus(id, status);
        fetchData();
    };

    const columns = [
        { header: 'Student', accessor: (item: LeaveRequest) => students.find(s => s.id === item.studentId)?.name || 'N/A' },
        { header: 'From', accessor: 'fromDate' as keyof LeaveRequest },
        { header: 'To', accessor: 'toDate' as keyof LeaveRequest },
        { header: 'Reason', accessor: 'reason' as keyof LeaveRequest },
    ];
    
    if (loading) return <div>Loading leave requests...</div>;

    const pendingRequests = requests.filter(r => r.status === 'Pending');
    const pastRequests = requests.filter(r => r.status !== 'Pending');

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Manage Leave Requests</h2>
            
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Pending Requests</h3>
                <Table<LeaveRequest>
                    columns={columns}
                    data={pendingRequests}
                    renderActions={(request) => (
                        <div className="flex space-x-2">
                            <button onClick={() => handleUpdateRequest(request.id, 'Approved')} className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">Approve</button>
                            <button onClick={() => handleUpdateRequest(request.id, 'Rejected')} className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Reject</button>
                        </div>
                    )}
                />
            </div>
            
            <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Actioned Requests</h3>
                <Table<LeaveRequest> columns={[...columns, { header: 'Status', accessor: 'status' as keyof LeaveRequest }]} data={pastRequests} />
            </div>
        </div>
    );
};

export default LeaveManagement;
