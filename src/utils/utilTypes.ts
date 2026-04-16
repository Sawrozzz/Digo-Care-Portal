export type Address = {
  id: number;
  country: string;
  province?: string;
  municipality?: string;
  ward_no?: number;
  google_map?: string;
};

type Avatar = {
  name: string;
  byte_size: number;
  content_type: string;
  url: string;
};

export type Account = {
  id: number;
  email: string;
  profile_type?: string;
  profile_id?: number;
  role: string;
  company_id: number | null;
};

export type Company = {
  id: number;
  name: string;
  display_name?: string;
  phone: string;
  phone2?: string;
  phone3?: string;
  email: string;
  status: string;
  avatar?: Avatar;
  address?: Address;
  created_at?: string;
  updated_at?: string;
};
