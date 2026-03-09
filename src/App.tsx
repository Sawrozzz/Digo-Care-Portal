import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";

function App() {
  const isLoggedIn = false;

  return (
    <Routes>
      <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
