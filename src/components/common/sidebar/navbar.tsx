import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Search } from "lucide-react";
import LogoutSVG from "@/assets/icons/LogOut";
import { getLocalStorage, removeLocalStorage } from "@/lib/utils";
import { LOCAL_STORAGE_KEYS } from "@/constants";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { api, useAppDispatch } from "@/redux/store";
import { logout } from "@/redux/slices/auth";
import { useState, useRef, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useLazyGlobalSearchQuery } from "@/redux/services/search";
import type { SearchPatient, SearchOrder } from "@/types/responses/search";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const searchRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 500);

  const [triggerSearch, { data: searchResults, isLoading, isFetching }] =
    useLazyGlobalSearchQuery();

  const user = getLocalStorage(LOCAL_STORAGE_KEYS.USER);

  const userName = user?.name || user?.fullName || "Unknown User";
  const userInitials = userName
    .split(" ")
    .map((name: string) => name.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Trigger search when debounced value changes (minimum 3 characters)
  useEffect(() => {
    if (debouncedSearch && debouncedSearch.length >= 3) {
      triggerSearch(debouncedSearch);
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
  }, [debouncedSearch, triggerSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePatientClick = (patient: SearchPatient) => {
    navigate(`/patients/${patient?.id}`);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const handleOrderClick = (order: SearchOrder) => {
    const orderId = order.id.replace("order::", "");
    navigate(`/order/${orderId}`);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const getPatientName = (patient: SearchPatient) => {
    if (patient.firstName && patient.lastName) {
      return `${patient.firstName} ${patient.lastName}`;
    }
    if (patient.keywords && patient.keywords.length > 0) {
      return patient.keywords[0];
    }
    return "Unknown Patient";
  };

  const getOrderProductName = (order: SearchOrder) => {
    if (order.productVariations && order.productVariations.length > 0) {
      const filteredProducts = order?.productVariations.filter(
        (value: any, index, self) =>
          self.findIndex(
            (selfIndex: any) =>
              selfIndex?.productVariation?.product?.id ===
              value?.productVariation?.product?.id
          ) === index
      );
      const titles = filteredProducts.map(
        (pv: any) => pv?.productVariation?.product?.title
      );
      return titles.join(", ").replace(/,([^,]*)$/, " and$1");
    }
    return "Order";
  };

  const handleLogout = () => {
    removeLocalStorage(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    removeLocalStorage(LOCAL_STORAGE_KEYS.USER);
    dispatch(api.util.resetApiState());
    dispatch(logout()); // your authSlice action
    setTimeout(() => {
      navigate(ROUTES.LOGIN);
    }, 2000);
  };

  const hasResults =
    searchResults &&
    (searchResults.patients?.length > 0 || searchResults.orders?.length > 0);

  return (
    <>
      <div
        className="h-[80px] bg-white w-full fixed top-0 left-0 right-0 z-[41] "
        style={{
          backdropFilter: "blur(50px)",
          boxShadow: "0px 4px 4px 0px #0000000A",
        }}
      >
        <SidebarTrigger className="md:hidden" />

        <div className="h-full flex items-center justify-end gap-8 px-5">
          {/* Search Bar */}
          <div className="relative" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Order ID and Patient Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[400px] h-[45px] pl-4 pr-10 border-none rounded-lg focus:outline-none text-sm bg-[#EFE9F4]"
              />
              <Search
                className="absolute right-3 top-1/2 transform -translate-y-1/2 "
                size={20}
              />
            </div>

            {/* Search Results Dropdown */}
            {isSearchOpen && searchQuery.length >= 3 && (
              <div className="absolute top-full left-0 mt-1 w-[400px] bg-white border border-gray-200 rounded-lg shadow-lg max-h-[400px] overflow-y-auto z-50">
                {isLoading || isFetching ? (
                  <div className="p-4 text-center text-gray-500">
                    Searching...
                  </div>
                ) : hasResults ? (
                  <>
                    {/* Patients Section */}
                    {searchResults.patients &&
                      searchResults.patients.length > 0 && (
                        <div>
                          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50 border-b">
                            Patients
                          </div>
                          {searchResults.patients.map((patient) => (
                            <div
                              key={patient.id}
                              onClick={() => handlePatientClick(patient)}
                              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                            >
                              <p className="text-sm font-medium text-gray-900">
                                Patient Name:{" "}
                                <span className="font-semibold">
                                  {getPatientName(patient)}
                                </span>
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                    {/* Orders Section */}
                    {searchResults.orders &&
                      searchResults.orders.length > 0 && (
                        <div>
                          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50 border-b">
                            Orders
                          </div>
                          {searchResults.orders.map((order) => (
                            <div
                              key={order.id}
                              onClick={() => handleOrderClick(order)}
                              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                            >
                              <p className="text-sm font-semibold text-gray-900">
                                {getOrderProductName(order)}
                              </p>
                              <p className="text-xs text-gray-500">
                                Order Id: {order.orderNumber}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                  </>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile Section */}
          <div className="flex items-center gap-[15px]">
            <span className="w-[50px] h-[50px] rounded-full p-3 bg-secondary text-sm font-semibold flex justify-center items-center text-primary">
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
      </div>
      <div className="h-[80px]"></div>
    </>
  );
}
