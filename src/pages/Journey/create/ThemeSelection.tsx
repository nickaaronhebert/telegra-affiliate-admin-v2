import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface ThemeSelectionProps {
  onBack: () => void;
  onContinue: () => void;
}

interface LayoutTheme {
  id: string;
  name: string;
  description: string;
  isSelected?: boolean;
}

const ThemeSelection = ({ onBack, onContinue }: ThemeSelectionProps) => {
  const [selectedTheme, setSelectedTheme] = useState<string>("guided-cards");

  const layoutThemes: LayoutTheme[] = [
    {
      id: "guided-cards",
      name: "Guided Cards",
      description: "Step-by-step card-based interface with progress indicator",
    },
    // {
    //   id: "express-minimal",
    //   name: "Express Minimal",
    //   description: "Streamlined single-page checkout for faster conversion"
    // }
  ];

  const [brandColors, setBrandColors] = useState({
    primary: "#5456f4",
    accent: "#d8b8f3",
    neutral: "#fcfcff",
  });

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

  const applyFromAccountSettings = () => {
    console.log("Applying colors from account settings");
  };

  return (
    <>
      <div className="flex flex-col mb-6">
        <span className="text-lg font-semibold">Theme and Branding</span>
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
            <h3 className="text-base font-medium text-gray-900 mb-1">
              Brand Colors
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Primary
              </label>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-8 rounded border"
                  style={{ backgroundColor: brandColors.primary }}
                />
                <input
                  type="text"
                  value={brandColors.primary}
                  onChange={(e) => handleColorChange("primary", e.target.value)}
                  className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Accent
              </label>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-8 rounded border"
                  style={{ backgroundColor: brandColors.accent }}
                />
                <input
                  type="text"
                  value={brandColors.accent}
                  onChange={(e) => handleColorChange("accent", e.target.value)}
                  className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Neutral
              </label>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-8 rounded border"
                  style={{ backgroundColor: brandColors.neutral }}
                />
                <input
                  type="text"
                  value={brandColors.neutral}
                  onChange={(e) => handleColorChange("neutral", e.target.value)}
                  className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={applyFromAccountSettings}
              className="px-4 py-2 text-sm font-medium bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              APPLY FROM MY ACCOUNT SETTINGS
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 gap-2.5 border-t border-dashed border-gray-300">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="rounded-full min-h-[48px] min-w-[130px] text-[14px] font-semibold mt-6 cursor-pointer"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onContinue}
          className="rounded-full min-h-[48px] min-w-[130px] text-[14px] font-semibold text-white mt-6 cursor-pointer"
        >
          Save & Continue
        </Button>
      </div>
    </>
  );
};

export default ThemeSelection;
