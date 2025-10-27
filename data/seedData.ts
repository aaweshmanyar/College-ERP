import { User, UserRole, Student, Teacher, Attendance, Mark, TimetableEntry, Class, Subject, Announcement, Parent, Fee, LeaveRequest, Promotion, ClassSubjectAssignment, Communication } from '../types';

export const users: User[] = [
  { id: 1, name: 'Dr. Evelyn Reed', email: 'principal@school.edu', role: UserRole.PRINCIPAL },
  { id: 2, name: 'Mr. David Chen', email: 'd.chen@school.edu', role: UserRole.TEACHER },
  { id: 3, name: 'Ms. Maria Garcia', email: 'm.garcia@school.edu', role: UserRole.TEACHER },
  { id: 4, name: 'Alice Johnson', email: 'a.johnson@student.edu', role: UserRole.STUDENT },
  { id: 5, name: 'Bob Williams', email: 'b.williams@student.edu', role: UserRole.STUDENT },
  { id: 6, name: 'Charlie Brown', email: 'c.brown@student.edu', role: UserRole.STUDENT },
  { id: 7, name: 'John Johnson', email: 'j.johnson@parent.edu', role: UserRole.PARENT },
  { id: 8, name: 'Sarah Williams', email: 's.williams@parent.edu', role: UserRole.PARENT },
];

export const parents: Parent[] = [
    { id: 301, userId: 7, name: 'John Johnson' },
    { id: 302, userId: 8, name: 'Sarah Williams' },
];

export let classes: Class[] = [
    { id: 1, name: '10', section: 'A' },
    { id: 2, name: '11', section: 'B' },
];

export let subjects: Subject[] = [
    { id: 1, name: 'Mathematics', code: 'MATH101' },
    { id: 2, name: 'History', code: 'HIST101' },
    { id: 3, name: 'Physics', code: 'PHY101'},
];

export let classSubjectAssignments: ClassSubjectAssignment[] = [
    { id: 1, classId: 1, subjectId: 1 }, // Class 10-A has Math
    { id: 2, classId: 1, subjectId: 2 }, // Class 10-A has History
    { id: 3, classId: 2, subjectId: 2 }, // Class 11-B has History
    { id: 4, classId: 2, subjectId: 3 }, // Class 11-B has Physics
];

export let students: Student[] = [
  { id: 101, userId: 4, parentId: 301, name: 'Alice Johnson', classId: 1, section: 'A', rollNumber: '10A01', dob: '2008-03-15', gender: 'Female', guardianName: 'John Johnson', guardianContact: '111-222-3333', address: '123 Maple St', admissionDate: '2022-09-01' },
  { id: 102, userId: 5, parentId: 302, name: 'Bob Williams', classId: 1, section: 'A', rollNumber: '10A02', dob: '2008-05-20', gender: 'Male', guardianName: 'Sarah Williams', guardianContact: '444-555-6666', address: '456 Oak Ave', admissionDate: '2022-09-01' },
  { id: 103, userId: 6, name: 'Charlie Brown', classId: 2, section: 'B', rollNumber: '11B01', dob: '2007-08-10', gender: 'Male', guardianName: 'James Brown', guardianContact: '777-888-9999', address: '789 Pine Ln', admissionDate: '2021-09-01' },
];

export let teachers: Teacher[] = [
  { id: 201, userId: 2, name: 'Mr. David Chen', department: 'Science', phone: '123-456-7890', qualification: 'M.Sc. Mathematics', joiningDate: '2018-07-15' },
  { id: 202, userId: 3, name: 'Ms. Maria Garcia', department: 'Humanities', phone: '098-765-4321', qualification: 'M.A. History', joiningDate: '2020-02-20' },
];

export let attendance: Attendance[] = [
  { id: 301, studentId: 101, date: '2024-05-20', status: 'Present', teacherId: 201 },
  { id: 302, studentId: 102, date: '2024-05-20', status: 'Present', teacherId: 201 },
  { id: 303, studentId: 101, date: '2024-05-21', status: 'Absent', teacherId: 201 },
  { id: 304, studentId: 102, date: '2024-05-21', status: 'Present', teacherId: 201 },
  { id: 305, studentId: 103, date: '2024-05-21', status: 'Late', teacherId: 202 },
];

export let marks: Mark[] = [
  { id: 401, studentId: 101, subjectId: 1, examName: 'Midterm', marks: 85, total: 100, grade: 'A', teacherId: 201 },
  { id: 402, studentId: 101, subjectId: 2, examName: 'Midterm', marks: 92, total: 100, grade: 'A+', teacherId: 202 },
  { id: 403, studentId: 102, subjectId: 1, examName: 'Midterm', marks: 78, total: 100, grade: 'B+', teacherId: 201 },
  { id: 404, studentId: 103, subjectId: 2, examName: 'Midterm', marks: 88, total: 100, grade: 'A', teacherId: 202 },
];

export let timetable: TimetableEntry[] = [
  { id: 501, teacherId: 201, subjectId: 1, classId: 1, day: 'Monday', timeSlot: '09:00 - 10:00', room: '101' },
  { id: 502, teacherId: 202, subjectId: 2, classId: 2, day: 'Monday', timeSlot: '10:00 - 11:00', room: '202' },
  { id: 503, teacherId: 201, subjectId: 1, classId: 1, day: 'Wednesday', timeSlot: '11:00 - 12:00', room: '101' },
  { id: 504, teacherId: 202, subjectId: 2, classId: 2, day: 'Friday', timeSlot: '09:00 - 10:00', room: '202' },
  { id: 505, teacherId: 201, subjectId: 3, classId: 2, day: 'Tuesday', timeSlot: '13:00 - 14:00', room: '301' },
];

export let announcements: Announcement[] = [
    { id: 1, title: 'Parent-Teacher Meeting', message: 'The quarterly parent-teacher meeting will be held on June 5th, 2024.', date: '2024-05-25', roleVisibility: 'All' },
    { id: 2, title: 'Science Fair Submissions', message: 'Please submit your science fair projects by June 1st.', date: '2024-05-20', roleVisibility: 'Students' },
    { id: 3, title: 'Fee Payment Deadline', message: 'The deadline for fee payment for the next term is June 15th.', date: '2024-05-28', roleVisibility: 'Parents' },
];

export let fees: Fee[] = [
    { id: 601, studentId: 101, amount: 5000, dueDate: '2024-06-15', status: 'Unpaid' },
    { id: 602, studentId: 101, amount: 5000, dueDate: '2024-03-15', status: 'Paid', paymentDate: '2024-03-10'},
    { id: 603, studentId: 102, amount: 5000, dueDate: '2024-06-15', status: 'Unpaid' },
];

export let leaveRequests: LeaveRequest[] = [
    { id: 701, studentId: 101, teacherId: 201, fromDate: '2024-05-28', toDate: '2024-05-29', reason: 'Family function', status: 'Pending' },
    { id: 702, studentId: 102, teacherId: 201, fromDate: '2024-05-23', toDate: '2024-05-23', reason: 'Medical appointment', status: 'Approved' },
];

export let promotions: Promotion[] = [
    { id: 801, studentId: 101, fromClass: '9-A', toClass: '10-A', academicYear: '2021-2022', status: 'Passed', marks: '480/500', grade: 'A+' },
    { id: 802, studentId: 102, fromClass: '9-A', toClass: '10-A', academicYear: '2021-2022', status: 'Passed', marks: '455/500', grade: 'A' },
];

export let communications: Communication[] = [
    { id: 1, studentId: 101, teacherId: 201, subject: 'Difficulty with Physics homework', message: 'Dear Mr. Chen, I am having trouble understanding the concepts from last week\'s physics class. Could you please provide some extra resources?', date: '2024-05-27', isReadByTeacher: true, reply: 'Of course, Alice. I will share some links with you tomorrow in class. Don\'t worry.', replyDate: '2024-05-27' },
    { id: 2, studentId: 102, teacherId: 202, subject: 'Question about the History essay', message: 'Hello Ms. Garcia, I am not sure about the topic for the upcoming history essay. Can we discuss it after class?', date: '2024-05-28', isReadByTeacher: false },
];