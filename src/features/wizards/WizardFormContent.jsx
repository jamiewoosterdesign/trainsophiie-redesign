
import React from 'react';
import WizardFormContentFaq from './WizardFormContent_FAQ';
import WizardFormContentPolicy from './WizardFormContent_Policy';
import WizardFormContentProduct from './WizardFormContent_Product';
import WizardFormContentService from './WizardFormContent_Service';
import WizardFormContentStaff from './WizardFormContent_Staff';
import WizardFormContentProtocol from './WizardFormContent_Protocol';
import WizardFormContentTransfer from './WizardFormContent_Transfer';
import WizardFormContentDocument from './WizardFormContent_Document';
import WizardFormContentNotificationAssignment from './WizardFormContent_NotificationAssignment';
import WizardFormContentDepartment from './WizardFormContent_Department';

export default function WizardFormContent(props) {
    const { mode } = props;

    switch (mode) {
        case 'faq':
            return <WizardFormContentFaq {...props} />;
        case 'policy':
            return <WizardFormContentPolicy {...props} />;
        case 'product':
            return <WizardFormContentProduct {...props} />;
        case 'service':
            return <WizardFormContentService {...props} />;
        case 'staff':
            return <WizardFormContentStaff {...props} />;
        case 'department':
            return <WizardFormContentDepartment {...props} />;
        case 'protocol':
            return <WizardFormContentProtocol {...props} />;
        case 'transfer':
            return <WizardFormContentTransfer {...props} />;
        case 'document':
            return <WizardFormContentDocument {...props} />;
        case 'notification_assignment':
            return <WizardFormContentNotificationAssignment {...props} />;
        default:
            return <div className="p-4 text-red-500">Unknown Wizard Mode: {mode}</div>;
    }
}
