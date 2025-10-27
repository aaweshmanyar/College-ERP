export enum UserRole {
  PRINCIPAL = 'Principal',
  TEACHER = 'Teacher',
  STUDENT = 'Student',
  PARENT = 'Parent',
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Student {
  id: number;
  userId: number;
  parentId?: number;
  name: string;
  classId: number;
  section: string;
  rollNumber: string;
  dob: string; // YYYY-MM-DD
  gender: 'Male' | 'Female' | 'Other';
  guardianName: string;
  guardianContact: string;
  address: string;
  admissionDate: string; // YYYY-MM-DD
}

export interface Teacher {
  id: number;
  userId: number;
  name: string;
  department: string;
  phone: string;
  qualification: string;
  joiningDate: string; // YYYY-MM-DD
}

export interface Parent {
    id: number;
    userId: number;
    name: string;
}

export interface Class {
  id: number;
  name: string; // e.g. "10"
  section: string; // e.g. "A"
}

export interface Subject {
    id: number;
    name: string;
    code: string;
}

export interface ClassSubjectAssignment {
    id: number;
    classId: number;
    subjectId: number;
}

export interface Attendance {
  id: number;
  studentId: number;
  date: string; // YYYY-MM-DD
  status: 'Present' | 'Absent' | 'Late';
  teacherId: number;
}

export interface Mark {
  id: number;
  studentId: number;
  subjectId: number;
  examName: string; // e.g., 'Midterm', 'Final'
  marks: number;
  total: number;
  grade: string;
  teacherId: number;
}

export interface TimetableEntry {
  id: number;
  teacherId: number;
  subjectId: number;
  classId: number;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  timeSlot: string; // e.g., '09:00 - 10:00'
  room: string;
}

export interface Announcement {
    id: number;
    title: string;
    message: string;
    date: string; // YYYY-MM-DD
    roleVisibility: 'All' | 'Teachers' | 'Students' | 'Parents';
}

export interface Fee {
    id: number;
    studentId: number;
    amount: number;
    dueDate: string;
    status: 'Paid' | 'Unpaid';
    paymentDate?: string;
}

export interface LeaveRequest {
    id: number;
    studentId: number;
    teacherId: number;
    fromDate: string;
    toDate: string;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Promotion {
    id: number;
    studentId: number;
    fromClass: string;
    toClass: string;
    academicYear: string;
    status: 'Passed' | 'Failed';
    marks: string; // e.g. "450/500"
    grade: string;
}

export interface Communication {
    id: number;
    studentId: number;
    teacherId: number;
    subject: string;
    message: string;
    date: string; // YYYY-MM-DD
    isReadByTeacher: boolean;
    reply?: string;
    replyDate?: string;
}