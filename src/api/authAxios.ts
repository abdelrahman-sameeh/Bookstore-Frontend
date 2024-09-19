import axios, { AxiosResponse } from 'axios';

// Create an Axios instance with baseURL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Your base URL
  timeout: 1000 * 60, // 60 seconds timeout
});

// Define types for the parameters
export const authAxios = async <T = any>(
  needAuth: boolean,
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  data: any = {},
  headersType: 'application/json' | 'multipart/form-data' = 'application/json'
): Promise<any> => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage
  try {
    const response: AxiosResponse<T> = await axiosInstance({
      url: endpoint, 
      method: method,
      data,
      headers: {
        'Content-Type': headersType,
        ...(needAuth && token ? { Authorization: `Bearer ${token}` } : {}), 
      },
    });
    return response; // Return the response data
  } catch (error: any) {
    // need to make it
    return error?.response ? error.response : error;
  }
};

export default authAxios;
