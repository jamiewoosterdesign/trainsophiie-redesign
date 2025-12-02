import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import WizardModal from '@/features/wizards/WizardModal';
import SettingsModal from '@/features/wizards/SettingsModal';

export default function MainLayout() {
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [wizardMode, setWizardMode] = useState('service');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const openWizard = (mode) => {
        setWizardMode(mode);
        setIsWizardOpen(true);
    };

    const openSettings = () => {
        setIsSettingsOpen(true);
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-white">
                <Outlet context={{ openWizard, openSettings }} />
            </main>

            {isWizardOpen && (
                <WizardModal
                    mode={wizardMode}
                    onSwitchMode={setWizardMode}
                    onClose={() => setIsWizardOpen(false)}
                />
            )}

            {isSettingsOpen && (
                <SettingsModal onClose={() => setIsSettingsOpen(false)} />
            )}
        </div>
    );
}
