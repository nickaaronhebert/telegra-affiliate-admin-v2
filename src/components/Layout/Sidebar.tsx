import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  Percent,
  Package,
  Route,
  Users,
  Stethoscope,
  FlaskConical,
  Settings,
  UserCog,
  Menu,
  ChevronLeft,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TelegraLogo } from "@/assets/icons/TelegraLogo";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, section: "main" },
  { name: "Orders", href: "/orders", icon: ShoppingCart, section: "commerce" },
  { name: "Subscriptions", href: "/subscriptions", icon: CreditCard, section: "commerce" },
  { name: "Coupons", href: "/coupons", icon: Percent, section: "commerce" },
  { name: "Products", href: "/products", icon: Package, section: "commerce" },
  { name: "Journeys", href: "/journeys", icon: Route, section: "commerce" },
  { name: "Patients", href: "/patients", icon: Users, section: "clinical" },
  { name: "Encounters", href: "/encounters", icon: Stethoscope, section: "clinical" },
  { name: "Lab Orders", href: "/lab-orders", icon: FlaskConical, section: "clinical" },
  { name: "Settings", href: "/settings", icon: Settings, section: "general" },
  { name: "Team Management", href: "/team", icon: UserCog, section: "general" },
  { name: "Messages", href: "/message", icon: MessageCircle, section: "general" },
];

const sectionLabels = {
  main: "",
  commerce: "COMMERCE",
  clinical: "CLINICAL",
  general: "GENERAL",
};

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const groupedItems = navigationItems.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof navigationItems>);

  return (
    <TooltipProvider delayDuration={100}>
      <aside
        className={`h-screen border-r bg-white flex flex-col transition-all duration-300 
          ${collapsed ? "w-20" : "w-64"}`}
      >
        {/* Header */}
        <div className="h-16 border-b flex items-center justify-between px-4">
          {/* Logo */}
          {!collapsed && (
            <TelegraLogo width={140} height={24} className="text-gray-900" />
          )}

          {/* Collapse Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
          {Object.entries(groupedItems).map(([section, items]) => (
            <div key={section}>
              {!collapsed && sectionLabels[section as keyof typeof sectionLabels] && (
                <div className="text-[11px] font-semibold text-gray-500 px-3 mb-3 tracking-wide uppercase">
                  {sectionLabels[section as keyof typeof sectionLabels]}
                </div>
              )}

              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Tooltip key={item.name}>
                      <TooltipTrigger asChild>
                        <NavLink
                          to={item.href}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                            ${isActive
                              ? "bg-neutral-100 text-neutral-900"
                              : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"}
                            `
                          }
                        >
                          <Icon className="h-5 w-5" />

                          {!collapsed && <span>{item.name}</span>}
                        </NavLink>
                      </TooltipTrigger>
                      {collapsed && (
                        <TooltipContent side="right">
                          {item.name}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </TooltipProvider>
  );
};
