import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

// GraphQL mutation to handle file upload for importing vehicles
const UPLOAD_VEHICLES = gql`
  mutation ImportVehicles($file: Upload!) {
    importVehicles(file: $file)
  }
`;

const ImportVehicles = () => {
  // useMutation hook initializes the GraphQL mutation and provides state variables (loading, error, data)
  const [importVehicles, { loading, error, data }] = useMutation(UPLOAD_VEHICLES);
  
  // State to track the selected file and upload errors
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  // Function to handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]; // Get the selected file
    console.log('Selected file:', selectedFile); // Debugging log to see the selected file
    if (selectedFile) {
      setFile(selectedFile); // Store the selected file in state
      setUploadError(null); // Clear any previous upload errors
    }
  };

  // Function to handle the import when the button is clicked
  const handleImport = async () => {
    if (file) {
      try {
        // Trigger the importVehicles mutation with the selected file
        const response = await importVehicles({
          variables: { file },
        });
        console.log('File uploaded successfully:', response.data); // Log the success response
      } catch (error) {
        console.error('Error uploading file:', error); // Log any errors during file upload
        setUploadError(error.message); // Set the upload error message in state
      }
    } else {
      setUploadError('Please select a file to import.'); // Error if no file is selected
    }
  };

  // Display loading indicator while the file is being uploaded
  if (loading) return <p>Uploading...</p>;
  
  // Display error message if there's an error during the GraphQL mutation
  if (error) return <p>Error: {error.message}</p>;
  
  // Display specific upload error if file upload fails
  if (uploadError) return <p>Upload Error: {uploadError}</p>;
  
  // Display success message once the file is successfully imported
  if (data) return <p>{data.importVehicles}</p>;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* File input element to select and upload .xlsx or .xls files */}
      <input
        type="file"
        onChange={handleFileChange} // Trigger the handleFileChange function on file selection
        accept=".xlsx, .xls" // Accept only Excel file formats
        onFocus={(e) => (e.target.style.borderColor = '#007BFF')} // Change border color on focus
        onBlur={(e) => (e.target.style.borderColor = '#ccc')} // Reset border color on blur
        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }} // Input styling
      />
      {/* Import button to trigger the upload */}
      <button onClick={handleImport} style={{ 
        border: 'none', 
        outline: 'none', 
        padding: '5px 10px', 
        backgroundColor: '#1A1A2E', // Button background color
        color: '#fff', // Button text color
        borderRadius: '4px', // Button border radius
        cursor: 'pointer', // Pointer cursor on hover
        transition: 'background-color 0.3s' // Transition for hover effect
      }} onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')} onMouseLeave={(e) => (e.target.style.backgroundColor = '#1A1A2E')}>
        Import
      </button>
      {/* Display any upload error */}
      {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
    </div>
  );
};

export default ImportVehicles;
