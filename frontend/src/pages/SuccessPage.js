import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Download, RefreshCw, AlertTriangle } from 'lucide-react';
import './SuccessPage.css';

export default function SuccessPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [downloadError, setDownloadError] = useState(false);
    const { pdfBlob, fileName = 'filled_form.pdf' } = location.state || {};

    const handleDownload = () => {
        if (pdfBlob) {
            try {
                // Create a new blob URL each time we want to download
                const blobUrl = window.URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                // Cleanup the blob URL after download starts
                setTimeout(() => {
                    window.URL.revokeObjectURL(blobUrl);
                }, 100);
                setDownloadError(false);
            } catch (error) {
                console.error('Download error:', error);
                setDownloadError(true);
            }
        } else {
            setDownloadError(true);
        }
    };

    const handleStartOver = () => {
        navigate('/upload-id');
    };

    return (
        <div className="success-container">
            <div className="success-content">
                <div className="checkmark-container">
                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                        <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                </div>
                
                <h1 className="success-title">
                    Thanks for using
                    <span className="highlight"> Smart Form Filler</span>
                </h1>

                <div className="success-actions">
                    <button 
                        className="action-button download-button"
                        onClick={handleDownload}
                        disabled={!pdfBlob}
                    >
                        <Download size={20} />
                        Download Filled Form Again
                    </button>

                    {downloadError && (
                        <div className="download-error">
                            The filled form is no longer available. Please start over with a new form.
                        </div>
                    )}

                    <button 
                        className="action-button restart-button"
                        onClick={handleStartOver}
                    >
                        <RefreshCw size={20} />
                        Fill Another Form
                    </button>
                </div>

                <div className="security-notice">
                    <AlertTriangle size={16} />
                    <p>Your credentials will be removed once you check out.</p>
                </div>
            </div>
        </div>
    );
}