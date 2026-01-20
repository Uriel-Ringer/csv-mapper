import { useState } from 'react';
import FileUpload from './components/FileUpload';
import MappingProgress from './components/MappingProgress';
import MappingReviewTable from './components/MappingReviewTable';
import { uploadAndMapCSV } from './api';

function App() {
  const [step, setStep] = useState('upload'); // upload, mapping, review
  const [mappedData, setMappedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  const handleFileUpload = async (file) => {
    setError(null);
    setIsProcessing(true);
    setStep('mapping');
    
    try {
      const result = await uploadAndMapCSV(file);
      console.log("Mapping result:", result);
      
      setMappedData(result);
      setStep('review');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process file');
      setStep('upload');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setStep('upload');
    setMappedData(null);
    setError(null);
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>🤖 CSV Mapper</h1>
          <p>AI-Powered Product Data Mapping for Eyewear Suppliers</p>
        </header>

        <main className="main-content">
          {error && (
            <div style={{
              padding: '1rem',
              background: '#fee',
              border: '1px solid #fcc',
              borderRadius: '8px',
              marginBottom: '1rem',
              color: '#c00'
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {step === 'upload' && (
            <FileUpload
              onFileSelect={handleFileUpload}
              isProcessing={isProcessing}
            />
          )}

          {step === 'mapping' && (
            <MappingProgress />
          )}

          {step === 'review' && mappedData && (
            <>
              <div className="section">
                <div className="section-header">
                  <h2>✅ Mapping Review</h2>
                  <button className="btn btn-secondary" onClick={handleReset}>
                    Start Over
                  </button>
                </div>

                <MappingReviewTable
                  mappedData={mappedData.mappedRows}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
