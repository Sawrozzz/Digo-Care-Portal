import { useNavigate } from "react-router-dom";
import { CustomButton } from "../components/custom/Button";

type LoginProps = {
  isLoggedIn: boolean;
};

export default function HomePage({ isLoggedIn }: LoginProps) {
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate("login");
  };
  return (
    <div className="flex justify-center flex-col items-center">
      <div>
        <h1 className="text-4xl">Home page</h1>
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
