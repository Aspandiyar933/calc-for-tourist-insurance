export interface InsuranceOption {
  value: number;
  currency: string;
  premium: number;
  discounted_premium: number;
  external_info: {
    id: number;
    title: string;
  };
}

export interface APIResponse {
  insurance_company: {
    name: string;
    main_page: string;
  };
  country: {
    name: string;
    external_info: {
      id: number;
      country_id: number;
      title: string;
      title_en: string;
      code: string;
      alpha_code: string;
      program_id: number;
      currency_id: number;
      multiply: number;
      is_shengen: number;
      is_excluded: number;
      visa_required: number;
      correction_factors_amount_sum: any[];
    };
  };
  results: InsuranceOption[] | InsuranceOption[][];
}
