import { create } from 'zustand';
import { APIResponse } from '../types/insurance';

interface InsuranceState {
  country: string;
  countryId: number;
  startDate: Date | undefined;
  endDate: Date | undefined;
  age: string;
  insuranceSumId: number;
  selectedInsurance: APIResponse | null;
  setCountry: (country: string) => void;
  setCountryId: (id: number) => void;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  setAge: (age: string) => void;
  setInsuranceSumId: (id: number) => void;
  setSelectedInsurance: (insurance: APIResponse | null) => void;
}

export const useInsuranceStore = create<InsuranceState>((set) => ({
  country: '',
  countryId: 0,
  startDate: undefined,
  endDate: undefined,
  age: '',
  insuranceSumId: 0,
  selectedInsurance: null,
  setCountry: (country) => set({ country }),
  setCountryId: (countryId) => set({ countryId }),
  setStartDate: (startDate) => set({ startDate }),
  setEndDate: (endDate) => set({ endDate }),
  setAge: (age) => set({ age }),
  setInsuranceSumId: (insuranceSumId) => set({ insuranceSumId }),
  setSelectedInsurance: (selectedInsurance) => set({ selectedInsurance }),
}));