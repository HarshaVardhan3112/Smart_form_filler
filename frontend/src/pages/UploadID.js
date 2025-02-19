import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Upload, Edit2, Save, RefreshCw, ArrowRight, ChevronDown, Check, X } from 'lucide-react';
import './UploadID.css';

function UploadID() {
  const navigate = useNavigate();
  const location = useLocation();
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [extractedData, setExtractedData] = useState({});
  const [editableData, setEditableData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const extractedDataRef = useRef(null);

  // Retrieve state from location if available
  useEffect(() => {
    if (location.state) {
      const { idFiles, extractedData } = location.state;
      setFiles(idFiles);
      setExtractedData(extractedData);
      setEditableData(extractedData);
      setFilePreviews(idFiles.map(file => URL.createObjectURL(file)));
    }
  }, [location.state]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Reset editable data to current extracted data when starting edit
      setEditableData({...extractedData});
    }
  };

  const handleInlineEdit = (key, value) => {
    setEditableData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    setFilePreviews(prevPreviews => [...prevPreviews, ...selectedFiles.map(file => URL.createObjectURL(file))]);
  };

  const scrollToExtractedData = () => {
    extractedDataRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one ID document');
      return;
    }

    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const response = await axios.post('http://localhost:5000/upload-id', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const newExtractedData = response.data.extracted_data;
      setExtractedData(prevData => ({ ...prevData, ...newExtractedData }));
      setEditableData(prevData => ({ ...prevData, ...newExtractedData }));
      setShowScrollIndicator(true);
      // Short delay to ensure the data is rendered before scrolling
      setTimeout(scrollToExtractedData, 500);
    } catch (error) {
      console.error('Error uploading files:', error);
      setError('Failed to upload files. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditableData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateData = async () => {
    try {
      setIsLoading(true);
      await axios.post('http://localhost:5000/update-data', editableData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setExtractedData(editableData);
      setIsEditing(false);
      setError(null);
    } catch (error) {
      console.error('Error updating data:', error);
      setError('Failed to update data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditableData({...extractedData});
  };

  const handleUploadForm = () => {
    navigate('/upload-form', { state: { idFiles: files, extractedData } });
  };

  const handleSwapNames = () => {
    let Name = editableData['Name'] || '';
    let firstName = editableData['First Name'] || '';
    let lastName = editableData['Last Name'] || '';

    if (Name) {
      let nameParts = Name.split(' ');
      if (nameParts.length > 1) {
        setEditableData({
          ...editableData,
          'First Name': nameParts.slice(1).join(' '),
          'Last Name': nameParts[0],
        });
      } else {
        setEditableData({
          ...editableData,
          'First Name': '',
          'Last Name': firstName,
        });
      }
    }
  };

  return (
    <div className="upload-container">
      <h1 className="title">Upload Your ID Card</h1>
      
      <div className="upload-section">
        <label className="file-upload-label">
          <Upload className="upload-icon" size={32} />
          <span>Click here or drop your ID card images</span>
          <input 
            type="file" 
            onChange={handleFileChange} 
            multiple 
            className="file-input" 
          />
        </label>

        <div className="preview-container">
          {filePreviews.map((preview, index) => (
            <div key={index} className="preview-card">
              <img 
                src={preview} 
                alt={`Uploaded ID ${index + 1}`} 
                className="preview-image" 
              />
              <div className="preview-overlay">
                <span className="preview-number">ID {index + 1}</span>
              </div>
            </div>
          ))}
        </div>

        {files.length > 0 && (
          <button 
            onClick={handleUpload} 
            className={`action-button upload-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="button-spinner"></div>
                Processing...
              </>
            ) : (
              <>
                <Upload size={20} />
                Process ID Cards
              </>
            )}
          </button>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}

      {showScrollIndicator && !isLoading && Object.keys(extractedData).length === 0 && (
        <div className="scroll-indicator" onClick={scrollToExtractedData}>
          <span>View Extracted Data</span>
          <ChevronDown size={24} className="bounce" />
        </div>
      )}

      {Object.keys(extractedData).length > 0 && (
        <div className="extracted-data-section" ref={extractedDataRef}>
          <div className="section-header">
            <h2 className="section-title">Extracted Information</h2>
            <div className="edit-controls">
              {isEditing ? (
                <>
                  <button 
                    onClick={handleUpdateData} 
                    className="action-button save-button"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="button-spinner"></div>
                    ) : (
                      <>
                        <Check size={20} />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button 
                    onClick={handleCancelEdit} 
                    className="action-button cancel-button"
                    disabled={isLoading}
                  >
                    <X size={20} />
                    Cancel
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleEditToggle} 
                  className="action-button edit-button"
                >
                  <Edit2 size={20} />
                  Edit Details
                </button>
              )}
            </div>
          </div>
          
          <div className={`data-card ${isEditing ? 'editing' : ''}`}>
            {Object.entries(isEditing ? editableData : extractedData).map(([key, value]) => (
              <div key={key} className="data-row">
                <span className="data-label">{key}:</span>
                {isEditing ? (
                  <div className="editable-value">
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleInlineEdit(key, e.target.value)}
                      className="inline-edit-input"
                      autoFocus={key === Object.keys(editableData)[0]}
                    />
                    <Edit2 size={16} className="edit-indicator" />
                  </div>
                ) : (
                  <span className="data-value">{value}</span>
                )}
              </div>
            ))}
          </div>

          {!isEditing && (
            <button 
              onClick={handleUploadForm} 
              className="action-button next-button"
            >
              Continue to Form
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default UploadID;