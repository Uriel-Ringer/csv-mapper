import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function FileUpload({ onFileSelect, isProcessing }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false,
    disabled: isProcessing
  });

  return (
    <div
      {...getRootProps()}
      className={`upload-zone ${isDragActive ? 'active' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="upload-icon">📁</div>
      <h2>Upload Supplier File</h2>
      <p>
        {isDragActive
          ? 'Drop the file here...'
          : 'Drag & drop a CSV or Excel file here, or click to select'}
      </p>
      <button className="btn btn-primary" disabled={isProcessing}>
        {isProcessing ? 'Uploading...' : 'Select File'}
      </button>
    </div>
  );
}

export default FileUpload;
