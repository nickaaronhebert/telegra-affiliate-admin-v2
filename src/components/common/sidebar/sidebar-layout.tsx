import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/common/sidebar/app-sidebar";
import Navbar from "./navbar";
import { Outlet, useLocation, useMatch } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function SidebarLayout() {
  const { pathname } = useLocation();
  const noPaddingRoutes = ["/login", "/register", "/coupons/create", "/journeys/create", "/journeys/:id/edit", "/settings/product-list", "/settings/financial-management", "/settings/workflow-settings"];
  const editJourneyMatch = useMatch("/journeys/:id/edit");
  if (editJourneyMatch) {
    noPaddingRoutes.push(editJourneyMatch.pathname);
  }
  const editCouponMatch = useMatch("/coupons/:id/edit");
  const shouldHavePadding = !noPaddingRoutes.includes(pathname) && !editCouponMatch;
  return (
    <SidebarProvider
      style={{
        ["--sidebar-width" as string]: "280px",
        ["--sidebar-width-mobile" as string]: "280px",
      }}
    >
      <AppSidebar />
      <main className="flex-1 min-w-0 transition-all duration-200 ease-linear">
        <Navbar />
        <div className={cn(shouldHavePadding && "p-7.5")}>
          <Outlet />
        </div>
        {/* <div className="flex justify-end">
          <p>
            © 2025 CTRL. All Rights Reserved. Made with love by{" "}
            <span>Telegra!</span>
          </p>
        </div> */}
      </main>
    </SidebarProvider>
  );
}
