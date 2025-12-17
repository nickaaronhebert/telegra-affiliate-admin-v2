import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import CubeSVG from "@/assets/icons/Cube";

export interface MenuItem {
  title: string;
  scrollToId: string;
  icon: ReactNode;
}

interface DetailMenuSidebarProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  menuItems: MenuItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function DetailMenuSidebar({
  title,
  subtitle,
  icon = <CubeSVG />,
  menuItems,
  activeTab,
  onTabChange,
}: DetailMenuSidebarProps) {
  const handleMenuClick = (scrollToId: string) => {
    onTabChange(scrollToId);
    document.getElementById(scrollToId)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="w-lg max-w-80 rounded-[10px] shadow-[0px_2px_40px_0px_#00000014] h-fit">
      <div className="p-3">
        <div className="flex gap-3.5 items-center">
          <div className="w-12.5 h-12.5 flex justify-center items-center bg-lilac rounded-xl">
            {icon}
          </div>
          <div>
            <h4 className="text-base font-semibold text-black">{title}</h4>
            {subtitle && (
              <h6 className="text-xs font-normal text-[#3E4D61]">{subtitle}</h6>
            )}
          </div>
        </div>
      </div>
      {menuItems.map((item, index) => (
        <Button
          key={item.title}
          className={`flex justify-start items-center w-full rounded-none text-white text-sm p-5 font-medium cursor-pointer h-14! ${
            activeTab === item.scrollToId
              ? "bg-primary"
              : "bg-white text-black hover:bg-white"
          }
          ${
            index === menuItems.length - 1
              ? "rounded-bl-[10px] rounded-br-[10px]"
              : ""
          }`}
          onClick={() => handleMenuClick(item.scrollToId)}
        >
          {item.icon}
          {item.title}
        </Button>
      ))}
    </div>
  );
}
