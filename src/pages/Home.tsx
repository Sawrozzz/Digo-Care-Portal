import { useNavigate } from "react-router-dom";

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
          <button className="border h-full w-full" onClick={handleOnClick}>
            Login Here
          </button>
        )}
      </div>
    </div>
  );
}
