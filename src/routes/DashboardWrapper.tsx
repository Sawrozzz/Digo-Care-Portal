import DashboardPageList from "../modules/dashboard/DashboardPageList";
import { useAuthStore } from "../zustand/authStore";
import HomePage from "../pages/Home";

export default function DashboardWrapper() {
    const {account} = useAuthStore();

    if (!account) return <HomePage isLoggedIn={false} />;

    return account.role === "super_admin" ? (
        <DashboardPageList />
    ) : (
        <HomePage isLoggedIn={true} />
    );
}