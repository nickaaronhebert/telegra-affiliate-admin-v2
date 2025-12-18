import React, { useMemo, useRef, useState } from "react";
import CompanyDetailsSection from "./CompanyDetailsSection";
import CommunicationsSection from "./CommunicationsSection";
import CompanyDetailsSidebar from "./sidebar";

export const OrganizationIdentityPage = () => {
  const companyDetailsRef = useRef<HTMLDivElement>(null);
  const communicationsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState("company-details");

  // Track active section on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const sections = [
        { id: "company-details", element: companyDetailsRef.current },
        { id: "communications", element: communicationsRef.current },
      ];

      for (const section of sections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(section.id);
          }
        }
      }
    };

    const container = contentRef.current?.parentElement;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const sections = useMemo(
    () => [
      { id: "company-details", label: "Company Details", ref: companyDetailsRef },
      { id: "communications", label: "Communications", ref: communicationsRef },
    ],
    []
  );

  const scrollTo = (r: React.RefObject<HTMLElement>) =>
    r.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="overflow-x-hidden">
      <div className="flex gap-4 w-full">
        {/* Left sidebar navigation */}
        <aside className="w-[220px] shrink-0 sticky top-6">
          <div
            className="rounded-md space-y-4 sticky top-6 bg-white p-2 mx-6"
            style={{ boxShadow: "0px 2px 40px 0px #00000014" }}
          >
            <nav className="space-y-2">
              {sections.map((s) => (
                <button
                  key={s.id}
                  className={`text-left w-full pointer text-sm p-3 rounded-md transition-colors ${
                    activeSection === s.id
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "hover:bg-primary hover:text-white"
                  }`}
                  onClick={() => scrollTo(s.ref as any)}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div ref={contentRef} className="flex-1 min-w-0 p-6 space-y-8">
          <CompanyDetailsSection sectionRef={companyDetailsRef} />
          <CommunicationsSection sectionRef={communicationsRef} />
        </div>

        {/* Right sidebar (help information) */}
        <div className="w-[320px] shrink-0 flex flex-col gap-4">
          <CompanyDetailsSidebar />
        </div>
      </div>
    </div>
  );
};