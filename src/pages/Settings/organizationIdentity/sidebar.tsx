export default function CompanyDetailsSidebar() {
  return (
    <aside
      className="w-full lg:w-[320px] shrink-0 p-6"
      style={{ backgroundColor: "hsla(270, 32%, 94%, 1)" }}
    >
      <div className="space-y-6">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900">
          Help &amp; Information
        </h2>

        {/* Company Name */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-800">
            Company Name
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Will be displayed throughout the patient experience in emails.
          </p>
        </div>

        {/* Home Page URL */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-800">
            Home Page URL
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            This link will be used to redirect patients to your Home Page after clicking on the Affiliates Logo within the emails.
          </p>
        </div>

        {/* Correspondence Manager */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-800">
            Correspondence Manager
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            This field will be used in patient emails. The patients will be redirected for correspondence with the affiliate via email, either TelegraMD (shared) Portal, or your own Patient Portal.
          </p>
        </div>

        {/* Co-Branded */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-800">
            Co-Branded
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            This setting determines whether your Online Visit will be co-branded with Telegra or remain fully branded (but your logo will be displayed).
          </p>
        </div>

        {/* White-Labeled */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-800">
            White-Labeled
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            When enabled, your organization's branding will be displayed exclusively without any Telegra branding.
          </p>
        </div>

        {/* Support */}
        <div className="space-y-2 pt-4 border-t border-gray-300">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold">Support:</span> support@telegra.com
          </p>
        </div>
      </div>
    </aside>
  );
}
