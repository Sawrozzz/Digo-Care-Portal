import { SiteHeader } from "../../components/ui/site-header";
import AdminTable from "./AdminTable";

export default function AdminPageList() {
  return (
    <>
      <SiteHeader name="Admin" />
      <AdminTable />
    </>
  );
}
