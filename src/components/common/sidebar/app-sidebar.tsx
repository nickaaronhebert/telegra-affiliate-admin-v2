import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { useLocation, Link } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { ChevronDown, MessageCircle } from "lucide-react";
import { useState } from "react";

import CollapsedCTRLSVG from "@/assets/icons/CollapsedCTRL";
import { TelegraLogo } from "@/assets/icons/TelegraLogo";
import { SidebarToggle } from "./sidebar-toggle";
import CouponsSVG from "@/assets/icons/Coupons";
import JourneySVG from "@/assets/icons/Journeys";
import OrdersSVG from "@/assets/icons/Orders";
import SubscriptionsSVG from "@/assets/icons/Subscriptions";
import ProductsSVG from "@/assets/icons/Products";
import PatientsSVG from "@/assets/icons/Patients";
import EncountersSVG from "@/assets/icons/Encounters";
import LabOrdersSVG from "@/assets/icons/LabOrders";
import SettingsSVG from "@/assets/icons/Settings";
import TeamManagementSVG from "@/assets/icons/TeamManagement";
import { useGetAffiliateDetailsQuery } from "@/redux/services/organizationIdentity";
import { ECOMMERCE_PLATFORMS } from "@/constants";
import { ROUTES } from "@/constants/routes";


const commerce = [
  { title: "Orders", url: ROUTES.ORDERS, icon: OrdersSVG },
  { title: "Subscriptions", url: ROUTES.SUBSCRIPTIONS, icon: SubscriptionsSVG },
  { title: "Coupons", url: ROUTES.COUPONS, icon: CouponsSVG },
  { title: "Products", url: ROUTES.PRODUCTS, icon: ProductsSVG },
  { title: "Journeys", url: ROUTES.JOURNEYS, icon: JourneySVG },
];

const clinical = [
  { title: "Patients", url: ROUTES.PATIENTS, icon: PatientsSVG },
  { title: "Encounters", url: ROUTES.ENCOUNTERS, icon: EncountersSVG },
  { title: "Lab Orders", url: ROUTES.LAB_ORDERS, icon: LabOrdersSVG },
];

const settingsSubItems = [
  { title: "Organization Identity", url: ROUTES.ORGANIZATION_IDENTITY_PATH },
  { title: "Workflow Settings", url: ROUTES.WORKFLOW_SETTINGS_PATH },
  { title: "Financial Management", url: ROUTES.FINANCIAL_MANAGEMENT },
  { title: "Product List", url: ROUTES.PRODUCT_VARIATIONS_PATH },
];

export function AppSidebar() {
  const { state, open, toggleSidebar } = useSidebar();
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { data: affiliateDetails } = useGetAffiliateDetailsQuery();
  
  // Create general menu items conditionally
  const general = [
    ...(affiliateDetails?.affiliateChatSystem 
      ? [{ title: "Messages", url: ROUTES.MESSAGE, icon: MessageCircle }] 
      : []
    ),
    { title: "Team Management", url: ROUTES.TEAM, icon: TeamManagementSVG },
  ];
  
  // Check if ecommerce module is enabled
  const checkEcommerceModule =
    affiliateDetails?.ecommerceModuleEnabled &&
    affiliateDetails?.ecommercePlatform ===
      ECOMMERCE_PLATFORMS.TELEGRA_COMMERCE;

  const isActive = (item: any) => {
    return (
      location.pathname === item.url ||
      location.pathname.startsWith(item.url + "/")
    );
  };

  const renderMenu = (items: any[]) =>
    items.map((item) => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild isActive={isActive(item)}>
          <Link
            to={item.url}
            className={`flex items-center gap-2 px-3 py-0 rounded-md transition-colors ${
              isActive(item)
                ? "bg-[#F7F1FD] !text-[#5456AD]"
                : "!text-[#000] hover:!text-[#5456AD] hover:bg-[#F7F1FD]"
            }`}
          >
            <item.icon
              className={`w-[26px] h-[26px] ${
                isActive(item) ? "text-[#5456AD]" : "group-hover:text-[#5456AD]"
              }`}
            />
            {open && (
              <span className="font-['Inter'] font-medium text-[15px] leading-[22px] tracking-[-0.2px] align-middle">
                {item.title}
              </span>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  return (
    <Sidebar
      collapsible="icon"
      className="border-none shadow-[0px_2px_40px_0px_#0000000D] z-50"
    >
      <SidebarToggle isOpen={open} setIsOpen={toggleSidebar} />

      <SidebarHeader className="bg-white">
        {state === "collapsed" ? (
          <div className="mt-1 flex justify-center">
            <CollapsedCTRLSVG />
          </div>
        ) : (
          <div className="flex justify-center my-5">
            <TelegraLogo width={176} height={32} />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-1 bg-white">
        {/* Dashboard */}
        {/* <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenu([dashboardItem])}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}

        {/* COMMERCE - Only show if ecommerce module is enabled */}
        {checkEcommerceModule && (
          <SidebarGroup>
            {open && (
              <h4 className="px-4 font-['Inter'] font-medium text-[10px] leading-[22px] tracking-[1.8px] align-middle uppercase mt-0.5 mb-0.5 text-gray-400">
                COMMERCE
              </h4>
            )}
            <SidebarGroupContent>
              <SidebarMenu>{renderMenu(commerce)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* CLINICAL */}
        <SidebarGroup>
          {open && (
            <h4 className="px-4 font-['Inter'] font-medium text-[10px] leading-[22px] tracking-[1.8px] align-middle uppercase mt-0.5 mb-0.5 text-gray-400">
              CLINICAL
            </h4>
          )}
          <SidebarGroupContent>
            <SidebarMenu>{renderMenu(clinical)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* GENERAL */}
        <SidebarGroup>
          {open && (
            <h4 className="px-4 font-['Inter'] font-medium text-[10px] leading-[22px] tracking-[1.8px] align-middle uppercase mt-0.5 mb-0.5 text-gray-400">
              GENERAL
            </h4>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Settings with submenu */}
              <Collapsible
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={`flex items-center gap-2 px-3 py-0 rounded-md transition-colors ${
                        location.pathname.startsWith("/settings")
                          ? "bg-[#F7F1FD] !text-[#5456AD]"
                          : "!text-[#000] hover:!text-[#5456AD] hover:bg-[#F7F1FD]"
                      }`}
                    >
                      <SettingsSVG
                        className={`!w-[25px] !h-[25px] ${
                          location.pathname.startsWith("/settings")
                            ? "text-[#5456AD]"
                            : "group-hover:text-[#5456AD]"
                        }`}
                      />
                      {open && (
                        <>
                          <span className="font-['Inter'] font-medium text-[15px] leading-[22px] tracking-[-0.2px] flex-1">
                            Settings
                          </span>
                          <ChevronDown
                            className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                              settingsOpen ? "rotate-90" : ""
                            }`}
                          />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {open && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {settingsSubItems.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link
                                to={subItem.url}
                                className={`flex items-center text-sm font-normal px-3 py-1.5 rounded-md transition-colors ${
                                  location.pathname === subItem.url
                                    ? "bg-[#F7F1FD] !text-[#5456AD]"
                                    : "!text-[#000] hover:!text-[#5456AD] hover:bg-[#F7F1FD]"
                                }`}
                              >
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>

              {/* Other general menu items */}
              {affiliateDetails?.affiliateChatSystem && renderMenu(general)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
