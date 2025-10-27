import React from 'react';
import { BuildingLibraryIcon, UsersIcon, UserCircleIcon } from '../icons/Icons';

const FeatureItem: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <li className="flex items-start text-sm text-gray-600">
    <svg className="w-4 h-4 text-indigo-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
    <span>{children}</span>
  </li>
);

const RoleCard: React.FC<{icon: React.ReactNode; title: string; features: string[]}> = ({ icon, title, features }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center mb-4 text-indigo-600">
            {icon}
            <h3 className="ml-3 text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <ul className="space-y-3">
            {features.map((feature, index) => (
                <FeatureItem key={index}>{feature}</FeatureItem>
            ))}
        </ul>
    </div>
);


const FeaturesShowcase: React.FC = () => {
    const principalFeatures = [
        "View school-wide performance analytics.",
        "Manage student and teacher records seamlessly.",
        "Create and oversee class schedules and timetables.",
        "Broadcast important announcements to all users.",
        "Generate official student certificates with ease.",
    ];
    const teacherFeatures = [
        "Manage attendance and marks for assigned students.",
        "Track individual student performance dashboards.",
        "Approve or reject student leave requests.",
        "Access a personalized class timetable.",
        "Communicate securely with students via private messaging.",
    ];
    const studentFeatures = [
        "Access a personal dashboard with key academic stats.",
        "View detailed marks, attendance, and timetables.",
        "Submit and track the status of leave requests.",
        "Manage fee payments and view history.",
        "Receive important school-wide announcements.",
    ];
    const parentFeatures = [
        "Monitor your child's academic performance in detail.",
        "Stay updated on attendance and class schedules.",
        "Handle fee payments on behalf of your child.",
        "Submit leave requests for your child.",
        "Get timely announcements from the school.",
    ];

    return (
        <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">A Complete Ecosystem for Your School</h2>
                <p className="mt-3 max-w-2xl mx-auto text-md text-gray-500">
                    A seamless, role-based platform designed to connect administration, teachers, students, and parents for a collaborative educational experience.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <RoleCard icon={<BuildingLibraryIcon/>} title="For the Principal" features={principalFeatures} />
                <RoleCard icon={<UsersIcon/>} title="For Teachers" features={teacherFeatures} />
                <RoleCard icon={<UserCircleIcon/>} title="For Students" features={studentFeatures} />
                <RoleCard icon={<UserCircleIcon/>} title="For Parents" features={parentFeatures} />
            </div>
        </div>
    );
};

export default FeaturesShowcase;