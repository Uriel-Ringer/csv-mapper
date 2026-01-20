function MappingReviewTable({ mappedData }) {
  if (!mappedData || mappedData.length === 0) {
    return <p>No mapped data to display</p>;
  }

  // Get all fields dynamically from the first row, excluding internal fields
  const allFields = Object.keys(mappedData[0]).filter(
    key => !key.startsWith('_') // Exclude internal fields like _confidence, _sourceData
  );
  
  // Add _confidence at the end if it exists
  const keyFields = mappedData[0]._confidence 
    ? [...allFields, '_confidence'] 
    : allFields;

  return (
    <div className="table-container" style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: '50px' }}>#</th>
              {keyFields.map((field) => (
                <th key={field}>{field === '_confidence' ? 'Confidence' : field}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mappedData.map((row, idx) => {
              return (
                <tr key={idx}>
                  <td style={{ color: '#999' }}>{idx + 1}</td>
                  {keyFields.map((field) => (
                    <td key={field}>
                      {field === '_confidence' ? (
                        <span
                          className={`confidence-badge confidence-${row[field].toLowerCase()}`}
                        >
                          {row[field]}
                        </span>
                      ) : (
                        <span title={row[field]}>
                          {row[field] || <span style={{ color: '#ccc' }}>-</span>}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
    </div>
  );
}

export default MappingReviewTable;
