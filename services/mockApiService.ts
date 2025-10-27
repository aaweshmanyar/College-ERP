import { users, students, teachers, attendance, marks, timetable, classes, subjects, announcements, parents, fees, leaveRequests, promotions, classSubjectAssignments, communications } from '../data/seedData';
import type { Student, Teacher, TimetableEntry, Mark, Attendance, Class, Subject, Announcement, Parent, Fee, LeaveRequest, Promotion, ClassSubjectAssignment, Communication } from '../types';

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- GETTERS ---
export const getStudents = async (): Promise<Student[]> => {
  await delay(300);
  return [...students];
};
export const getTeachers = async (): Promise<Teacher[]> => {
  await delay(300);
  return [...teachers];
};
export const getClasses = async (): Promise<Class[]> => {
  await delay(300);
  return [...classes];
};
export const getSubjects = async (): Promise<Subject[]> => {
    await delay(300);
    return [...subjects];
};
export const getAnnouncements = async (): Promise<Announcement[]> => {
    await delay(300);
    return [...announcements];
}
export const getTimetable = async (): Promise<TimetableEntry[]> => {
    await delay(300);
    return [...timetable];
};
export const getMarksForStudent = async (studentId: number): Promise<Mark[]> => {
    await delay(300);
    return marks.filter(m => m.studentId === studentId);
};
export const getAttendanceForStudent = async (studentId: number): Promise<Attendance[]> => {
    await delay(300);
    return attendance.filter(a => a.studentId === studentId);
};
export const getStudentsForTeacher = async (teacherId: number): Promise<Student[]> => {
    await delay(300);
    const teacherClasses = new Set(timetable.filter(t => t.teacherId === teacherId).map(t => t.classId));
    return students.filter(s => teacherClasses.has(s.classId));
};
export const getTimetableForTeacher = async (teacherId: number): Promise<TimetableEntry[]> => {
    await delay(300);
    return timetable.filter(t => t.teacherId === teacherId);
};
export const getTimetableForStudent = async (classId: number): Promise<TimetableEntry[]> => {
    await delay(300);
    return timetable.filter(t => t.classId === classId);
}
export const getAttendanceForTeacher = async (teacherId: number): Promise<Attendance[]> => {
    await delay(300);
    return attendance.filter(a => a.teacherId === teacherId);
}
export const getMarksForTeacher = async (teacherId: number): Promise<Mark[]> => {
    await delay(300);
    return marks.filter(m => m.teacherId === teacherId);
}
export const getFullStudentData = async(): Promise<any[]> => {
    await delay(500);
    return students.map(student => {
        const studentMarks = marks.filter(m => m.studentId === student.id);
        const studentAttendance = attendance.filter(a => a.studentId === student.id);
        return {
            ...student,
            marks: studentMarks,
            attendance: studentAttendance,
        };
    });
};
export const getStudentForParent = async(parentId: number): Promise<Student | undefined> => {
    await delay(300);
    return students.find(s => s.parentId === parentId);
}

// --- NEW GETTERS for Fees, Leave, Promotions ---
export const getFeesForStudent = async(studentId: number): Promise<Fee[]> => {
    await delay(300);
    return fees.filter(f => f.studentId === studentId);
}
export const getLeaveRequestsForStudent = async(studentId: number): Promise<LeaveRequest[]> => {
    await delay(300);
    return leaveRequests.filter(lr => lr.studentId === studentId);
}
export const getLeaveRequestsForTeacher = async(teacherId: number): Promise<LeaveRequest[]> => {
    await delay(300);
    const teacherStudentIds = new Set((await getStudentsForTeacher(teacherId)).map(s => s.id));
    return leaveRequests.filter(lr => teacherStudentIds.has(lr.studentId));
}
export const getPromotionsForStudent = async(studentId: number): Promise<Promotion[]> => {
    await delay(300);
    return promotions.filter(p => p.studentId === studentId);
}
export const getClassSubjectAssignments = async (classId: number): Promise<ClassSubjectAssignment[]> => {
    await delay(200);
    return classSubjectAssignments.filter(csa => csa.classId === classId);
}


// --- MUTATIONS ---

// Student CRUD
export const addStudent = async (studentData: Omit<Student, 'id'>): Promise<Student> => {
    await delay(200);
    const newStudent = { ...studentData, id: Math.max(...students.map(s => s.id), 0) + 1 };
    students.push(newStudent);
    return newStudent;
}
export const updateStudent = async (studentId: number, studentData: Partial<Student>): Promise<Student> => {
    await delay(200);
    const index = students.findIndex(s => s.id === studentId);
    if (index === -1) throw new Error("Student not found");
    students[index] = { ...students[index], ...studentData };
    return students[index];
}
export const deleteStudent = async (studentId: number): Promise<void> => {
    await delay(200);
    const index = students.findIndex(s => s.id === studentId);
    if (index > -1) {
        students.splice(index, 1);
    }
}


// Teacher CRUD
export const addTeacher = async (teacherData: Omit<Teacher, 'id'>): Promise<Teacher> => {
    await delay(200);
    const newTeacher = { ...teacherData, id: Math.max(...teachers.map(t => t.id), 0) + 1 };
    teachers.push(newTeacher);
    return newTeacher;
}
export const updateTeacher = async (teacherId: number, teacherData: Partial<Teacher>): Promise<Teacher> => {
    await delay(200);
    const index = teachers.findIndex(t => t.id === teacherId);
    if (index === -1) throw new Error("Teacher not found");
    teachers[index] = { ...teachers[index], ...teacherData };
    return teachers[index];
}
export const deleteTeacher = async (teacherId: number): Promise<void> => {
    await delay(200);
    const index = teachers.findIndex(t => t.id === teacherId);
    if (index > -1) {
        teachers.splice(index, 1);
    }
}

// Class CRUD
export const addClass = async (classData: Omit<Class, 'id'>): Promise<Class> => {
    await delay(200);
    const newClass = { ...classData, id: Math.max(...classes.map(c => c.id), 0) + 1 };
    classes.push(newClass);
    return newClass;
}
export const updateClass = async (classId: number, classData: Partial<Class>): Promise<Class> => {
    await delay(200);
    const index = classes.findIndex(c => c.id === classId);
    if (index === -1) throw new Error("Class not found");
    classes[index] = { ...classes[index], ...classData };
    return classes[index];
}
export const deleteClass = async (classId: number): Promise<void> => {
    await delay(200);
    const index = classes.findIndex(c => c.id === classId);
    if (index > -1) {
        classes.splice(index, 1);
    }
}

// Subject CRUD
export const addSubject = async (subjectData: Omit<Subject, 'id'>): Promise<Subject> => {
    await delay(200);
    const newSubject = { ...subjectData, id: Math.max(...subjects.map(s => s.id), 0) + 1 };
    subjects.push(newSubject);
    return newSubject;
}
export const updateSubject = async (subjectId: number, subjectData: Partial<Subject>): Promise<Subject> => {
    await delay(200);
    const index = subjects.findIndex(s => s.id === subjectId);
    if (index === -1) throw new Error("Subject not found");
    subjects[index] = { ...subjects[index], ...subjectData };
    return subjects[index];
}
export const deleteSubject = async (subjectId: number): Promise<void> => {
    await delay(200);
    const index = subjects.findIndex(s => s.id === subjectId);
    if (index > -1) {
        subjects.splice(index, 1);
    }
}

// Announcement CRUD
export const addAnnouncement = async (announcementData: Omit<Announcement, 'id'>): Promise<Announcement> => {
    await delay(200);
    const newAnnouncement = { ...announcementData, id: Math.max(...announcements.map(a => a.id), 0) + 1 };
    announcements.push(newAnnouncement);
    return newAnnouncement;
}
export const updateAnnouncement = async (announcementId: number, announcementData: Partial<Announcement>): Promise<Announcement> => {
    await delay(200);
    const index = announcements.findIndex(a => a.id === announcementId);
    if (index === -1) throw new Error("Announcement not found");
    announcements[index] = { ...announcements[index], ...announcementData };
    return announcements[index];
}
export const deleteAnnouncement = async (announcementId: number): Promise<void> => {
    await delay(200);
    const index = announcements.findIndex(a => a.id === announcementId);
    if (index > -1) {
        announcements.splice(index, 1);
    }
}

// Attendance and Marks updates
export const updateAttendance = async (attendanceId: number, newStatus: 'Present' | 'Absent' | 'Late'): Promise<Attendance> => {
    await delay(200);
    const record = attendance.find(a => a.id === attendanceId);
    if (!record) throw new Error("Attendance record not found");
    record.status = newStatus;
    return record;
};

export const updateMark = async (markId: number, newMarks: number): Promise<Mark> => {
    await delay(200);
    const record = marks.find(m => m.id === markId);
    if (!record) throw new Error("Mark record not found");
    record.marks = newMarks;
    return record;
};

// Timetable CRUD
export const addTimetableEntry = async (entry: Omit<TimetableEntry, 'id'>): Promise<TimetableEntry> => {
    await delay(200);
    const newEntry = { ...entry, id: Math.max(...timetable.map(t => t.id), 0) + 1 };
    timetable.push(newEntry);
    return newEntry;
}
export const updateTimetableEntry = async (id: number, entry: Partial<TimetableEntry>): Promise<TimetableEntry> => {
    await delay(200);
    const index = timetable.findIndex(t => t.id === id);
    if (index === -1) throw new Error("Timetable entry not found");
    timetable[index] = { ...timetable[index], ...entry };
    return timetable[index];
}
export const deleteTimetableEntry = async (id: number): Promise<void> => {
    await delay(200);
    const index = timetable.findIndex(t => t.id === id);
    if (index > -1) {
        timetable.splice(index, 1);
    }
}


// --- NEW MUTATIONS ---

// Fee Mutations
export const updateFeeStatus = async (feeId: number, status: 'Paid'): Promise<Fee> => {
    await delay(300);
    const fee = fees.find(f => f.id === feeId);
    if (!fee) throw new Error("Fee not found");
    fee.status = status;
    fee.paymentDate = new Date().toISOString().split('T')[0];
    return fee;
}

// Leave Request Mutations
export const addLeaveRequest = async (request: Omit<LeaveRequest, 'id' | 'status'>): Promise<LeaveRequest> => {
    await delay(300);
    const newRequest: LeaveRequest = {
        ...request,
        id: Math.max(...leaveRequests.map(lr => lr.id), 0) + 1,
        status: 'Pending'
    };
    leaveRequests.push(newRequest);
    return newRequest;
}

export const updateLeaveRequestStatus = async (id: number, status: 'Approved' | 'Rejected'): Promise<LeaveRequest> => {
    await delay(300);
    const request = leaveRequests.find(lr => lr.id === id);
    if (!request) throw new Error("Leave request not found");
    request.status = status;
    return request;
}

// Class Subject Assignments
export const addSubjectAssignment = async (classId: number, subjectId: number): Promise<ClassSubjectAssignment> => {
    await delay(200);
    const newAssignment = { id: Math.max(...classSubjectAssignments.map(a => a.id), 0) + 1, classId, subjectId };
    classSubjectAssignments.push(newAssignment);
    return newAssignment;
}

export const deleteSubjectAssignment = async (assignmentId: number): Promise<void> => {
    await delay(200);
    const index = classSubjectAssignments.findIndex(a => a.id === assignmentId);
    if (index > -1) {
        classSubjectAssignments.splice(index, 1);
    }
}

// --- NEW GETTERS for Communication ---
export const getCommunicationsForStudent = async(studentId: number): Promise<Communication[]> => {
    await delay(300);
    return communications.filter(c => c.studentId === studentId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
export const getCommunicationsForTeacher = async(teacherId: number): Promise<Communication[]> => {
    await delay(300);
    return communications.filter(c => c.teacherId === teacherId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// --- NEW MUTATIONS for Communication ---
export const addCommunication = async (request: Omit<Communication, 'id' | 'isReadByTeacher' | 'date'>): Promise<Communication> => {
    await delay(300);
    const newCommunication: Communication = {
        ...request,
        id: Math.max(...communications.map(c => c.id), 0) + 1,
        isReadByTeacher: false,
        date: new Date().toISOString().split('T')[0]
    };
    communications.push(newCommunication);
    return newCommunication;
}

export const updateCommunication = async (id: number, data: Partial<Pick<Communication, 'isReadByTeacher' | 'reply'>>): Promise<Communication> => {
    await delay(300);
    const comm = communications.find(c => c.id === id);
    if (!comm) throw new Error("Communication not found");
    
    if (data.reply) {
        comm.reply = data.reply;
        comm.replyDate = new Date().toISOString().split('T')[0];
    }
    if (data.isReadByTeacher !== undefined) {
        comm.isReadByTeacher = data.isReadByTeacher;
    }
    return comm;
}

// --- PERFORMANCE DATA ---
export const getSchoolWidePerformanceData = async () => {
    await delay(500);
    const studentPerformances = students.map(student => {
        const studentMarks = marks.filter(m => m.studentId === student.id);
        const totalMarks = studentMarks.reduce((acc, curr) => acc + curr.marks, 0);
        const totalPossible = studentMarks.reduce((acc, curr) => acc + curr.total, 0);
        const percentage = totalPossible > 0 ? (totalMarks / totalPossible) * 100 : 0;
        return { student, percentage };
    });

    const totalStudents = students.length;
    const schoolAverage = totalStudents > 0 ? studentPerformances.reduce((acc, curr) => acc + curr.percentage, 0) / totalStudents : 0;

    const topPerformers = studentPerformances
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 3)
        .map(p => ({ name: p.student.name, percentage: p.percentage.toFixed(2) }));

    return { totalStudents, schoolAverage: schoolAverage.toFixed(2), topPerformers };
};