import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AdminPageList from "./modules/admin/AdminPageList";
import DashboardPageList from "./modules/dashboard/DashboardPageList";
import LoginPage from "./pages/Login";
import MainNav from "./components/custom/MainNav";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNav />,
    children: [
      {
        path: "admins",
        element: <AdminPageList />,
      },
      {
        path: "dashboard",
        element: <DashboardPageList />,
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
  