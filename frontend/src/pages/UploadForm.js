import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import FileUpload from "../components/FileUpload";
import LoadingSpinner from "../components/LoadingSpinner";
import PDFPreview from "../components/PDFPreview";

export default function UploadForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const [pdfFile, setPdfFile] = useState(null);
    const [filledPdfUrl, setFilledPdfUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    // Retrieve state from location if available
    const { idFiles, extractedData } = location.state || {};

    const handlePdfUpload = async () => {
        if (!pdfFile) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('file', pdfFile);

        try {
            const response = await axios.post('http://localhost:5000/fill-form', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                responseType: 'blob', // Ensure the response is treated as a blob
            });
            const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            setFilledPdfUrl(url);
        } catch (error) {
            console.error("Error uploading PDF:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/upload-id', { state: { idFiles, extractedData } });
    };

    return (
        <div className="container mt-4">
            <h2>Upload Form</h2>
            <FileUpload label="Upload Form (PDF)" onFileSelect={setPdfFile} />
            <button onClick={handlePdfUpload} className="btn btn-primary">Upload & Fill Form</button>
            <button onClick={handleBack} className="btn btn-secondary">Back</button>

            {loading && <LoadingSpinner message="Filling form..." />}

            {filledPdfUrl && <PDFPreview pdfUrl={filledPdfUrl} />}
        </div>
    );
}