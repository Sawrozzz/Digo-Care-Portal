/* eslint-disable @typescript-eslint/no-explicit-any */
import { DegoTable } from "../../components/custom/DegoTable";
import { companyColumns } from "./columns";


export default function CompanyTable({ companyData }: { companyData: any }) {
    return (
        <DegoTable
            columns={companyColumns}
            data={companyData}
            searchKey="name"
        />
    );
}
