import React from 'react';
import { Student } from '../../../types';
import { SchoolIcon } from '../../icons/Icons';

interface EventCertificateProps {
    student: Student;
    eventName: string;
    achievement: string;
}

const EventCertificate: React.FC<EventCertificateProps> = ({ student, eventName, achievement }) => {
    const today = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

    const dancingScriptStyle = { fontFamily: "'Dancing Script', cursive" };
    const merriweatherStyle = { fontFamily: "'Merriweather', serif" };


    return (
        <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-100 border-4 border-blue-700 relative max-w-3xl mx-auto" style={merriweatherStyle}>
            <div className="p-6 border-2 border-blue-500 text-center text-gray-800">

                {/* Decorative corners */}
                <div className="absolute top-2 left-2 w-10 h-10 border-t-4 border-l-4 border-blue-700"></div>
                <div className="absolute top-2 right-2 w-10 h-10 border-t-4 border-r-4 border-blue-700"></div>
                <div className="absolute bottom-2 left-2 w-10 h-10 border-b-4 border-l-4 border-blue-700"></div>
                <div className="absolute bottom-2 right-2 w-10 h-10 border-b-4 border-r-4 border-blue-700"></div>
                
                <div className="flex justify-center items-center mb-4">
                     <div className="text-blue-700"><SchoolIcon /></div>
                     <span className="text-xl font-bold ml-2 text-blue-800">School Name</span>
                </div>

                <h1 className="text-5xl font-bold text-blue-900 mb-4" style={dancingScriptStyle}>Certificate of Achievement</h1>
                
                <p className="text-lg italic mb-6">This certificate is proudly presented to</p>

                <h2 className="text-4xl font-extrabold text-indigo-700 tracking-wider mb-6 border-b-2 border-indigo-200 pb-2 inline-block" style={dancingScriptStyle}>{student.name}</h2>
                
                <p className="text-xl mb-2">for outstanding performance and securing the</p>
                <p className="text-2xl font-semibold text-blue-800 mb-6">{achievement}</p>
                
                <p className="text-xl mb-8">in the <span className="font-bold">{eventName}</span> event held in {today}.</p>


                <div className="flex justify-around items-end mt-16">
                    <div className="text-center">
                        <p className="pt-2 border-t-2 border-gray-400 w-48">Event Coordinator</p>
                    </div>
                    <div className="text-center">
                        <p className="pt-2 border-t-2 border-gray-400 w-48">Principal</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EventCertificate;
