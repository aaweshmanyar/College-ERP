import React from 'react';
import { Student, Class } from '../../../types';

interface TransferCertificateProps {
    student: Student;
    studentClass?: Class;
}

const TransferCertificate: React.FC<TransferCertificateProps> = ({ student, studentClass }) => {
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    
    return (
        <div className="p-8 bg-white border-2 border-gray-800 font-serif max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold uppercase">School Name</h1>
                <p className="text-sm">123 Education Lane, Knowledge City, 12345</p>
                <h2 className="text-2xl font-semibold mt-6 underline">TRANSFER CERTIFICATE</h2>
            </div>
            
            <div className="text-left space-y-4 text-base">
                <p><span className="font-bold">TC No:</span> SCH/2024/{student.id}</p>
                <p><span className="font-bold">Admission No:</span> {student.id}</p>
                
                <p>This is to certify that <span className="font-bold underline">{student.name}</span>, son/daughter of <span className="font-bold underline">{student.guardianName}</span> was a bonafide student of this school.</p>

                <p>According to the school records, his/her details are as follows:</p>
                
                <table className="w-full border-collapse border border-gray-400 my-4">
                    <tbody>
                        <tr className="border border-gray-400"><td className="p-2 font-semibold">Date of Birth</td><td className="p-2">{student.dob}</td></tr>
                        <tr className="border border-gray-400"><td className="p-2 font-semibold">Last Class Attended</td><td className="p-2">{studentClass ? `${studentClass.name}-${studentClass.section}` : 'N/A'}</td></tr>
                        <tr className="border border-gray-400"><td className="p-2 font-semibold">Date of Admission</td><td className="p-2">{student.admissionDate}</td></tr>
                        <tr className="border border-gray-400"><td className="p-2 font-semibold">Date of Leaving</td><td className="p-2">{today}</td></tr>
                        <tr className="border border-gray-400"><td className="p-2 font-semibold">Reason for Leaving</td><td className="p-2">Parent's Request</td></tr>
                        <tr className="border border-gray-400"><td className="p-2 font-semibold">General Conduct</td><td className="p-2">Good</td></tr>
                    </tbody>
                </table>

                <p>We wish him/her all the best for his/her future endeavors.</p>
            </div>

            <div className="flex justify-between mt-20">
                <div>
                    <p className="font-bold">Date: {today}</p>
                </div>
                <div className="text-center">
                    <p className="pt-8 border-t-2 border-dotted border-gray-600">Principal's Signature</p>
                </div>
            </div>
        </div>
    );
};

export default TransferCertificate;
