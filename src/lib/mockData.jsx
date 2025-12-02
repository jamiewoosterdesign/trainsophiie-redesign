import React from 'react';
import { Wrench, Sparkles } from 'lucide-react';

export const MOCK_SERVICES = [
    { id: 1, name: "Emergency Plumbing", desc: "Handling burst pipes, leaks, and overflowing toilets.", icon: <Wrench />, time: "60 min", action: "Transfer", active: true },
    { id: 2, name: "Gas Fitting", desc: "Installation and maintenance of gas appliances.", icon: <Sparkles />, time: "90 min", action: "Book", active: true },
];

export const MOCK_STAFF = [
    { id: 1, name: "Jamie Tester", role: "Owner", desc: "Handles billing disputes, large quotes.", initials: "JT", color: "bg-indigo-100 text-indigo-600", status: "Available" },
    { id: 2, name: "Sarah Brown", role: "Reception", desc: "General inquiries, booking appointments.", initials: "SB", color: "bg-fuchsia-100 text-fuchsia-600", status: "Back 2pm" },
];

export const MOCK_SCENARIOS = [
    { id: 1, name: "Refund Request", trigger: "User asks for money back", action: "Transfer to Accounts" },
    { id: 2, name: "Job Application", trigger: "User wants to work here", action: "Direct to website" },
];

export const MOCK_DOCS = [
    { id: 1, name: "SOP_Manual_2024.pdf", size: "2.4MB", date: "2 days ago", type: "pdf" },
    { id: 2, name: "Pricing_Guide_Q3.docx", size: "1.1MB", date: "1 week ago", type: "doc" },
];

export const MOCK_WEB = [
    { id: 1, name: "Website FAQs", url: "company.com/faq", status: "Active" },
    { id: 2, name: "Contact Page", url: "company.com/contact", status: "Active" },
];
