import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ServicesView from '@/features/views/ServicesView';
import StaffView from '@/features/views/StaffView';
import ScenariosView from '@/features/views/ScenariosView';
import TransfersView from '@/features/views/TransfersView';
import KnowledgeBaseView from '@/features/views/KnowledgeBaseView';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Navigate to="/services" replace />} />
                    <Route path="services" element={<ServicesView />} />
                    <Route path="staff" element={<StaffView />} />
                    <Route path="scenarios" element={<ScenariosView />} />
                    <Route path="transfers" element={<TransfersView />} />
                    <Route path="knowledge" element={<KnowledgeBaseView />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
