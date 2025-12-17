import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import LogoutSVG from "@/assets/icons/LogOut";
import { getLocalStorage, removeLocalStorage } from "@/lib/utils";
import { LOCAL_STORAGE_KEYS } from "@/constants";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { api, useAppDispatch } from "@/redux/store";
import { logout } from "@/redux/slices/auth";

export default function Navbar() {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const user = getLocalStorage(LOCAL_STORAGE_KEYS.USER);

  const userName = user?.name || user?.fullName || "Unknown User";
  const userInitials = userName
    .split(" ")
    .map((name: string) => name.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    removeLocalStorage(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    removeLocalStorage(LOCAL_STORAGE_KEYS.USER);
    dispatch(api.util.resetApiState());
    dispatch(logout()); // your authSlice action
    setTimeout(() => {
      navigate(ROUTES.LOGIN);
    }, 2000);
  };

  return (
    <>
      <div
        className="h-[80px] bg-white w-full fixed top-0 left-0 right-0 z-40"
        style={{
          backdropFilter: "blur(50px)",
          boxShadow: "0px 4px 4px 0px #0000000A",
        }}
      >
        <SidebarTrigger className="md:hidden" />
        <div className=" h-full flex items-center justify-end gap-[15px] pr-5 ">
          <span className="w-[50px] h-[50px] rounded-full  p-3 bg-secondary text-sm font-semibold flex justify-center items-center text-primary">
            {userInitials}
          </span>
          <div>
            <h4 className="font-semibold text-base">{userName}</h4>
            <h6 className="font-normal text-xs">
              {user?.role || "Affiliate admin"}
            </h6>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <ChevronDown stroke="black" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2 w-[174px]">
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
              >
                <LogoutSVG />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="h-[80px]"></div>
    </>
  );
}
