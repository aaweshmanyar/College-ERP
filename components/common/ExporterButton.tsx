import React, { useState } from 'react';
import { exportToExcel } from '../../utils/exportUtils';
import { DownloadIcon } from '../icons/Icons';

declare const XLSX: any;

interface ExporterButtonProps {
    fetchData: () => Promise<any[]>;
    filename: string;
}

const ExporterButton: React.FC<ExporterButtonProps> = ({ fetchData, filename }) => {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        try {
            const data = await fetchData();
            if (data && data.length > 0) {
                exportToExcel(data, filename, XLSX);
            } else {
                alert('No data available to export.');
            }
        } catch (error) {
            console.error("Export failed:", error);
            alert('Failed to export data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-300"
        >
            <DownloadIcon />
            <span className="ml-2">{loading ? 'Exporting...' : 'Export to Excel'}</span>
        </button>
    );
};

export default ExporterButton;