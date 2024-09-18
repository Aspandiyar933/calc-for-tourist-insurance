import axios from 'axios';
import { APIResponse, InsuranceFormData } from '../types/insurance';

const API_BASE_URL = 'https://bestoffer.kz/api/mst';

export const fetchInsurancePrices = async (requestData: any): Promise<APIResponse[]> => {
  const endpoints = ['amanat', 'interteach', 'asko', 'freedom', 'nomad', 'jusan'];

  const requests = endpoints.map((endpoint) =>
    axios.post<APIResponse>(`${API_BASE_URL}/${endpoint}`, requestData, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })
  );

  const responses = await Promise.all(requests.map((p) => p.catch((e) => e)));
  return responses.filter((response): response is APIResponse => !(response instanceof Error));
};

export const submitOrder = async (orderData: InsuranceFormData): Promise<any> => {
  const response = await axios.post(`${API_BASE_URL}/nomad/order`, orderData);
  return response.data;
};