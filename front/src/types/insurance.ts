export interface InsuranceCompany {
  name: string;
  main_page: string;
}

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
  insurance_company: InsuranceCompany;
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
  results: InsuranceOption | InsuranceOption[];
}

export interface NomadCustomer {
  iin: string;
  phone_number: string;
  email: string;
  address: string;
}

export interface Passport {
  full_name_in_latin: string;
  document_number: string;
  issue_date: string;
  issued_by: string;
}

export interface InsuranceFormData {
  country_id: number;
  insurance_sum_id: number;
  start_date: string;
  end_date: string;
  nomad_customer: NomadCustomer;
  passport: Passport;
}