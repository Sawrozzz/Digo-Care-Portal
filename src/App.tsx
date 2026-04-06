import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AdminPageList from "./modules/admin/AdminPageList";
import LoginPage from "./pages/Login";
import MainNav from "./components/custom/MainNav";
import ProtectedRoute from "./routes/ProtectedRoutes";
import DashboardWrapper from "./routes/DashboardWrapper";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNav />,
    children: [
      {
        path: "admins",
        element: (
          <ProtectedRoute requiredRole="super_admin">
            <AdminPageList />
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
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
