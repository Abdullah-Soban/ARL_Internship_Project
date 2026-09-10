export const API_BASE_URL = 'http://localhost:5001/api';

export const fetchSummaryStats = async () => {
  const response = await fetch(`${API_BASE_URL}/summary`);
  if (!response.ok) throw new Error('Failed to fetch summary stats');
  return response.json();
};

export const fetchTransactions = async (search = '', status = 'All') => {
  const queryParams = new URLSearchParams();
  if (search) queryParams.append('search', search);
  if (status && status !== 'All') queryParams.append('status', status);
  
  const response = await fetch(`${API_BASE_URL}/transactions?${queryParams.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch transactions');
  return response.json();
};

export const fetchTransactionById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/transactions/${id}`);
  if (!response.ok) throw new Error('Failed to fetch transaction details');
  return response.json();
};

export const runAIAnalysis = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to run AI analysis');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSales = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/sales`);
    if (!response.ok) throw new Error('Failed to fetch sales');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSalesSummary = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/sales/summary`);
    if (!response.ok) throw new Error('Failed to fetch sales summary');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
