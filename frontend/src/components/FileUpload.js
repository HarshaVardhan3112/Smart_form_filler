import React, { useState } from 'react';

export default function FileUpload({ label, onFileSelect }) {
    const [selectedFileName, setSelectedFileName] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFileName(file.name);
            onFileSelect(file);
        }
    };

    return (
        <div className="mb-3">
            <label className="form-label">{label}</label>
            <input 
                type="file" 
                className="form-control"
                onChange={handleFileChange} 
            />
            {selectedFileName && <p>Selected file: {selectedFileName}</p>}
        </div>
    );
}