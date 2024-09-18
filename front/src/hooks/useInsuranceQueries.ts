import { useQuery, useMutation, UseQueryResult, UseMutationResult } from 'react-query';
import { fetchInsurancePrices, submitOrder } from '../utils/api';
import { APIResponse, InsuranceFormData } from '../types/insurance';

export const useInsurancePrices = (requestData: any): UseQueryResult<APIResponse[], Error> => {
  return useQuery(['insurancePrices', requestData], () => fetchInsurancePrices(requestData), {
    enabled: !!requestData.country && !!requestData.start_date && !!requestData.end_date && !!requestData.age,
  });
};

export const useSubmitOrder = (): UseMutationResult<any, Error, InsuranceFormData> => {
  return useMutation(submitOrder);
};