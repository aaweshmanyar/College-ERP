import React from 'react';
import { Student, Class } from '../../../types';

interface BonafideCertificateProps {
    student: Student;
    studentClass?: Class;
}

const BonafideCertificate: React.FC<BonafideCertificateProps> = ({ student, studentClass }) => {
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    
    return (
        <div className="p-8 bg-white border-2 border-gray-800 font-serif max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold uppercase">School Name</h1>
                <p className="text-sm">123 Education Lane, Knowledge City, 12345</p>
                <h2 className="text-2xl font-semibold mt-6 underline">BONAFIDE CERTIFICATE</h2>
            </div>
            
            <div className="flex justify-between mb-6">
                 <p><span className="font-bold">Ref No:</span> SCH/BC/2024/{student.id}</p>
                 <p><span className="font-bold">Date:</span> {today}</p>
            </div>

            <div className="text-left space-y-6 text-base leading-relaxed">
                <p>This is to certify that <span className="font-bold">{student.name}</span>, son/daughter of <span className="font-bold">{student.guardianName}</span>, is a bonafide student of this institution.</p>
                
                <p>He/She is currently studying in <span className="font-bold">Class {studentClass ? `${studentClass.name}-${studentClass.section}` : 'N/A'}</span> for the academic year 2024-2025.</p>

                <p>As per the school records, his/her date of birth is <span className="font-bold">{student.dob}</span>.</p>

                <p>To the best of our knowledge, he/she bears a good moral character.</p>
                
                <p>This certificate is issued for general purposes upon the request of the student/parent.</p>
            </div>

            <div className="flex justify-end mt-24">
                <div className="text-center">
                    <p className="pt-8 border-t-2 border-dotted border-gray-600">Principal's Signature</p>
                </div>
            </div>
        </div>
    );
};

export default BonafideCertificate;