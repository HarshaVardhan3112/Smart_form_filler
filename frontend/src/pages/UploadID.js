import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function UploadID() {
  const navigate = useNavigate();
  const location = useLocation();
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [extractedData, setExtractedData] = useState({});
  const [editableData, setEditableData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

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

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    setFilePreviews(prevPreviews => [...prevPreviews, ...selectedFiles.map(file => URL.createObjectURL(file))]);
  };

  const handleUpload = async () => {
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
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error uploading files:', error);
      setError('Failed to upload files. Please try again.');
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
    navigate('/upload-form', { state: { idFiles: files, extractedData } });
  };

  return (
    <div>
      <h1>Upload ID</h1>
      <input type="file" onChange={handleFileChange} multiple />
      {filePreviews.map((preview, index) => (
        <img key={index} src={preview} alt={`Uploaded ID ${index + 1}`} style={{ width: '200px', marginTop: '10px' }} />
      ))}
      <button onClick={handleUpload}>Upload</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {Object.keys(extractedData).length > 0 && (
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
          {/* <button onClick={() => setFiles([])}>Upload Another ID</button> */}
        </div>
      )}
    </div>
  );
}

export default UploadID;