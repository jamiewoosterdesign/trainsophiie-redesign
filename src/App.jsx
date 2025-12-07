import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ServicesView from '@/features/views/ServicesView';
import ProductsView from '@/features/views/ProductsView';
import StaffView from '@/features/views/StaffView';
import ScenariosView from '@/features/views/ScenariosView';
import TransfersView from '@/features/views/TransfersView';
import PoliciesView from '@/features/views/PoliciesView';
import KnowledgeBaseView from '@/features/views/KnowledgeBaseView';
import BusinessInfoView from '@/features/views/BusinessInfoView';
import TagsView from '@/features/views/TagsView';
import NotificationsView from '@/features/views/NotificationsView';

import FAQsView from '@/features/views/FAQsView';
import OverviewView from '@/features/views/OverviewView';
import VoicePersonalityView from '@/features/views/VoicePersonalityView';
import GreetingsView from '@/features/views/GreetingsView';
import BehavioursView from '@/features/views/BehavioursView';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Navigate to="/overview" replace />} />
                    <Route path="overview" element={<OverviewView />} />
                    <Route path="services" element={<ServicesView />} />
                    <Route path="products" element={<ProductsView />} />
                    <Route path="staff" element={<StaffView />} />
                    <Route path="scenarios" element={<ScenariosView />} />
                    <Route path="transfers" element={<TransfersView />} />
                    <Route path="policies" element={<PoliciesView />} />
                    <Route path="faqs" element={<FAQsView />} />
                    <Route path="knowledge" element={<KnowledgeBaseView />} />
                    <Route path="business-info" element={<BusinessInfoView />} />
                    <Route path="tags" element={<TagsView />} />
                    <Route path="notifications" element={<NotificationsView />} />
                    <Route path="voice" element={<VoicePersonalityView />} />
                    <Route path="greetings" element={<GreetingsView />} />
                    <Route path="behaviors" element={<BehavioursView />} />
                </Route>
            </Routes >
        </Router >
    );
}

export default App;
