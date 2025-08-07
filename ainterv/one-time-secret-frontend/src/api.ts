import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/secrets';

export const submitSecret = async (secret: string) => {
  const response = await axios.post(API_BASE, { secret });
  return response.data;
};

export const fetchSecret = async (id: string) => {
  const response = await axios.get(`${API_BASE}/${id}`);
  return response.data;
}
