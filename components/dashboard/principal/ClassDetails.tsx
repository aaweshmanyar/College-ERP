import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as api from '../../../services/mockApiService';
import type { Class, Subject, TimetableEntry, Teacher, ClassSubjectAssignment } from '../../../types';
import Table from '../../common/Table';
import { TrashIcon, PlusIcon } from '../../icons/Icons';

interface ClassDetailsProps {
    classItem: Class;
}

const ClassDetails: React.FC<ClassDetailsProps> = ({ classItem }) => {
    const [assignments, setAssignments] = useState<ClassSubjectAssignment[]>([]);
    const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
    const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [newSubjectId, setNewSubjectId] = useState<string>('');
    
    const fetchData = useCallback(async () => {
        setLoading(true);
        const [assignmentsData, subjectsData, timetableData, teachersData] = await Promise.all([
            api.getClassSubjectAssignments(classItem.id),
            api.getSubjects(),
            api.getTimetableForStudent(classItem.id),
            api.getTeachers()
        ]);
        setAssignments(assignmentsData);
        setAllSubjects(subjectsData);
        setTimetable(timetableData);
        setTeachers(teachersData);
        setLoading(false);
    }, [classItem.id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const assignedSubjects = useMemo(() => {
        const assignedIds = new Set(assignments.map(a => a.subjectId));
        return allSubjects.filter(s => assignedIds.has(s.id));
    }, [assignments, allSubjects]);

    const unassignedSubjects = useMemo(() => {
        const assignedIds = new Set(assignments.map(a => a.subjectId));
        return allSubjects.filter(s => !assignedIds.has(s.id));
    }, [assignments, allSubjects]);
    
    const handleAddSubject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSubjectId) return;
        await api.addSubjectAssignment(classItem.id, parseInt(newSubjectId, 10));
        setNewSubjectId('');
        fetchData();
    };
    
    const handleRemoveSubject = async (subjectId: number) => {
        const assignment = assignments.find(a => a.subjectId === subjectId);
        if (assignment && window.confirm(`Are you sure you want to remove this subject from the class?`)) {
            await api.deleteSubjectAssignment(assignment.id);
            fetchData();
        }
    };

    const timetableColumns = useMemo(() => [
        { header: 'Day', accessor: 'day' as keyof TimetableEntry },
        { header: 'Time Slot', accessor: 'timeSlot' as keyof TimetableEntry },
        { header: 'Subject', accessor: (item: TimetableEntry) => allSubjects.find(s => s.id === item.subjectId)?.name || 'N/A' },
        { header: 'Teacher', accessor: (item: TimetableEntry) => teachers.find(t => t.id === item.teacherId)?.name || 'N/A' },
        { header: 'Room', accessor: 'room' as keyof TimetableEntry },
    ], [allSubjects, teachers]);

    if (loading) return <div>Loading class details...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Manage Subjects</h3>
                <div className="p-4 border rounded-md bg-gray-50">
                    <ul className="space-y-2 mb-4">
                        {assignedSubjects.length > 0 ? assignedSubjects.map(subject => (
                            <li key={subject.id} className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
                                <span>{subject.name} ({subject.code})</span>
                                <button onClick={() => handleRemoveSubject(subject.id)} className="text-red-500 hover:text-red-700"><TrashIcon/></button>
                            </li>
                        )) : <p className="text-sm text-gray-500">No subjects assigned yet.</p>}
                    </ul>
                    <form onSubmit={handleAddSubject} className="flex items-center space-x-2 border-t pt-4">
                        <select 
                            value={newSubjectId} 
                            onChange={e => setNewSubjectId(e.target.value)} 
                            className="p-2 border rounded-md w-full"
                        >
                            <option value="">-- Select a subject to add --</option>
                            {unassignedSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <button type="submit" disabled={!newSubjectId} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
                            <PlusIcon /> <span className="ml-1">Add</span>
                        </button>
                    </form>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Class Timetable</h3>
                <Table<TimetableEntry> columns={timetableColumns} data={timetable} />
            </div>
        </div>
    );
};

export default ClassDetails;
