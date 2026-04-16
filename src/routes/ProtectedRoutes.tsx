import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../zustand/authStore";
import { Loader } from "../components/custom/Loader";

type Props = {
  children: ReactNode;
  requiredRole?: string; // optional
};

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const { isAuthenticated, account } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if(!account){
    return(
      <Loader size={72} />
    )
  }

  if (requiredRole && account?.role !== requiredRole) {
    // fallback if role doesn't match
    return <Navigate to="/page-not-found" replace />;
  }

  return <>{children}</>;
}


