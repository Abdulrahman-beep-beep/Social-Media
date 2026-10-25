import { Outlet } from "react-router";
import AuthIntro from "../components/Authintro/Authintro";

export default function AuthLayout() {
  return (
    <>
      <main className="bg-sec h-screen pt-10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2">
            <div className="">
              <AuthIntro />
            </div>
            <div className="">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
