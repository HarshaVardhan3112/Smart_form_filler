import { Download } from 'lucide-react';
import './styledcomponents.css';

export default function PDFPreview({ pdfUrl }) {
    return (
        <div className="pdf-preview-container">
            <div className="pdf-frame">
                <iframe 
                    src={pdfUrl} 
                    className="pdf-iframe"
                    title="PDF Preview"
                ></iframe>
            </div>
            
            <a 
                href={pdfUrl} 
                download="filled_form.pdf" 
                className="download-button"
            >
                <Download size={20} />
                Download Filled Form
            </a>
        </div>
    );
}