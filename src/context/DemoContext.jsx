import React, { createContext, useContext, useState, useMemo } from 'react';

const DemoContext = createContext();

export const useDemo = () => {
    const context = useContext(DemoContext);
    if (!context) {
        throw new Error('useDemo must be used within a DemoProvider');
    }
    return context;
};

// Full Data (Existing Vision Electrical)
const FULL_DATA = {
    id: 'vision-electrical',
    label: 'Vision Electrical',
    isComplete: true, // For overall checks

    businessInfo: {
        companyName: 'Vision Electrical',
        publicEmail: 'info@visionelectrical.com.au',
        businessPhone: '434 998 497',
        phoneCountry: 'au',
        website: 'https://visionelectrical.com.au/',
        country: 'au',
        currency: 'aud',
        logo: '/branding/vision-logo.png', // Simulated
        instagram: 'visionelectrical',
        twitter: 'visionelec',
        facebook: 'visionelectrical',
        linkedin: 'vision-electrical-services',
        description: 'Vision Electrical is a premier electrical service provider located on the Gold Coast, offering a wide range of residential and commercial electrical solutions.',
        locationType: 'fixed',
        businessAddress: '17-19 Ereton Dr, Arundel QLD 4214, Australia',
        landmark: 'Near Harbour Town',
        baseLocation: '',
        travelRadius: '',
        serviceAreas: 'Gold Coast\nTweed Heads\nBrisbane City\nSurfers Paradise\nBroadbeach\nBroadbeach Waters\nMermaid Beach',
        exceptions: '',
        mainCategory: 'electricians',
        serviceTypes: ['Domestic', 'Commercial'],
        yearFounded: '2010',
        experience: 15,
        schedules: [
            { id: 1, days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], start: '09:00', end: '17:00' }
        ],
        timezone: 'brisbane'
    },

    setupProgress: [
        { id: 'business-info', title: 'Business Info', subtitle: 'Basic info, Location, Trading Hours', route: '/business-info', isComplete: true, tags: ['Required'] },
        { id: 'services', title: 'Services', subtitle: 'Service Name, Duration, Price', route: '/services', isComplete: true, tags: ['Required'] },
        { id: 'faqs', title: 'FAQs', subtitle: 'Common customer questions', route: '/faqs', isComplete: true, tags: ['Recommended'] },
        { id: 'products', title: 'Products', subtitle: 'Product catalog', route: '/products', isComplete: true, tags: ['Optional'] },
        { id: 'documents', title: 'Documents', subtitle: 'Upload PDFs & Files', route: '/knowledge', isComplete: true, tags: ['Optional'] },
        { id: 'policies', title: 'Policies', subtitle: 'Rules & Procedures', route: '/policies', isComplete: true, tags: ['Optional'] },
        { id: 'scenarios', title: 'Scenarios', subtitle: 'Edge cases', route: '/scenarios', isComplete: false, tags: ['Advanced'] },
        { id: 'staff', title: 'Staff & Departments', subtitle: 'Team members & groups', route: '/staff', isComplete: true, tags: ['Recommended'] },
        { id: 'transfers', title: 'Transfers', subtitle: 'Call handoff logic', route: '/transfers', isComplete: true, tags: ['Recommended'] },
        { id: 'notifications', title: 'Notifications', subtitle: 'Alert settings', route: '/notifications', isComplete: true, tags: ['Advanced'] },
        { id: 'tags', title: 'Tags', subtitle: 'Conversation labeling', route: '/tags', isComplete: true, tags: ['Advanced'] },
        { id: 'greetings', title: 'Greetings & Closings', subtitle: 'Custom conversation scripts', route: '/greetings', isComplete: true, tags: ['Recommended'] },
        { id: 'voice', title: 'Voice & Personality', subtitle: 'Tone, Attitude, Voice selection', route: '/voice', isComplete: false, tags: ['Advanced'] },
        { id: 'behaviors', title: 'Behaviors', subtitle: 'Interruption & Speed', route: '/behaviors', isComplete: false, tags: ['Advanced'] }
    ]
};

// Blank State (New User Simulation)
const BLANK_DATA = {
    id: 'blank-state',
    label: 'Blank Slate',
    isComplete: false,

    businessInfo: {
        companyName: 'Vision Electrical', // Pulled from website
        publicEmail: 'info@visionelectrical.com.au', // Pulled from website
        businessPhone: '0434 998 497', // Pulled from website
        phoneCountry: 'au',
        website: 'https://visionelectrical.com.au/', // Known
        country: 'au',
        currency: 'aud',
        logo: null,
        instagram: '',
        twitter: '',
        facebook: '',
        linkedin: '',
        description: '',
        locationType: 'fixed',
        businessAddress: '',
        landmark: '',
        baseLocation: '',
        travelRadius: '',
        serviceAreas: '',
        exceptions: '',
        mainCategory: 'electricians',
        serviceTypes: [],
        yearFounded: '2024',
        experience: 0,
        schedules: [], // No hours
        timezone: 'brisbane'
    },

    setupProgress: [
        { id: 'business-info', title: 'Business Info', subtitle: 'Basic info, Location, Trading Hours', route: '/business-info', isComplete: false, tags: ['Required'] },
        { id: 'services', title: 'Services', subtitle: 'Service Name, Duration, Price', route: '/services', isComplete: false, tags: ['Required'] },
        { id: 'faqs', title: 'FAQs', subtitle: 'Common customer questions', route: '/faqs', isComplete: false, tags: ['Recommended'] },
        { id: 'products', title: 'Products', subtitle: 'Product catalog', route: '/products', isComplete: false, tags: ['Optional'] },
        { id: 'documents', title: 'Documents', subtitle: 'Upload PDFs & Files', route: '/knowledge', isComplete: false, tags: ['Optional'] },
        { id: 'policies', title: 'Policies', subtitle: 'Rules & Procedures', route: '/policies', isComplete: false, tags: ['Optional'] },
        { id: 'scenarios', title: 'Scenarios', subtitle: 'Edge cases', route: '/scenarios', isComplete: false, tags: ['Advanced'] },
        { id: 'staff', title: 'Staff & Departments', subtitle: 'Team members & groups', route: '/staff', isComplete: false, tags: ['Recommended'] },
        { id: 'transfers', title: 'Transfers', subtitle: 'Call handoff logic', route: '/transfers', isComplete: false, tags: ['Recommended'] },
        { id: 'notifications', title: 'Notifications', subtitle: 'Alert settings', route: '/notifications', isComplete: false, tags: ['Advanced'] },
        { id: 'tags', title: 'Tags', subtitle: 'Conversation labeling', route: '/tags', isComplete: false, tags: ['Advanced'] },
        { id: 'greetings', title: 'Greetings & Closings', subtitle: 'Custom conversation scripts', route: '/greetings', isComplete: false, tags: ['Recommended'] },
        { id: 'voice', title: 'Voice & Personality', subtitle: 'Tone, Attitude, Voice selection', route: '/voice', isComplete: false, tags: ['Advanced'] },
        { id: 'behaviors', title: 'Behaviors', subtitle: 'Interruption & Speed', route: '/behaviors', isComplete: false, tags: ['Advanced'] }
    ]
};

export function DemoProvider({ children }) {
    const [currentProfileId, setCurrentProfileId] = useState('vision-electrical');

    const currentProfile = useMemo(() => {
        return currentProfileId === 'vision-electrical' ? FULL_DATA : BLANK_DATA;
    }, [currentProfileId]);

    const isBlankState = currentProfileId === 'blank-state';

    const switchProfile = (id) => {
        setCurrentProfileId(id);
    };

    return (
        <DemoContext.Provider value={{
            currentProfile,
            currentProfileId,
            isBlankState,
            switchProfile,
            // Helper to get setup progress
            setupProgress: currentProfile.setupProgress
        }}>
            {children}
        </DemoContext.Provider>
    );
}
