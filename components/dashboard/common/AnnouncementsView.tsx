import React, { useState, useEffect } from 'react';
import * as api from '../../../services/mockApiService';
import { Announcement, UserRole } from '../../../types';

interface AnnouncementsViewProps {
    role: UserRole;
}

const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({ role }) => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            setLoading(true);
            const allAnnouncements = await api.getAnnouncements();
            // FIX: Correctly filter announcements based on role. The UserRole enum ('Student')
            // did not match the roleVisibility string ('Students'), causing a type error and incorrect filtering.
            const filtered = allAnnouncements.filter(a => {
                if (a.roleVisibility === 'All') return true;
                switch (role) {
                    case UserRole.STUDENT:
                        return a.roleVisibility === 'Students';
                    case UserRole.TEACHER:
                        return a.roleVisibility === 'Teachers';
                    default:
                        return false;
                }
            });
            setAnnouncements(filtered);
            setLoading(false);
        };
        fetchAnnouncements();
    }, [role]);

    if (loading) {
        return <div>Loading announcements...</div>
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Announcements</h2>
            <div className="space-y-4">
                {announcements.length > 0 ? announcements.map(ann => (
                    <div key={ann.id} className="p-4 bg-white rounded-lg shadow">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">{ann.title}</h3>
                            <span className="text-xs text-gray-500">{ann.date}</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{ann.message}</p>
                    </div>
                )) : (
                    <p className="text-gray-500">No announcements at this time.</p>
                )}
            </div>
        </div>
    );
};

export default AnnouncementsView;