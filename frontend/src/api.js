import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/csv';

/**
 * Upload CSV file and map it with AI in one request
 * @param {File} file - CSV file
 * @returns {Promise} - Mapped data
 */
export const uploadAndMapCSV = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post(`${API_BASE_URL}/map`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};
