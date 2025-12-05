import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ServicesView from '@/features/views/ServicesView';
import StaffView from '@/features/views/StaffView';
import ScenariosView from '@/features/views/ScenariosView';
import TransfersView from '@/features/views/TransfersView';
import PoliciesView from '@/features/views/PoliciesView';
import KnowledgeBaseView from '@/features/views/KnowledgeBaseView';
import BusinessInfoView from '@/features/views/BusinessInfoView';

import FAQsView from '@/features/views/FAQsView';
import OverviewView from '@/features/views/OverviewView';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Navigate to="/overview" replace />} />
                    <Route path="overview" element={<OverviewView />} />
                    <Route path="services" element={<ServicesView />} />
                    <Route path="staff" element={<StaffView />} />
                    <Route path="scenarios" element={<ScenariosView />} />
                    <Route path="transfers" element={<TransfersView />} />
                    <Route path="policies" element={<PoliciesView />} />
                    <Route path="faqs" element={<FAQsView />} />
                    <Route path="knowledge" element={<KnowledgeBaseView />} />
                    <Route path="business-info" element={<BusinessInfoView />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
