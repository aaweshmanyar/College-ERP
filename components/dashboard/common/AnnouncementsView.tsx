import React, { useState, useEffect } from 'react';
import * as api from '../../../services/mockApiService';
import { Announcement, UserRole } from '../../../types';

interface AnnouncementsViewProps {
    role: UserRole;
}

const roleMap: Record<UserRole, string> = {
    [UserRole.STUDENT]: 'Students',
    [UserRole.TEACHER]: 'Teachers',
};

const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({ role }) => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                setLoading(true);
                const allAnnouncements = await api.getAnnouncements();

                const filtered = allAnnouncements.filter(a => {
                    return (
                        a.roleVisibility === 'All' ||
                        a.roleVisibility === roleMap[role]
                    );
                });

                setAnnouncements(filtered);
            } catch (err) {
                console.error('Error fetching announcements:', err);
                setError('Failed to load announcements.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, [role]);

    if (loading) {
        return (
            <div role="status" aria-live="polite" className="text-gray-600">
                <span className="animate-pulse">Loading announcements...</span>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Announcements</h2>
            <div className="space-y-4">
                {announcements.length > 0 ? (
                    announcements.map(ann => (
                        <div key={ann.id} className="p-4 bg-white rounded-lg shadow">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800">{ann.title}</h3>
                                <span className="text-xs text-gray-500">{ann.date}</span>
                            </div>
                            <p className="mt-2 text-sm text-gray-600">{ann.message}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 italic">No announcements available for your role.</p>
                )}
            </div>
        </div>
    );
};

export default AnnouncementsView;
