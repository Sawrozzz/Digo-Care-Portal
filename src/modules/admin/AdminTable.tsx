import { DegoTable } from "../../components/custom/DegoTable";
import { adminColumns } from "./columns";

const adminTestData = [
  {
    id: 1,
    name: "Saroj Adhikari",
    role: "super_admin",
    status: "active",
  },
  {
    id: 2,
    name: "Bibek Rai",
    role: "admin",
    status: "inactive",
  },
  {
    id: 3,
    name: "Alan Adhikari",
    role: "admin",
    status: "active",
  },
  {
    id: 5,
    name: "Alan Adhikari",
    role: "admin",
    status: "active",
  },
  {
    id: 6,
    name: "Alan Adhikari",
    role: "admin",
    status: "active",
  },
  {
    id: 7,
    name: "Alan Adhikari",
    role: "admin",
    status: "active",
  },
  {
    id: 8,
    name: "Alan Adhikari",
    role: "admin",
    status: "active",
  },
];

export default function AdminTable() {
  return (
    <DegoTable columns={adminColumns} data={adminTestData} searchKey="name" />
  );
}
