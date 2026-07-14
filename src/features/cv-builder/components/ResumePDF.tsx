import { Document } from '@react-pdf/renderer';
import { ModernTemplate } from './templates/ModernTemplate';
import { ProfessionalTemplate } from './templates/ProfessionalTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import type { ResumeData } from '../types';

interface ResumePDFProps {
    data: ResumeData;
}

export const ResumePDF = ({ data }: ResumePDFProps) => {
    const template = data?.settings?.template || 'modern';

    return (
        <Document>
            {template === 'modern' && <ModernTemplate data={data} />}
            {template === 'professional' && <ProfessionalTemplate data={data} />}
            {template === 'minimal' && <MinimalTemplate data={data} />}
        </Document>
    );
};
