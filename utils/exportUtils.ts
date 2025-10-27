import type { Subject, Class } from "../types";

// This function processes the raw student data into a flat structure for Excel
export const prepareStudentExportData = async (fullStudentData: any[], allSubjects: Subject[], allClases: Class[]): Promise<any[]> => {
    return fullStudentData.map(student => {
        const studentClass = allClases.find(c => c.id === student.classId);
        const presentCount = student.attendance.filter((a: any) => a.status === 'Present').length;
        const absentCount = student.attendance.filter((a: any) => a.status === 'Absent').length;
        const attendancePercentage = student.attendance.length > 0
            ? ((presentCount / student.attendance.length) * 100).toFixed(2) + '%'
            : 'N/A';

        const marksBySubject: { [key: string]: string } = {};
        allSubjects.forEach(subject => {
            const mark = student.marks.find((m: any) => m.subjectId === subject.id);
            marksBySubject[`Marks (${subject.name})`] = mark ? `${mark.marks}/${mark.total} (${mark.grade})` : 'N/A';
        });

        return {
            'ID': student.id,
            'Name': student.name,
            'Roll Number': student.rollNumber,
            'Class': studentClass ? `${studentClass.name}-${studentClass.section}` : 'N/A',
            'Date of Birth': student.dob,
            'Gender': student.gender,
            'Guardian Name': student.guardianName,
            'Guardian Contact': student.guardianContact,
            'Address': student.address,
            'Admission Date': student.admissionDate,
            'Attendance %': attendancePercentage,
            'Days Present': presentCount,
            'Days Absent': absentCount,
            ...marksBySubject
        };
    });
};

// This function takes the processed data and generates the Excel file
export const exportToExcel = (data: any[], fileName: string, xlsxLibrary: any) => {
    const worksheet = xlsxLibrary.utils.json_to_sheet(data);
    const workbook = xlsxLibrary.utils.book_new();
    xlsxLibrary.utils.book_append_sheet(workbook, worksheet, 'Students');

    // Auto-adjust column widths
    const max_width = data.reduce((w, r) => Math.max(w, ...Object.values(r).map((val: any) => val?.toString().length ?? 0)), 10);
    worksheet["!cols"] = Object.keys(data[0]).map(() => ({ wch: max_width }));

    xlsxLibrary.writeFile(workbook, `${fileName}.xlsx`);
};