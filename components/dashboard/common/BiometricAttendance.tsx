import React, { useState, useEffect } from 'react';
import { FingerprintIcon } from '../../icons/Icons';

interface BiometricAttendanceProps {
    userName: string;
    role: string;
    isVerified?: boolean;
    onScan?: () => void;
    variant?: 'elaborate' | 'simple';
}

const BiometricAttendance: React.FC<BiometricAttendanceProps> = ({
    userName,
    role,
    isVerified = true,
    onScan,
    variant = 'elaborate'
}) => {
    const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'SUCCESS'>('IDLE');
    const [time, setTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleScan = () => {
        setStatus('SCANNING');
        setTimeout(() => {
            setStatus('SUCCESS');
            if (onScan) onScan();
            // Reset after some time to allow re-scanning if needed
            setTimeout(() => setStatus('IDLE'), 5000);
        }, 2000);
    };

    if (variant === 'simple') {
        return (
            <div className="bg-slate-800 text-white p-4 rounded-xl shadow-lg border border-slate-600 max-w-xs mx-auto text-center">
                <div className="flex items-center justify-between mb-3 px-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">Bio-Scanner v1.0</span>
                    <span className="text-[10px] font-mono text-emerald-400">{time}</span>
                </div>

                <div
                    onClick={status === 'IDLE' ? handleScan : undefined}
                    className={`
                        w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center cursor-pointer transition-all duration-300
                        ${status === 'SCANNING' ? 'border-blue-400 bg-blue-900/40 animate-pulse shadow-[0_0_15px_rgba(96,165,250,0.5)]' :
                            status === 'SUCCESS' ? 'border-emerald-500 bg-emerald-900/40 shadow-[0_0_15px_rgba(16,185,129,0.5)]' :
                                'border-slate-600 bg-slate-700 hover:border-slate-400'}
                    `}
                >
                    <div className={`transition-colors duration-300 ${status === 'SCANNING' ? 'text-blue-300' :
                            status === 'SUCCESS' ? 'text-emerald-400' :
                                'text-slate-400'
                        }`}>
                        <FingerprintIcon />
                    </div>
                </div>

                <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-widest">
                        {status === 'IDLE' && "Tap to Attend"}
                        {status === 'SCANNING' && "Verifying..."}
                        {status === 'SUCCESS' && "Recorded (Biometric)"}
                    </p>
                    <p className="text-[9px] text-slate-400 mt-1 font-mono uppercase italic">
                        {userName} - {role}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-2xl border-4 border-slate-700 max-w-sm mx-auto overflow-hidden relative">
            {/* Terminal Header */}
            <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-mono text-slate-400">BIOMETRIC TERMINAL v2.4</span>
                </div>
                <span className="text-xs font-mono text-emerald-400">{time}</span>
            </div>

            {/* User Info */}
            <div className="mb-6 text-center">
                <h3 className="text-lg font-bold tracking-wider uppercase">{userName}</h3>
                <p className="text-xs text-slate-400 font-mono tracking-widest">{role}</p>
            </div>

            {/* Scanner Area */}
            <div className="relative group cursor-pointer" onClick={status === 'IDLE' ? handleScan : undefined}>
                <div className={`
                    w-48 h-56 mx-auto rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-500
                    ${status === 'SCANNING' ? 'border-cyan-500 bg-cyan-900/20 shadow-[0_0_20px_rgba(6,182,212,0.5)]' :
                        status === 'SUCCESS' ? 'border-emerald-500 bg-emerald-900/20 shadow-[0_0_20px_rgba(16,185,129,0.5)]' :
                            'border-slate-700 bg-slate-800/50 hover:border-slate-500'}
                `}>

                    {/* Glowing Fingerprint Icon */}
                    <div className={`p-4 rounded-full transition-all duration-500 ${status === 'SCANNING' ? 'text-cyan-400 scale-110 animate-pulse' :
                            status === 'SUCCESS' ? 'text-emerald-400 scale-100' :
                                'text-slate-500 group-hover:text-slate-300'
                        }`}>
                        <FingerprintIcon />
                    </div>

                    {/* Scanning Line */}
                    {status === 'SCANNING' && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-scan-line"></div>
                    )}

                    {/* Status Text */}
                    <div className="mt-4 text-center">
                        <span className={`text-xs font-mono font-bold tracking-widest ${status === 'SCANNING' ? 'text-cyan-400' :
                                status === 'SUCCESS' ? 'text-emerald-400' :
                                    'text-slate-500'
                            }`}>
                            {status === 'IDLE' && "PLACE FINGERPRINT"}
                            {status === 'SCANNING' && "SCANNING DATA..."}
                            {status === 'SUCCESS' && "VERIFICATION SUCCESS"}
                        </span>
                    </div>
                </div>

                {/* Verification Checkmark */}
                {status === 'SUCCESS' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500/20 p-4 rounded-full animate-ping pointer-events-none">
                        <div className="w-12 h-12 border-4 border-emerald-500 rounded-full flex items-center justify-center">
                            <span className="text-emerald-500 text-2xl font-bold">✓</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Details Table */}
            <div className="mt-6 grid grid-cols-2 gap-2 text-[10px] font-mono p-3 bg-black/40 rounded-lg">
                <div className="text-slate-500 uppercase">Status</div>
                <div className={isVerified ? 'text-emerald-500' : 'text-amber-500'}>
                    {isVerified ? '● REGISTERED' : '○ PENDING'}
                </div>
                <div className="text-slate-500 uppercase">Device ID</div>
                <div className="text-white">BIO-SYS-091</div>
                <div className="text-slate-500 uppercase">Location</div>
                <div className="text-white">MAIN GATE B1</div>
            </div>

            {/* Status Footer */}
            <div className="mt-4 flex items-center justify-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                <span className="text-[10px] text-slate-500 font-mono tracking-tighter">SECURE BIOMETRIC IDENTIFICATION SYSTEM</span>
            </div>

            <style>{`
                @keyframes scan-line {
                    0% { top: 10%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 90%; opacity: 0; }
                }
                .animate-scan-line {
                    animation: scan-line 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default BiometricAttendance;
