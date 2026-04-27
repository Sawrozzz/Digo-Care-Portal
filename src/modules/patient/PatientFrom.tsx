/* eslint-disable @typescript-eslint/no-explicit-any */
import { GenericForm } from "../../components/custom";
import { patientFormFields } from "./patientAttributes";
import { createPatient, updatePatient } from "./patientApi";

import type { Patient } from "../../utils";

import { User2Icon } from "lucide-react";

interface PatientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient?: Patient | null;
  companyId?: number;
  onSuccess?: () => void;
  reloadTable: () => Promise<void>;
}

const flattenPatientData = (patient: Patient | null): any => {
  if (!patient) return {};

  const flattened: any = {
    first_name: patient.first_name,
    middle_name: patient?.middle_name,
    last_name: patient.last_name,
    phone: patient.phone,
    phone2: patient?.phone2,
    email: patient.email,
    gender: patient?.gender,
    dob: patient.dob,
    blood_group: patient.blood_group,
    marital_status: patient.marital_status,
    status: patient.status,
  };
  if (patient.address) {
    flattened["address.country"] = patient.address.country;
    flattened["address.district"] = patient.address.district;
    flattened["address.province"] = patient.address.province;
    flattened["address.municipality"] = patient.address.municipality;
    flattened["address.ward_no"] = patient.address.ward_no;
    flattened["address.google_map"] = patient.address.google_map;
  }

  return flattened;
};

export function PatientForm({
  open,
  onOpenChange,
  patient,
  companyId,
  reloadTable,
}: PatientFormProps) {
  const handleSubmit = async (formData: Record<string, any>) => {
    if (companyId && patient?.id) {
      await updatePatient(companyId, patient.id, formData);
    } else {
      await createPatient(Number(companyId), formData as any);
    }
  };

  const initialData = patient ? flattenPatientData(patient) : {};
  return (
    <GenericForm
      open={open}
      onOpenChange={onOpenChange}
      title="Patient"
      subtitle={
        patient?.id
          ? "Update patient information"
          : "Add a new patient to your company"
      }
      fields={patientFormFields}
      initialData={initialData}
      onSubmit={handleSubmit}
      reloadTable={reloadTable}
      icon={<User2Icon className="h-5 w-5 text-white cursor-pointer" />}
      isEditing={!!patient?.id}
    />
  );
}
