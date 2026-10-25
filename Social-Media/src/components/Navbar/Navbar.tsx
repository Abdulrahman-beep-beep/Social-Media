import logo from "../../assets/route.png";
import { House, MessageCircleMore, Settings, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useContext } from "react";
import { TokenContext } from "../context/tokenContext";
import toast from "react-hot-toast";

export default function Navbar() {
  const context = useContext(TokenContext)!;
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("userToken");
    context.setToken(null);
    toast.success("Logged out successfully");
    navigate("/auth/login");
  }
  const linkClass = "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-700";
  return <nav className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 py-3 shadow-sm backdrop-blur">
    <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4">
      <Link to="/feed" aria-label="Home"><img src={logo} width={94} alt="Route Posts" /></Link>
      <div className="flex flex-wrap items-center gap-1">
        <Link className={linkClass} to="/feed"><House size={18}/> Feed</Link>
        <Link className={linkClass} to="/profile"><User size={18}/> Profile</Link>
        <Link className={linkClass} to="/notification"><MessageCircleMore size={18}/> Notifications</Link>
      </div>
      <div className="flex items-center gap-2">
        <Link to="/profile" aria-label="Settings" className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"><Settings size={18}/></Link>
        <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700"><LogOut size={16}/> Log out</button>
      </div>
    </div>
  </nav>;
}
