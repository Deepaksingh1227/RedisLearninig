import { logoutUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("token");
      navigate("/login");
    } catch {
      alert("Logout failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-600 to-purple-700">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Dashboard
        </h1>

        <p className="text-gray-600 mb-8">You are logged in successfully 🔐</p>

        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold
                     hover:bg-red-600 transition duration-300 shadow-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
