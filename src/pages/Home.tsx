import { useNavigate } from "react-router-dom";
import { CustomButton } from "../components/custom/Button";
import { useAuthStore } from "../zustand/authStore";

type LoginProps = {
  isLoggedIn: boolean;
};

export default function HomePage({ isLoggedIn }: LoginProps) {
  const navigate = useNavigate();
  const { account } = useAuthStore();
  const handleOnClick = () => {
    navigate("/login");
  };

  return (
    <div className="flex justify-center flex-col items-center">
      <div>
        <h1 className="text-4xl">{account?.company_id} ID Admin Dashboard</h1>
      </div>

      <div>
        {!isLoggedIn && (
          <CustomButton
            className="text-white w-32 cursor-pointer"
            onClick={handleOnClick}
          >
            Login Here
          </CustomButton>
        )}
        <CustomButton
          variantType="secondary"
          className="text-white w-32 cursor-pointer"
        >
          Sadcn button
        </CustomButton>
      </div>
    </div>
  );
}
