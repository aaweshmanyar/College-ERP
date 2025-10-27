import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../../../services/mockApiService';
import { Promotion } from '../../../types';
import Table from '../../common/Table';

interface PromotionHistoryViewProps {
    studentId: number;
}

const PromotionHistoryView: React.FC<PromotionHistoryViewProps> = ({ studentId }) => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const data = await api.getPromotionsForStudent(studentId);
        setPromotions(data);
        setLoading(false);
    }, [studentId]);
    
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const columns = [
        { header: 'Academic Year', accessor: 'academicYear' as keyof Promotion },
        { header: 'From Class', accessor: 'fromClass' as keyof Promotion },
        { header: 'To Class', accessor: 'toClass' as keyof Promotion },
        { header: 'Marks', accessor: 'marks' as keyof Promotion },
        { header: 'Grade', accessor: 'grade' as keyof Promotion },
        { header: 'Status', accessor: (item: Promotion) => (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                item.status === 'Passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
                {item.status}
            </span>
        )},
    ];

    if (loading) return <div>Loading promotion history...</div>;

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Promotion History</h2>
            <Table<Promotion> columns={columns} data={promotions} />
        </div>
    );
};

export default PromotionHistoryView;