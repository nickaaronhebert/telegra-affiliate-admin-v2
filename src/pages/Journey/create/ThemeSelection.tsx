import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import type { z } from "zod";
import type { journeySchema } from "@/schemas/journeySchema";
import { useLazyGetFrontendConfigurationQuery } from "@/redux/services/brandIdentity";
import { toast } from "sonner";

interface ThemeSelectionProps {
  onBack: () => void;
  onContinue: () => void;
  currentTheme?: z.infer<typeof journeySchema>["theme"];
  onThemeChange?: (theme: z.infer<typeof journeySchema>["theme"]) => void;
}

interface LayoutTheme {
  id: string;
  name: string;
  description: string;
  isSelected?: boolean;
}

const ThemeSelection = ({ 
  // onContinue, 
  currentTheme,
  onThemeChange 
}: ThemeSelectionProps) => {
  const [selectedTheme, setSelectedTheme] = useState<string>(
    currentTheme?.layout?.toLowerCase().replace(/_/g, "-") || "guided-cards"
  );

  const [brandColors, setBrandColors] = useState({
    primary: currentTheme?.brandColors?.primary || "#5456f4",
    accent: currentTheme?.brandColors?.accent || "#d8b8f3",
    neutral: currentTheme?.brandColors?.neutral || "#fcfcff",
  });

  const [getFrontendConfiguration, { isLoading: isLoadingFrontendConfig }] = useLazyGetFrontendConfigurationQuery();

  // Sync with form when component mounts or currentTheme changes
  useEffect(() => {
    if (currentTheme) {
      setSelectedTheme(currentTheme.layout?.toLowerCase().replace(/_/g, "-") || "guided-cards");
      setBrandColors({
        primary: currentTheme.brandColors?.primary || "#5456f4",
        accent: currentTheme.brandColors?.accent || "#d8b8f3",
        neutral: currentTheme.brandColors?.neutral || "#fcfcff",
      });
    }
  }, [currentTheme]);

  // Sync brand color changes to parent form in real-time
  useEffect(() => {
    if (onThemeChange) {
      const themeLayout = selectedTheme.toUpperCase().replace(/-/g, "_");
      const updatedTheme = {
        layout: themeLayout,
        inheritFromAffiliate: currentTheme?.inheritFromAffiliate || false,
        brandColors,
      };
      console.log("Syncing theme to form in real-time:", updatedTheme);
      onThemeChange(updatedTheme);
    }
  }, [selectedTheme, brandColors, currentTheme, onThemeChange]);

  const layoutThemes: LayoutTheme[] = [
    {
      id: "guided-cards",
      name: "Guided Cards",
      description: "Step-by-step card-based interface with progress indicator",
    },
  ];

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  const handleColorChange = (
    colorType: "primary" | "accent" | "neutral",
    value: string
  ) => {
    setBrandColors((prev) => ({
      ...prev,
      [colorType]: value,
    }));
  };

  // const handleContinue = () => {
  //   // Convert theme id back to uppercase format for storage
  //   const themeLayout = selectedTheme.toUpperCase().replace(/-/g, "_");
    
  //   const updatedTheme = {
  //     layout: themeLayout,
  //     inheritFromAffiliate: currentTheme?.inheritFromAffiliate || false,
  //     brandColors,
  //   };

  //   // Notify parent of theme changes
  //   if (onThemeChange) {
  //     onThemeChange(updatedTheme);
  //   }

  //   // Log the theme being sent
  //   console.log("Theme being sent on continue:", updatedTheme);

  //   onContinue();
  // };

  // const applyFromAccountSettings = () => {
  //   console.log("Applying colors from account settings");
  // };

  const getColorFromFrontendConfigStyles = (
    styles: any[] | undefined,
    variableName: string,
    defaultValue: string
  ): string => {
    if (!styles || styles.length === 0) return defaultValue;
    const globalStyle = styles.find((s) => s.elementType === "global");
    if (!globalStyle) return defaultValue;
    const color = globalStyle.colors.find((c) => c.variableName === variableName);
    return color?.variableValue || defaultValue;
  };

  const handleApplyFromAccountSettings = async () => {
    try {
      const result = await getFrontendConfiguration().unwrap();
      setBrandColors({
        primary: getColorFromFrontendConfigStyles(
          result.embeddedStyles,
          "--theme-primary",
          "#5456f4"
        ),
        accent: getColorFromFrontendConfigStyles(
          result.embeddedStyles,
          "--theme-secondary",
          "#d8b8f3"
        ),
        neutral: getColorFromFrontendConfigStyles(
          result.embeddedStyles,
          "--theme-light",
          "#fcfcff"
        ),
      });
      toast.success("Brand settings applied successfully!", { duration: 1500 });
    } catch (err) {
      console.error("Failed to import brand settings:", err);
      toast.error("Failed to import brand settings. Please try again.", { duration: 3000 });
    }
  };

  return (
    <>
      <div className="flex flex-col mb-6">
        <span className="text-2xl font-medium">Theme and Branding</span>
        <span className="text-base text-[#63627F]">
          Customize the look and feel of your journey to match your brand.
        </span>
      </div>

      <div className="bg-white space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-1">
              Layout Theme
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {layoutThemes.map((theme) => (
              <div
                key={theme.id}
                className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedTheme === theme.id
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleThemeSelect(theme.id)}
              >
                {selectedTheme === theme.id && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">{theme.name}</h4>
                  <p className="text-sm text-gray-600">{theme.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-base font-medium text-gray-900">
              Brand Colors
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-[#7B828A]">
                Primary
              </label>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-10 rounded border pointer"
                  style={{ backgroundColor: brandColors.primary }}
                />
                <input
                  type="text"
                  value={brandColors.primary}
                  onChange={(e) => handleColorChange("primary", e.target.value)}
                  className="flex-1 px-3 py-3 text-sm bg-[#EFE9F4] rounded"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#7B828A]">
                Accent
              </label>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-10 rounded border pointer"
                  style={{ backgroundColor: brandColors.accent }}
                />
                <input
                  type="text"
                  value={brandColors.accent}
                  onChange={(e) => handleColorChange("accent", e.target.value)}
                  className="flex-1 px-3 py-3 text-sm bg-[#EFE9F4] rounded"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#7B828A]">
                Neutral
              </label>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-10 rounded border pointer"
                  style={{ backgroundColor: brandColors.neutral }}
                />
                <input
                  type="text"
                  value={brandColors.neutral}
                  onChange={(e) => handleColorChange("neutral", e.target.value)}
                  className="flex-1 px-3 py-3 text-sm bg-[#EFE9F4] rounded"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleApplyFromAccountSettings}
              disabled={isLoadingFrontendConfig}
              className="px-4 py-2 text-sm pointer font-medium bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingFrontendConfig ? "IMPORTING..." : "APPLY FROM MY ACCOUNT SETTINGS"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThemeSelection;
