import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../../../services/mockApiService';
import { Fee } from '../../../types';
import Table from '../../common/Table';

interface FeeManagementProps {
    studentId: number;
}

const FeeManagement: React.FC<FeeManagementProps> = ({ studentId }) => {
    const [fees, setFees] = useState<Fee[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const feeData = await api.getFeesForStudent(studentId);
        setFees(feeData);
        setLoading(false);
    }, [studentId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePayFee = async (feeId: number) => {
        if (window.confirm('Proceed with payment? This is a simulation.')) {
            await api.updateFeeStatus(feeId, 'Paid');
            fetchData();
            alert('Payment successful!');
        }
    };

    const columns = [
        { header: 'Amount', accessor: (item: Fee) => `₹${item.amount.toFixed(2)}` },
        { header: 'Due Date', accessor: 'dueDate' as keyof Fee },
        { header: 'Status', accessor: (item: Fee) => (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                item.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
                {item.status}
            </span>
        )},
        // FIX: Removed duplicate 'accessor' property which caused a syntax error.
        { header: 'Payment Date', accessor: (item: Fee) => item.paymentDate || 'N/A' },
    ];
    
    if (loading) return <div>Loading fee details...</div>;

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Fee Management</h2>
            <Table<Fee>
                columns={columns}
                data={fees}
                renderActions={(fee) => (
                    fee.status === 'Unpaid' && (
                        <button 
                            onClick={() => handlePayFee(fee.id)}
                            className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                        >
                            Pay Now
                        </button>
                    )
                )}
            />
        </div>
    );
};

export default FeeManagement;