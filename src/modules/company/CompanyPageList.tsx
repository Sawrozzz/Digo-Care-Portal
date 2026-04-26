import { SiteHeader } from "../../components/ui/site-header";
import CompanyTable from "./CompanyTable";

export default function CompanyPageList() {
  return (
    <>
      <SiteHeader name="Company" />
      <CompanyTable />
    </>
  );
}
