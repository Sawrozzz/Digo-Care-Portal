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

export type Attachment = {
  id: number;
  /**
   * ActiveStorage blob signed id. Assigning to a `has_many_attached` replaces
   * the whole collection, so every add/remove has to re-send the survivors by
   * signed id — see `replacePatientXRays`.
   */
  signed_id: string;
  name: string;
  byte_size: number;
  content_type: string;
  url: string;
  created_at: string;
};

type Document = Attachment;
type X_Ray = Attachment;

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
export type Employee = {
  id: number;
  first_name: string;
  middle_name?: string;
  name?: string;
  last_name: string;
  phone: string;
  phone2?: string;
  email: string;
  gender?: string;
  dob?: string;
  status: string;
  has_account?: boolean;
  specialization?: string;
  license_no?: string;
  experience_years?: number;
  biographyqualification?: string;
  qualification?: string;
  biography?: string;
  avatar?: Avatar;
  address?: Address;
  created_at?: Date;
  updated_at?: Date;
};

export type PatientAssignment = {
  id: number;
  status: string;
  started_at: Date | string;
  ended_at?: Date | string | null;
  notes?: string;
  priority?: string;
  reason?: string;
  assignment_method?: string;
  room_number?: string;
  discharge_date?: Date | string | null;
  discharge_reason?: string;
  department?: string;
  employee: Employee;
  patient: Patient;
};

export const roleData: any = {
  admin: "Admin",
  super_admin: "Super Admin",
};
