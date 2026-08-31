import { useEffect } from "react";

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import AdminPageList from "./modules/admin/AdminPageList";
import LoginPage from "./pages/Login";
import MainNav from "./components/custom/MainNav";
import ProtectedRoute from "./routes/ProtectedRoutes";
import DashboardWrapper from "./routes/DashboardWrapper";
import CompanyPageList from "./modules/company/CompanyPageList";
import PageNotFound from "./pages/PageNotFound";
import CompanyProfilePage from "./modules/company/CompanyProfilePage";
import { useAuthStore } from "./zustand/authStore";
import { useCompanyStore } from "./zustand/companyStore";
import EmployeePage from "./modules/employee/EmployeePageList";
import PatientPage from "./modules/patient/PatientPageList";
import PatientProfilePage from "./modules/patient/PatientProfilePage";
import EmployeeProfilePage from "./modules/employee/EmployeeProfilePage";
import PatientAssignmentPage from "./modules/patientAssignment/PatientAssignmentList";
import VisitSchedulePage from "./modules/visitSchedule/VisitScheduleList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNav />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "admins",
        element: (
          <ProtectedRoute requiredRole="super_admin">
            <AdminPageList />
          </ProtectedRoute>
        ),
      },
      {
        path: "companies",
        element: (
          <ProtectedRoute requiredRole="super_admin">
            <CompanyPageList />
          </ProtectedRoute>
        ),
      },
      {
        path: "companies/:id",
        element: (
          <ProtectedRoute>
            <CompanyProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardWrapper />
          </ProtectedRoute>
        ),
      },
      {
        path: "patients",
        element: (
          <ProtectedRoute>
            <PatientPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "patients/:id",
        element: (
          <ProtectedRoute>
            <PatientProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "employees",
        element: (
          <ProtectedRoute>
            <EmployeePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "employees/:id",
        element: (
          <ProtectedRoute>
            <EmployeeProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "patient-assignments",
        element: (
          <ProtectedRoute>
            <PatientAssignmentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "visit-schedules",
        element: (
          <ProtectedRoute>
            <VisitSchedulePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default function App() {
  // atomic selectors: App renders the whole router tree, so subscribing to the
  // full store snapshot would re-render every page on any unrelated store write
  const token = useAuthStore((state) => state.token);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const accountId = useAuthStore((state) => state.account?.id);
  const accountRole = useAuthStore((state) => state.account?.role);
  const initializeCompanies = useCompanyStore(
    (state) => state.initializeCompanies
  );

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [token, fetchCurrentUser]);

  useEffect(() => {
    if (accountRole) {
      initializeCompanies(accountRole, accountId);
    }
  }, [accountRole, accountId, initializeCompanies]);

  return <RouterProvider router={router} />;
}
