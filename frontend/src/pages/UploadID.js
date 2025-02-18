import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function UploadID() {
  const navigate = useNavigate();
  const location = useLocation();
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [editableData, setEditableData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  // Retrieve state from location if available
  useEffect(() => {
    if (location.state) {
      const { idFiles, extractedData } = location.state;
      setFile(idFiles[0]);
      setExtractedData(extractedData);
      setEditableData(extractedData);
      setFilePreview(idFiles ? URL.createObjectURL(idFiles[0]) : null);
    }
  }, [location.state]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload-id', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setExtractedData(response.data.extracted_data);
      setEditableData(response.data.extracted_data);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file. Please try again.');
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
      await axios.post('http://localhost:5000/update-data', editableData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setExtractedData(editableData);
      setIsEditing(false); // Hide the editing interface
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error updating data:', error);
      setError('Failed to update data. Please try again.');
    }
  };

  const handleUploadForm = () => {
    navigate('/upload-form', { state: { idFiles: [file], extractedData } });
  };

  return (
    <div>
      <h1>Upload ID</h1>
      <input type="file" onChange={handleFileChange} />
      {filePreview && <img src={filePreview} alt="Uploaded ID" style={{ width: '200px', marginTop: '10px' }} />}
      <button onClick={handleUpload}>Upload</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {extractedData && (
        <div>
          <h2>Extracted Data</h2>
          <pre>{JSON.stringify(extractedData, null, 2)}</pre>
          <button onClick={() => setIsEditing(!isEditing)}>Edit</button>
          <button onClick={handleUploadForm}>Upload Form</button>
          {isEditing && (
            <div>
              <h2>Edit Data</h2>
              {Object.keys(editableData).map((key) => (
                <div key={key}>
                  <label>{key}:</label>
                  <input
                    type="text"
                    name={key}
                    value={editableData[key]}
                    onChange={handleEditChange}
                  />
                </div>
              ))}
              <button onClick={handleUpdateData}>Update Data</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UploadID;