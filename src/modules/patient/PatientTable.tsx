/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DegoTable } from "../../components/custom/DegoTable";
import { patientColumns } from "./columns";
import { getAllPatientsOfACompany } from "./patientApi";
import { parsePatientResponse } from "../../utils/appUtils";
import { PatientForm } from "./PatientFrom";
import type { Patient } from "../../utils";

interface PatientTableProps {
  companyId: number;
}

export default function PatientTable({ companyId }: PatientTableProps) {
  const navigate = useNavigate();

  const [patientData, setPatientData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllPatientsOfACompany(Number(companyId));
      setPatientData(parsePatientResponse(response) as []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch patients");
      setPatientData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!companyId) return;
    fetchPatients();
  }, [companyId]);

  const handleAddClick = () => {
    setSelectedPatient(null);
    setFormOpen(true);
  };

  const handleEditClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormOpen(true);
  };

  const handleRowClick = (patient: Patient) => {
    navigate(`/patients/${patient.id}`);
  };

  if (loading) {
    return <div className="p-4">Loading patients...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <>
      <DegoTable
        columns={patientColumns({
          onEdit: handleEditClick,
          reloadTable: fetchPatients,
          onRowClick: handleRowClick,
        })}
        data={patientData}
        searchKey="name"
        onAddData={handleAddClick}
      />
      <PatientForm
        open={formOpen}
        onOpenChange={setFormOpen}
        patient={selectedPatient}
        companyId={companyId}
        onSuccess={() => setFormOpen(false)}
        reloadTable={fetchPatients}
      />
    </>
  );
}
