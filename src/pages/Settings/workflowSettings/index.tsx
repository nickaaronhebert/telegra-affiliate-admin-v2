import React, { useMemo, useRef, useState } from "react";
import { useViewAllTagsQuery } from "@/redux/services/tagManagement";
import type { ICreateTagRequest } from "@/types/requests/tag";
import TagManagementSection from "./TagManagement";
import ProjectSettingsSection from "./ProjectSettings";
import WebhookManagementSection from "./WebhookManagement";
import HelpInformationSidebar from "./sidebar";
import { ArrowRight } from "lucide-react";

const COLOR_OPTIONS = [
  { label: "Red", text: "#C41E3A", background: "#FFA39E" },
  { label: "Volcano", text: "#DE6441", background: "#FFBB96" },
  { label: "Orange", text: "#D67315", background: "#FFD591" },
  { label: "Gold", text: "#D68D12", background: "#FFE89A" },
  { label: "Lime", text: "#7FB40A", background: "#EAFF8F" },
  { label: "Green", text: "#5BA43B", background: "#C7F0A7" },
  { label: "Cyan", text: "#35ACAF", background: "#87E8DE" },
  { label: "Blue", text: "#0C6FDA", background: "#DCF3FF" },
];

export default function WorkflowSettingsPage() {
  const tagsRef = useRef<HTMLDivElement | null>(null);
  const webhookRef = useRef<HTMLDivElement | null>(null);
  const projectsRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // RTK Query hooks
  const { data: tags = [] } = useViewAllTagsQuery();
  const [activeSection, setActiveSection] = useState("tags");
  const [form, setForm] = useState<ICreateTagRequest>({
    name: "",
    description: "",
    color: COLOR_OPTIONS[0].text,
    scope: {
      targetModel: "Order",
      owner: {
        model: "affiliate",
        id: "",
      },
    },
  });

  // Set owner id from first tag if available (for demo, adjust as needed)
  React.useEffect(() => {
    if (!form.scope.owner.id && tags.length > 0) {
      setForm((f: ICreateTagRequest) => ({
        ...f,
        scope: {
          ...f.scope,
          owner: {
            ...f.scope.owner,
            id: tags[0].scope.owner.id,
          },
        },
      }));
    }
  }, [tags]);

  // Track active section on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const sections = [
        { id: "tags", element: tagsRef.current },
        { id: "webhooks", element: webhookRef.current },
        { id: "projects", element: projectsRef.current },
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
      { id: "tags", label: "Tags", ref: tagsRef },
      { id: "webhooks", label: "Webhooks", ref: webhookRef },
      { id: "projects", label: "Project Settings", ref: projectsRef },
    ],
    []
  );

  const scrollTo = (r: React.RefObject<HTMLElement>) =>
    r.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="overflow-x-hidden">
      <div className="flex gap-4 w-full">
        {/* Left index */}
        <div className="flex-1 p-10 space-y-3">
          <div className="flex items-center gap-1.5 ml-7.5">
            <span className="text-[26px] font-semibold text-muted-foreground">
              Settings
            </span>
            <ArrowRight stroke="#63627F" />
            <span className="text-[26px] font-semibold">Workflow Settings</span>
          </div>
          <div className="flex gap-3 ">
            <aside className="w-55 shrink-0 sticky top-6">
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
            <div ref={contentRef} className="flex-1 min-w-0 ">
              <TagManagementSection sectionRef={tagsRef} />
              <WebhookManagementSection webhookRef={webhookRef} />
              <ProjectSettingsSection sectionRef={projectsRef} />
            </div>
          </div>
        </div>

        {/* Right sidebars (product + finance) */}
        <div className="w-[320px] shrink-0 flex flex-col gap-4">
          <HelpInformationSidebar />
        </div>
      </div>
    </div>
  );
}
