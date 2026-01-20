function MappingProgress() {
  return (
    <div className="progress-container">
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
        🤖 AI Processing Your Data...
      </h2>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: '100%', animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
      <p className="progress-text">
        Mapping in progress...
      </p>
    </div>
  );
}

export default MappingProgress;
