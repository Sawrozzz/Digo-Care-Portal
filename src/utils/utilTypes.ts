/* eslint-disable @typescript-eslint/no-explicit-any */
export type Address = {
  id: number;
  country: string;
  province?: string;
  district?: string;
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

type Document = {
  id: number;
  name: string;
  byte_size: number;
  content_type: string;
  url: string;
  created_at: string;
};
type X_Ray = {
  id: number;
  name: string;
  byte_size: number;
  content_type: string;
  url: string;
  created_at: string;
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
  has_account?: boolean;
  avatar?: Avatar;
  address?: Address;
  created_at?: Date;
  updated_at?: Date;
};

export type Patient = {
  id: number;
  patient_id: string;
  first_name: string;
  middle_name?: string;
  name?: string;
  last_name: string;
  phone: string;
  phone2?: string;
  email: string;
  gender?: string;
  dob?: string;
  blood_group?: string;
  marital_status?: string;
  status: string;
  has_account?: boolean;
  avatar?: Avatar;
  documents?: Document[];
  x_rays?: X_Ray[];
  address?: Address;
  created_at?: Date;
  updated_at?: Date;
};

export const roleData: any = {
  admin: "Admin",
  super_admin: "Super Admin",
};
