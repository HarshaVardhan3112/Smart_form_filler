import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import FileUpload from "../components/FileUpload";
import LoadingSpinner from "../components/LoadingSpinner";
import PDFPreview from "../components/PDFPreview";
import { Upload, ArrowLeft, FileText } from 'lucide-react';
import './UploadForm.css';

export default function UploadForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const [pdfFile, setPdfFile] = useState(null);
    const [filledPdfUrl, setFilledPdfUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { idFiles, extractedData } = location.state || {};

    const handlePdfUpload = async () => {
        if (!pdfFile) {
            setError("Please select a PDF file first");
            return;
        }
        setError(null);
        setLoading(true);
        const formData = new FormData();
        formData.append('file', pdfFile);

        try {
            const response = await axios.post('http://localhost:5000/fill-form', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                responseType: 'blob',
            });
            const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            setFilledPdfUrl(url);
        } catch (error) {
            console.error("Error uploading PDF:", error);
            setError("Failed to process the PDF. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/upload-id', { state: { idFiles, extractedData } });
    };

    return (
        <div className="form-upload-container">
            <div className="form-header">
                <button onClick={handleBack} className="back-button">
                    <ArrowLeft size={20} />
                    Back to ID Upload
                </button>
                <h2 className="form-title">Upload Your Form</h2>
            </div>

            <div className="upload-section">
                <div className="upload-card">
                    <FileUpload 
                        label={
                            <div className="upload-label-content">
                                <FileText size={32} />
                                <span>Select or drop your PDF form here</span>
                            </div>
                        } 
                        onFileSelect={setPdfFile} 
                    />
                    
                    {pdfFile && (
                        <div className="selected-file">
                            <FileText size={20} />
                            <span>{pdfFile.name}</span>
                        </div>
                    )}

                    {error && <div className="error-message">{error}</div>}

                    <button 
                        onClick={handlePdfUpload} 
                        className="action-button upload-button"
                        disabled={!pdfFile || loading}
                    >
                        <Upload size={20} />
                        {loading ? 'Processing...' : 'Process Form'}
                    </button>
                </div>
            </div>

            {loading && (
                <div className="loading-container">
                    <LoadingSpinner message="Filling your form..." />
                </div>
            )}

            {filledPdfUrl && (
                <div className="preview-section">
                    <h3 className="preview-title">Filled Form Preview</h3>
                    <PDFPreview pdfUrl={filledPdfUrl} />
                </div>
            )}
        </div>
    );
}