import React, { useState, useEffect, useMemo } from 'react';
import { Student, Mark, Attendance, Subject, Class } from '../../../types';
import * as api from '../../../services/mockApiService';
import Table from '../../common/Table';

interface DetailedStudentProfileProps {
  student: Student;
  allClasses: Class[];
  allSubjects: Subject[];
}

const DetailedStudentProfile: React.FC<DetailedStudentProfileProps> = ({ student, allClasses, allSubjects }) => {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [marksData, attendanceData] = await Promise.all([
        api.getMarksForStudent(student.id),
        api.getAttendanceForStudent(student.id)
      ]);
      setMarks(marksData);
      setAttendance(attendanceData);
      setLoading(false);
    };
    fetchData();
  }, [student.id]);

  const studentClass = allClasses.find(c => c.id === student.classId);

  const marksColumns = useMemo(() => [
    { header: 'Exam', accessor: 'examName' as keyof Mark },
    { header: 'Subject', accessor: (item: Mark) => allSubjects.find(s => s.id === item.subjectId)?.name || 'N/A' },
    { header: 'Marks', accessor: (item: Mark) => `${item.marks}/${item.total}` },
    { header: 'Grade', accessor: 'grade' as keyof Mark },
  ], [allSubjects]);

  const attendanceColumns = useMemo(() => [
    { header: 'Date', accessor: 'date' as keyof Attendance },
    { header: 'Status', accessor: 'status' as keyof Attendance },
  ], []);

  return (
    <div className="space-y-6 text-sm">
      {/* Personal & Academic Info */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Student Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <div><strong>Roll No:</strong> {student.rollNumber}</div>
            <div><strong>Class:</strong> {studentClass ? `${studentClass.name}-${studentClass.section}` : 'N/A'}</div>
            <div><strong>Date of Birth:</strong> {student.dob}</div>
            <div><strong>Gender:</strong> {student.gender}</div>
            <div className="md:col-span-2"><strong>Address:</strong> {student.address}</div>
            <div><strong>Admission Date:</strong> {student.admissionDate}</div>
        </div>
      </div>

      {/* Guardian Info */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Guardian Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <div><strong>Name:</strong> {student.guardianName}</div>
            <div><strong>Contact:</strong> {student.guardianContact}</div>
        </div>
      </div>
      
      {/* Marks Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Marks Record</h4>
        {loading ? <p>Loading marks...</p> : <Table columns={marksColumns} data={marks} />}
      </div>

      {/* Attendance Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Attendance History</h4>
        {loading ? <p>Loading attendance...</p> : <Table columns={attendanceColumns} data={attendance} />}
      </div>
    </div>
  );
};

export default DetailedStudentProfile;