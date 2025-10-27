import { UserRole } from './types';
import type { FC } from 'react';
import { HomeIcon, UsersIcon, BookOpenIcon, CalendarIcon, ClipboardListIcon, PresentationChartLineIcon, BuildingLibraryIcon, BellIcon, UserCircleIcon, CreditCardIcon, CalendarPlusIcon, DocumentTextIcon, IdIcon, ArrowUpCircleIcon, MessagesIcon, ChartBarIcon } from './components/icons/Icons';

export const ROLES = [UserRole.PRINCIPAL, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT];

export const NAVIGATION_LINKS: Record<UserRole, { name: string; icon: FC }[]> = {
  [UserRole.PRINCIPAL]: [
    { name: 'Dashboard', icon: HomeIcon },
    { name: 'Students', icon: UsersIcon },
    { name: 'Teachers', icon: UsersIcon },
    { name: 'Classes', icon: BuildingLibraryIcon },
    { name: 'Subjects', icon: BookOpenIcon },
    { name: 'Timetable', icon: CalendarIcon },
    { name: 'Announcements', icon: BellIcon },
    { name: 'Certificates', icon: DocumentTextIcon },
    { name: 'Performance', icon: ChartBarIcon },
  ],
  [UserRole.TEACHER]: [
    { name: 'Dashboard', icon: HomeIcon },
    { name: 'My Students', icon: UsersIcon },
    { name: 'Attendance', icon: ClipboardListIcon },
    { name: 'Marks', icon: PresentationChartLineIcon },
    { name: 'Leave Requests', icon: CalendarPlusIcon },
    { name: 'My Timetable', icon: CalendarIcon },
    { name: 'Messages', icon: MessagesIcon },
    { name: 'Performance', icon: ChartBarIcon },
  ],
  [UserRole.STUDENT]: [
    { name: 'Dashboard', icon: HomeIcon },
    { name: 'My Profile', icon: UserCircleIcon },
    { name: 'My Marks', icon: PresentationChartLineIcon },
    { name: 'My Attendance', icon: ClipboardListIcon },
    { name: 'My Timetable', icon: CalendarIcon },
    { name: 'Fee Management', icon: CreditCardIcon },
    { name: 'Leave Requests', icon: CalendarPlusIcon },
    { name: 'Messages', icon: MessagesIcon },
    { name: 'My ID Card', icon: IdIcon },
    { name: 'Promotion History', icon: ArrowUpCircleIcon },
    { name: 'Announcements', icon: BellIcon },
  ],
  [UserRole.PARENT]: [
    { name: 'Dashboard', icon: HomeIcon },
    { name: 'My Child\'s Profile', icon: UserCircleIcon },
    { name: 'Marks', icon: PresentationChartLineIcon },
    { name: 'Attendance', icon: ClipboardListIcon },
    { name: 'Timetable', icon: CalendarIcon },
    { name: 'Fees', icon: CreditCardIcon },
    { name: 'Leave Requests', icon: CalendarPlusIcon },
    { name: 'Announcements', icon: BellIcon },
    { name: 'Performance', icon: ChartBarIcon },
  ],
};