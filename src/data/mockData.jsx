
import React from 'react';
import {
    Zap, Hammer, CheckCircle2, Plug2, Bot, Briefcase, Heart
} from 'lucide-react';

// Avatars imports
// Note: These paths must be correct relative to this file or absolute aliases
// Since we are using @ alias for src, it should work fine.
import sophiieAvatar from '@/avatars/sophiie-avatar.png';
import steveAvatar from '@/avatars/Steve-avatar.png';
import lucyAvatar from '@/avatars/lucy-avatar.png';
import charlieAvatar from '@/avatars/Charlie-avatar.png';
import emmaAvatar from '@/avatars/Emma-avatar.png';
import arthurAvatar from '@/avatars/arthur-avatar.png';
import arohaAvatar from '@/avatars/Aroha-avatar.png';
import nikauAvatar from '@/avatars/nikau-avatar.png';

// ------------------------------------------------------------------
// Services (ServicesView.jsx)
// ------------------------------------------------------------------
export const MOCK_ELECTRICIAN_SERVICES = [
    { id: 'elec-1', name: 'Switchboard Upgrade', desc: 'Upgrade old fuse box to modern circuit breaker panel with RCD protection.', time: '4 hrs', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-2', name: 'Powerpoint Installation', desc: 'Install new double power points in standard plasterboard walls.', time: '45 mins', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-3', name: 'LED Downlight Install', desc: 'Supply and install energy-efficient LED downlights throughout property.', time: '2 hrs', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-4', name: 'Ceiling Fan Installation', desc: 'Installation of ceiling fans with wall control or remote.', time: '90 mins', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-5', name: 'Safety Inspection', desc: 'Comprehensive electrical safety check and report for residential properties.', time: '60 mins', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-6', name: 'Smoke Alarm Testing', desc: 'Test, battery replacement, and verification of smoke alarm compliance.', time: '30 mins', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-7', name: 'EV Charger Install', desc: 'Installation of Level 2 Electric Vehicle home charging station.', time: '3 hrs', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-8', name: 'Emergency Fault Finding', desc: 'Urgent callout to diagnose and rectify power outages or electrical faults.', time: '60 mins', action: 'Transfer', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-9', name: 'Oven/Cooktop Connection', desc: 'Hardwiring of new electric ovens, cooktops, or stoves.', time: '60 mins', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-10', name: 'Data Cabling', desc: 'Cat6 data point installation for home networking and internet.', time: '60 mins', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-11', name: 'TV Wall Mounting', desc: 'Secure mounting of TV with concealed cabling and power point.', time: '90 mins', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-12', name: 'Garden Lighting', desc: 'Design and installation of outdoor low-voltage garden lighting systems.', time: '4 hrs', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-13', name: 'Security Camera Install', desc: 'Installation of wired security camera systems and DVR setup.', time: '5 hrs', action: 'Transfer', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-14', name: 'Consumer Mains Upgrade', desc: 'Upgrade of incoming power supply cables to meet new demand.', time: 'Day', action: 'Transfer', active: false, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-15', name: 'Sensor Light Install', desc: 'security sensor lights for driveways and entryways.', time: '45 mins', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-16', name: 'Bathroom Heater/Fan', desc: 'Install 3-in-1 bathroom heater, light, and exhaust fan units.', time: '2 hrs', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-17', name: 'Hot Water System Repair', desc: 'Element and thermostat replacement for electric hot water systems.', time: '60 mins', action: 'Transfer', active: false, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-18', name: 'House Rewire', desc: 'Complete removal of old wiring and installation of new safe cabling.', time: '3 Days', action: 'Transfer', active: false, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-19', name: 'Surge Protection', desc: 'Installation of whole-house surge protection at the switchboard.', time: '45 mins', action: 'Book', active: false, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-20', name: 'Test and Tag', desc: 'Electrical appliance testing and tagging for workplace compliance.', time: 'Varies', action: 'Book', active: false, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 }
];

export const MOCK_BUILDER_SERVICES = [
    { id: 'build-1', name: 'Deck Installation', desc: 'Construction of timber or composite outdoor decking areas.', time: '3 Days', action: 'Transfer', active: true, icon: <Hammer className="w-5 h-5 text-slate-500" />, createdAt: 1 },
    { id: 'build-2', name: 'Bathroom Renovation', desc: 'Full bathroom strip out and remodel including waterproofing and tiling.', time: '2 Weeks', action: 'Transfer', active: true, icon: <Hammer className="w-5 h-5 text-slate-500" />, createdAt: 1 },
    { id: 'build-3', name: 'Kitchen Remodel', desc: 'Kitchen cabinetry installation, benchtop fitting, and splashbacks.', time: '1 Week', action: 'Transfer', active: true, icon: <Hammer className="w-5 h-5 text-slate-500" />, createdAt: 1 },
    { id: 'build-4', name: 'Pergola Construction', desc: 'Custom designed pergolas and patios for outdoor entertaining.', time: '4 Days', action: 'Transfer', active: true, icon: <Hammer className="w-5 h-5 text-slate-500" />, createdAt: 1 },
    { id: 'build-5', name: 'Structural Wall Removal', desc: 'Removal of load-bearing walls and installation of support beams.', time: '5 Days', action: 'Transfer', active: false, icon: <Hammer className="w-5 h-5 text-slate-500" />, createdAt: 1 }
];

// ------------------------------------------------------------------
// Products (ProductsView.jsx)
// ------------------------------------------------------------------
export const MOCK_ELECTRICIAN_PRODUCTS = [
    { id: 'prod-1', name: 'Clipsal Iconic Switch', desc: 'Modern styled light switch with swappable skins.', price: '$25.00', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, category: 'Lighting', createdAt: 1 },
    { id: 'prod-2', name: 'Tesla Wall Connector', desc: 'Gen 3 High powered EV charger for home use.', price: '$750.00', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, category: 'EV Charging', createdAt: 2 },
    { id: 'prod-3', name: 'LED Batten Light', desc: '1200mm Weatherproof LED batten for garage or outdoor.', price: '$65.00', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, category: 'Lighting', createdAt: 3 },
    { id: 'prod-4', name: 'Smoke Alarm Li-Ion', desc: '10-year tamper proof lithium battery smoke alarm.', price: '$45.00', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, category: 'Safety', createdAt: 4 },
    { id: 'prod-5', name: 'Video Doorbell Pro', desc: 'Smart WiFi doorbell with 1080p camera and 2-way audio.', price: '$299.00', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, category: 'Security', createdAt: 5 },
    { id: 'prod-6', name: 'Smart Dimmer Switch', desc: 'WiFi connected dimmer switch comptible with Alexa/Google.', price: '$85.00', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, category: 'Smart Home', createdAt: 6 },
    { id: 'prod-7', name: 'Ceiling Fan 52"', desc: 'White 4-blade indoor ceiling fan with wall controller.', price: '$180.00', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, category: 'Heating/Cooling', createdAt: 7 },
    { id: 'prod-8', name: 'Outdoor Floodlight', desc: '20W LED Motion sensor security floodlight.', price: '$55.00', active: false, icon: <Zap className="w-5 h-5 text-amber-500" />, category: 'Security', createdAt: 8 },
    { id: 'prod-9', name: 'Bathroom Heat/Light', desc: '3-in-1 Bathroom heater, exhaust fan and LED light unit.', price: '$145.00', active: false, icon: <Zap className="w-5 h-5 text-amber-500" />, category: 'Heating/Cooling', createdAt: 9 },
    { id: 'prod-10', name: 'Safety Switch (RCD)', desc: '2 Pole 40A RCD Safety Switch for switchboard protection.', price: '$60.00', active: false, icon: <Zap className="w-5 h-5 text-amber-500" />, category: 'Safety', createdAt: 10 },
];

export const MOCK_BUILDER_PRODUCTS = [
    { id: 'build-prod-1', name: 'Basin Mixer Tap', desc: 'Chrome finish modern basin mixer with 5 year warranty.', price: '$120.00', active: true, icon: <Hammer className="w-5 h-5 text-slate-500" />, category: 'Plumbing', createdAt: 1 },
    { id: 'build-prod-2', name: 'Hardwood Decking (per m)', desc: 'Merbau hardwood decking boards 90x19mm.', price: '$12.50', active: true, icon: <Hammer className="w-5 h-5 text-slate-500" />, category: 'Materials', createdAt: 2 },
    { id: 'build-prod-3', name: 'Frameless Shower Screen', desc: '10mm toughened glass frameless shower screen 900x900.', price: '$450.00', active: true, icon: <Hammer className="w-5 h-5 text-slate-500" />, category: 'Bathroom', createdAt: 3 },
    { id: 'build-prod-4', name: 'Internal Door', desc: 'Hollow core smooth skin internal door 2040x820.', price: '$45.00', active: true, icon: <Hammer className="w-5 h-5 text-slate-500" />, category: 'Materials', createdAt: 4 },
    { id: 'build-prod-5', name: 'Door Handle Set', desc: 'Brushed nickel passage lever set with latch.', price: '$35.00', active: false, icon: <Hammer className="w-5 h-5 text-slate-500" />, category: 'Hardware', createdAt: 5 },
];

// ------------------------------------------------------------------
// Staff & Departments (StaffView.jsx)
// ------------------------------------------------------------------
export const MOCK_STAFF = [
    { id: 1, name: "Sarah Jenkins", role: "Sales", status: "Available", initials: "SJ", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Handles new customer inquiries and pricing.", ext: "101", email: "sarah.j@vision.com", phone: "+61 400 111 222", department: "Sales", active: true, createdAt: 1700000000000 },
    { id: 2, name: "Mike Ross", role: "Support", status: "Busy", initials: "MR", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Technical support for existing clients.", ext: "102", email: "mike.r@vision.com", phone: "+61 400 222 333", department: "Support", active: true, createdAt: 1700000000001 },
    { id: 3, name: "Jessica Pearson", role: "Manager", status: "Available", initials: "JP", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Operations manager and escalations.", ext: "103", email: "jessica.p@vision.com", phone: "+61 400 333 444", department: "Management", active: true, createdAt: 1700000000002 },
    { id: 4, name: "Louis Litt", role: "Legal", status: "Away", initials: "LL", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Legal counsel and contract review.", ext: "104", email: "louis.l@vision.com", phone: "+61 400 444 555", department: "Legal", active: true },
    { id: 5, name: "Donna Paulsen", role: "Admin", status: "Available", initials: "DP", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Executive assistant and office management.", ext: "105", email: "donna.p@vision.com", phone: "+61 400 555 666", department: "Admin", active: true },
    { id: 6, name: "Harvey Specter", role: "Sales", status: "In Meeting", initials: "HS", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Senior closer and strategic accounts.", ext: "106", email: "harvey.s@vision.com", phone: "+61 400 666 777", department: "Sales", active: true },
    { id: 7, name: "Rachel Zane", role: "Support", status: "Available", initials: "RZ", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Paralegal and research support.", ext: "107", email: "rachel.z@vision.com", phone: "+61 400 777 888", department: "Support", active: true },
    { id: 8, name: "Alex Williams", role: "Technician", status: "Offline", initials: "AW", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Field technician for on-site repairs.", ext: "108", email: "alex.w@vision.com", phone: "+61 400 888 999", department: "Field Tech", active: false },
    { id: 9, name: "Katrina Bennett", role: "Legal", status: "Busy", initials: "KB", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Associate attorney handling overflow.", ext: "109", email: "katrina.b@vision.com", phone: "+61 400 999 000", department: "Legal", active: true },
    { id: 10, name: "Robert Zane", role: "Manager", status: "Available", initials: "RZ", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Managing partner.", ext: "110", email: "robert.z@vision.com", phone: "+61 400 000 111", department: "Management", active: true },
    { id: 11, name: "Samantha Wheeler", role: "Sales", status: "Away", initials: "SW", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Aggressive sales tactics specialist.", ext: "111", email: "samantha.w@vision.com", phone: "+61 400 111 333", department: "Sales", active: true },
    { id: 12, name: "Daniel Hardman", role: "Manager", status: "Offline", initials: "DH", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Former managing partner.", ext: "112", email: "daniel.h@vision.com", phone: "+61 400 222 444", department: "Management", active: false },
    { id: 13, name: "Sheila Sazs", role: "Admin", status: "Available", initials: "SS", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Head of admissions and recruiting.", ext: "113", email: "sheila.s@vision.com", phone: "+61 400 333 555", department: "Admin", active: true },
    { id: 14, name: "Harold Gunderson", role: "Support", status: "Busy", initials: "HG", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Junior associate, prone to errors.", ext: "114", email: "harold.g@vision.com", phone: "+61 400 444 666", department: "Support", active: true },
    { id: 15, name: "Jenny Griffith", role: "Support", status: "Available", initials: "JG", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Consultant and paralegal.", ext: "115", email: "jenny.g@vision.com", phone: "+61 400 555 777", department: "Support", active: true },
];

export const MOCK_DEPARTMENTS = [
    { id: 'dept-1', name: 'Accounts', status: 'Active', members: 3, openStatus: 'Closed', routing: 'Call forwarding configured', color: 'bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400', head: 'Louis Litt', email: 'accounts@vision.com', phone: '1300 000 111', active: true },
    { id: 'dept-2', name: 'Support', status: 'Active', members: 5, openStatus: 'Open 24/7', routing: 'Round Robin', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400', head: 'Mike Ross', email: 'support@vision.com', phone: '1300 000 222', active: true },
    { id: 'dept-3', name: 'Sales', status: 'Active', members: 4, openStatus: '9:00 AM - 5:00 PM', routing: 'Simultaneous Ring', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400', head: 'Harvey Specter', email: 'sales@vision.com', phone: '1300 000 333', active: true },
    { id: 'dept-4', name: 'Field Tech', status: 'Active', members: 1, openStatus: '7:00 AM - 4:00 PM', routing: 'Round Robin', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400', head: 'Robert Zane', email: 'field@vision.com', phone: '1300 000 444', active: true },
    { id: 'dept-5', name: 'Legal', status: 'Active', members: 2, openStatus: '9:00 AM - 6:00 PM', routing: 'Direct Connect', color: 'bg-slate-100 text-slate-600 dark:bg-slate-900/40 dark:text-slate-400', head: 'Jessica Pearson', email: 'legal@vision.com', phone: '1300 000 555', active: true },
];

// ------------------------------------------------------------------
// Knowledge Base (KnowledgeBaseView.jsx)
// ------------------------------------------------------------------
export const MOCK_KNOWLEDGE_BASE = [
    { id: 1, name: 'Company Policy.pdf', type: 'file', size: '2.4 MB', active: true, createdAt: 1700000000000 },
    { id: 2, name: 'Pricing Guide 2024.pdf', type: 'file', size: '1.1 MB', active: true, createdAt: 1700000000001 },
    { id: 3, name: 'https://visionelectrical.com/about', type: 'link', size: 'External', active: true, createdAt: 1700000000002 },
    { id: 4, name: 'Safety Procedures.docx', type: 'file', size: '500 KB', active: true, createdAt: 1700000000003 },
    { id: 5, name: 'Service Manual.pdf', type: 'file', size: '4.2 MB', active: true, createdAt: 1700000000004 },
    { id: 6, name: 'https://visionelectrical.com/faq', type: 'link', size: 'External', active: true, createdAt: 1700000000005 },
    { id: 7, name: 'Employee Handbook.pdf', type: 'file', size: '3.5 MB', active: true, createdAt: 1700000000006 },
    { id: 8, name: 'Product Catalog.pdf', type: 'file', size: '15 MB', active: true, createdAt: 1700000000007 },
    { id: 9, name: 'https://visionelectrical.com/contact', type: 'link', size: 'External', active: true, createdAt: 1700000000008 },
    { id: 10, name: 'Invoice Template.docx', type: 'file', size: '120 KB', active: true, createdAt: 1700000000009 },
    { id: 11, name: 'Terms and Conditions.pdf', type: 'file', size: '800 KB', active: true, createdAt: 1700000000010 },
    { id: 12, name: 'Logo Assets.zip', type: 'file', size: '5.6 MB', active: true, createdAt: 1700000000011 },
];

// ------------------------------------------------------------------
// Policies (PoliciesView.jsx)
// ------------------------------------------------------------------
export const MOCK_POLICIES = [
    { id: 1, title: 'Warranty', content: 'Our standard warranty covers manufacturing defects for 12 months from the date of purchase. This does not cover accidental damage or wear and tear.', createdAt: 1700000000000, active: true },
    { id: 2, title: 'Cancellation Policy', content: 'Cancellations must be made at least 24 hours in advance to avoid a cancellation fee of $50.', createdAt: 1700000000001, active: true },
    { id: 3, title: 'Privacy Policy', content: 'We are committed to protecting your privacy and will not share your personal information with third parties without your consent.', createdAt: 1700000000002, active: true },
    { id: 4, title: 'Return Policy', content: 'Items can be returned within 30 days of purchase for a full refund or exchange, provided they are in original condition.', active: true },
    { id: 5, title: 'Payment Terms', content: 'Payment is due upon completion of service. We accept cash, credit cards, and bank transfers. A 50% deposit is required for large projects.', active: true },
    { id: 6, title: 'Service Guarantee', content: 'We guarantee our workmanship for 30 days. If you are not satisfied with our service, we will re-do it at no extra cost.', active: true },
    { id: 7, title: 'Code of Conduct', content: 'Our staff are expected to treat all customers with respect and professionalism. Abusive behavior will not be tolerated.', active: true },
    { id: 8, title: 'Safety Procedures', content: 'All staff follow strict safety protocols to ensure a safe working environment for themselves and our clients.', active: true },
    { id: 9, title: 'Complaint Handling', content: 'We take all complaints seriously. Please contact our support team to report any issues, and we will investigate promptly.', active: true },
    { id: 10, title: 'Data Retention', content: 'We retain customer data for 7 years as required by law for tax and accounting purposes.', active: true },
    { id: 11, title: 'Travel Fees', content: 'A travel fee may apply for services outside our standard service area. This will be quoted prior to booking.', active: true },
    { id: 12, title: 'Emergency Service', content: 'Emergency services outside business hours incur a surcharge of $100 plus standard hourly rates.', active: true },
    { id: 13, title: 'Confidentiality', content: 'We maintain strict confidentiality regarding all client information and business dealings.', active: true },
    { id: 14, title: 'Feedback', content: 'We welcome feedback to improve our services. You can leave a review on our website or contact us directly.', active: true },
    { id: 15, title: 'Dispute Resolution', content: 'In the event of a dispute, we agree to first try to resolve it through mediation before pursuing legal action.', active: true },
];

// ------------------------------------------------------------------
// Scenarios (ScenariosView.jsx)
// ------------------------------------------------------------------
export const MOCK_SCENARIOS = [
    { id: 1, name: "Refund Request", trigger: "Customer asks for money back", action: "Check eligibility, process if < $50", type: "Refund", createdAt: 1700000000000, active: true },
    { id: 2, name: "Angry Customer", trigger: "Sentiment is negative/hostile", action: "Apologize, escalate to human manager", type: "Complaint", createdAt: 1700000000001, active: true },
    { id: 3, name: "Pricing Inquiry", trigger: "Customer asks for price list", action: "Email standard pricing PDF", type: "General", createdAt: 1700000000002, active: true },
    { id: 4, name: "Cancel Subscription", trigger: "Customer wants to cancel", action: "Offer discount, then process cancellation", type: "Booking", active: true },
    { id: 5, name: "Late Delivery", trigger: "Customer complains about delay", action: "Check status, refund shipping fee", type: "Complaint", active: true },
    { id: 6, name: "Change Address", trigger: "Customer wants to change address", action: "Update CRM, confirm via email", type: "Booking", active: true },
    { id: 7, name: "Warranty Claim", trigger: "Customer reports broken item", action: "Ask for photo, initiate return", type: "Refund", active: true },
    { id: 8, name: "Speak to Human", trigger: "Customer asks specifically for person", action: "Transfer to support line", type: "General", active: true },
    { id: 9, name: "Product Availability", trigger: "Customer asks if in stock", action: "Check inventory database", type: "General", active: true },
    { id: 10, name: "Payment Failed", trigger: "System detects payment error", action: "Ask for alternative payment method", type: "Booking", active: true },
    { id: 11, name: "Schedule Demo", trigger: "Customer wants to see product", action: "Book appointment in calendar", type: "Booking", active: true },
    { id: 12, name: "Forgot Password", trigger: "Customer cannot login", action: "Send password reset link", type: "General", active: true },
    { id: 13, name: "Upgrade Plan", trigger: "Customer wants more features", action: "Explain tiers, process upgrade", type: "Booking", active: true },
    { id: 14, name: "Data Deletion", trigger: "Customer invokes GDPR rights", action: "Log request, notify legal team", type: "Complaint", active: true },
    { id: 15, name: "Wrong Item Received", trigger: "Customer received incorrect product", action: "Ship correct item immediately", type: "Refund", active: true },
];

// ------------------------------------------------------------------
// Transfers (TransfersView.jsx)
// ------------------------------------------------------------------
export const MOCK_TRANSFER_RULES = [
    { id: 1, name: "Sales Dept", desc: "When someone wants to speak to sales or buy something.", type: "Warm", active: true, createdAt: 1700000000000 },
    { id: 2, name: "Support Team", desc: "Technical issues, bugs, or troubleshooting.", type: "Cold", active: true, createdAt: 1700000000001 },
    { id: 3, name: "Billing & Accounts", desc: "Invoices, refunds, and payment updates.", type: "Warm", active: true, createdAt: 1700000000002 },
    { id: 4, name: "Escalations", desc: "Angry customers or manager requests.", type: "Warm", active: true },
    { id: 5, name: "General Inquiries", desc: "Business hours, location, and general info.", type: "Cold", active: true },
    { id: 6, name: "Marketing", desc: "Press, partnerships, and advertising.", type: "Cold", active: false },
    { id: 7, name: "HR Department", desc: "Job applications and internal matters.", type: "Cold", active: true },
    { id: 8, name: "Emergency Line", desc: "Urgent matters outside business hours.", type: "Warm", active: true },
    { id: 9, name: "Voicemail", desc: "When no staff members are available.", type: "Cold", active: true },
    { id: 10, name: "New Client Onboarding", desc: "Scheduling initial consultations.", type: "Warm", active: true },
    { id: 11, name: "Returns", desc: "RMA requests and return status.", type: "Cold", active: true },
    { id: 12, name: "Legal", desc: "Compliance and legal notices.", type: "Warm", active: false },
    { id: 13, name: "VIP Support", desc: "Dedicated line for premium customers.", type: "Warm", active: true },
    { id: 14, name: "International", desc: "Routing for non-local calls.", type: "Cold", active: true },
    { id: 15, name: "Feedback", desc: "Customer satisfaction surveys.", type: "Cold", active: true },
];


// ------------------------------------------------------------------
// Integrations (IntegrationsView.jsx)
// ------------------------------------------------------------------
export const MOCK_INTEGRATIONS = [
    { id: 1, name: 'Google Calendar', description: 'Sync appointments and availability in real-time.', icon: <CheckCircle2 className="w-5 h-5 text-green-500" />, status: 'active', connected: true },
    { id: 2, name: 'Salesforce', description: 'Create leads and log calls automatically.', icon: <Plug2 className="w-5 h-5 text-blue-500" />, status: 'inactive', connected: false },
    { id: 3, name: 'Stripe', description: 'Process payments and handle medical deposits securely.', icon: <Plug2 className="w-5 h-5 text-purple-500" />, status: 'inactive', connected: false },
    { id: 4, name: 'Slack', description: 'Send team notifications for urgent escalations.', icon: <Plug2 className="w-5 h-5 text-orange-500" />, status: 'inactive', connected: false },
];

// ------------------------------------------------------------------
// Notifications (NotificationsView.jsx)
// ------------------------------------------------------------------
export const MOCK_ASSIGNMENTS = [
    { id: 1, member: 'Sarah Wilson', methods: ['sms', 'email'], tags: ['VIP', 'Urgent', 'Long Term', 'High Volume', 'Verified', 'Priority', 'Gold', 'Legacy', 'Local'], sources: ['call', 'sms'], enabled: true, createdAt: 1700000000000 },
    { id: 2, member: 'Mike Johnson', methods: ['email'], tags: ['All'], sources: ['webform'], enabled: true, createdAt: 1700000000001 },
    { id: 3, member: 'Emily Davis', methods: ['sms'], tags: ['Support', 'Billing', 'Returns', 'Complaints', 'Inquiries'], sources: ['chatbot', 'email'], enabled: false, createdAt: 1700000000002 },
    { id: 4, member: 'David Brown', methods: ['email', 'sms'], tags: ['Sales', 'High Value', 'Corporate', 'Enterprise', 'Partner', 'Strategic'], sources: ['webform', 'call'], enabled: true },
    { id: 5, member: 'Jessica Lee', methods: ['email'], tags: ['General'], sources: ['email'], enabled: true },
    { id: 6, member: 'Chris Martin', methods: ['sms'], tags: ['Technical', 'Admin', 'Root Access'], sources: ['chatbot'], enabled: true },
    { id: 7, member: 'Ashley Taylor', methods: ['email'], tags: ['Billing'], sources: ['email', 'call'], enabled: true },
    { id: 8, member: 'Matthew Anderson', methods: ['sms', 'email'], tags: ['Emergency', '24/7', 'On-Call', 'Supervisor'], sources: ['call'], enabled: true },
    { id: 9, member: 'Olivia Thomas', methods: ['email'], tags: ['Feedback'], sources: ['webform'], enabled: false },
    { id: 10, member: 'Daniel Martinez', methods: ['sms'], tags: ['Returns', 'RMA', 'Logistics'], sources: ['email', 'chatbot'], enabled: true },
    { id: 11, member: 'Sophia Hernandez', methods: ['email', 'sms'], tags: ['All'], sources: ['call'], enabled: true },
    { id: 12, member: 'James Wilson', methods: ['email'], tags: ['Support', 'Tier 1', 'Tier 2', 'Tier 3', 'Escalation', 'Manager'], sources: ['webform'], enabled: true },
    { id: 13, member: 'Isabella Clark', methods: ['sms'], tags: ['Sales'], sources: ['call'], enabled: false },
    { id: 14, member: 'Ethan Lewis', methods: ['email'], tags: ['General'], sources: ['email'], enabled: true },
    { id: 15, member: 'Ava Walker', methods: ['sms', 'email'], tags: ['Urgent'], sources: ['call', 'sms'], enabled: true },
];

// ------------------------------------------------------------------
// Tags (TagsView.jsx)
// ------------------------------------------------------------------
export const MOCK_CUSTOMER_TAGS = [
    { id: 1, name: 'VIP', color: 'bg-purple-500', colorHex: '#a855f7', description: 'Very Important Person', enabled: true, createdAt: 1700000000000 },
    { id: 2, name: 'New Customer', color: 'bg-green-500', colorHex: '#22c55e', description: 'First time customer', enabled: true, createdAt: 1700000000001 },
    { id: 3, name: 'Late Payer', color: 'bg-red-500', colorHex: '#ef4444', description: 'Historically pays late', enabled: true, createdAt: 1700000000002 },
];

export const MOCK_INQUIRY_TAGS = [
    { id: 1, name: 'standard-job', color: 'bg-purple-100', colorHex: '#f3e8ff', description: 'Wants to book or schedule a service', enabled: true, isPreset: true, createdAt: 1700000000000 },
    { id: 2, name: 'complaint', color: 'bg-red-100', colorHex: '#fee2e2', description: 'Expresses dissatisfaction', enabled: true, isPreset: true, createdAt: 1700000000001 },
    { id: 3, name: 'urgent', color: 'bg-slate-200', colorHex: '#e2e8f0', description: 'Explicitly mentions urgency', enabled: true, isPreset: true, createdAt: 1700000000002 },
    { id: 4, name: 'Quote Request', color: 'bg-blue-500', colorHex: '#3b82f6', description: 'Looking for pricing', enabled: true, createdAt: 1700000000003 },
    // Mocking more items for pagination (total 20)
    ...Array.from({ length: 16 }).map((_, i) => ({
        id: 5 + i,
        name: `Inquiry Tag ${i + 1}`,
        color: ['bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-red-100'][i % 4],
        colorHex: '#e0e7ff',
        description: `Mock description for inquiry tag ${i + 1} to test pagination functionality.`,
        enabled: true,
        isPreset: false
    }))
];

export const MOCK_AUTO_TAGS = [
    { id: 1, name: 'Solar Panel', color: 'bg-blue-300', colorHex: '#93c5fd', description: 'Solar panels to harness the suns light and transfer it in clean electricity', enabled: true, isAuto: true },
    { id: 2, name: 'Domestic Electrical', color: 'bg-yellow-100', colorHex: '#fef9c3', description: 'Residential electrical services including installations, upgrades and maintenance', enabled: true, isAuto: true },
    { id: 3, name: 'Commercial Electrical', color: 'bg-amber-800', colorHex: '#92400e', description: 'Fit outs, upgrades and maintenance', enabled: true, isAuto: true },
    { id: 4, name: 'Air Conditioning', color: 'bg-orange-500', colorHex: '#f97316', description: 'End-to-end design, supply and installation of air conditioning systems', enabled: true, isAuto: true },
];

// ------------------------------------------------------------------
// Voice Personality (VoicePersonalityView.jsx)
// ------------------------------------------------------------------
// Helper icons avoiding import errors in components if they don't exist in lucide-react directly
const BriefcaseIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
);
const HeartIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
);

export const VOICES = {
    australian: [
        { id: 'au-1', name: 'Sophiie', gender: 'Female', preview: '/audio/sophiie.mp3', tags: ['Friendly', 'Casual', 'Female'], avatar: sophiieAvatar },
        { id: 'au-2', name: 'Steve', gender: 'Male', preview: '/audio/steve.mp3', tags: ['Professional', 'Male', 'Middle-Aged'], avatar: steveAvatar },
        { id: 'au-3', name: 'Lucy', gender: 'Female', preview: '/audio/lucy.mp3', tags: ['Conversational', 'Female', 'Casual'], avatar: lucyAvatar },
        { id: 'au-4', name: 'Charlie', gender: 'Male', preview: '/audio/charlie.mp3', tags: ['Friendly', 'Male', 'Casual'], avatar: charlieAvatar },
    ],
    british: [
        { id: 'uk-1', name: 'Emma', gender: 'Female', preview: '/audio/emma.mp3', tags: ['Professional', 'British', 'Female'], avatar: emmaAvatar },
        { id: 'uk-2', name: 'Arthur', gender: 'Male', preview: '/audio/arthur.mp3', tags: ['Formal', 'British', 'Male'], avatar: arthurAvatar },
    ],
    newzealand: [
        { id: 'nz-1', name: 'Aroha', gender: 'Female', preview: '/audio/aroha.mp3', tags: ['Friendly', 'Casual', 'Female'], avatar: arohaAvatar },
        { id: 'nz-2', name: 'Nikau', gender: 'Male', preview: '/audio/nikau.mp3', tags: ['Calm', 'Male'], avatar: nikauAvatar },
    ]
};

export const PERSONALITIES = [
    {
        id: 'friendly',
        name: 'Friendly Mate',
        description: 'Warm, casual, and approachable. Uses local slang where appropriate.',
        icon: <Bot className="w-6 h-6 text-blue-500" />
    },
    {
        id: 'professional',
        name: 'Professional Assistant',
        description: 'Polite, efficient, and formal. Best for business-focused interactions.',
        icon: <BriefcaseIcon className="w-6 h-6 text-blue-500" />
    },
    {
        id: 'empathetic',
        name: 'Empathetic Listener',
        description: 'Patient, understanding, and calm. Ideal for support and sensitive inquiries.',
        icon: <HeartIcon className="w-6 h-6 text-blue-500" />
    }
];

export const VOICE_FILTERS = ['All styles', 'Casual', 'Professional', 'Conversational', 'Female', 'Male', 'Middle-Aged'];




