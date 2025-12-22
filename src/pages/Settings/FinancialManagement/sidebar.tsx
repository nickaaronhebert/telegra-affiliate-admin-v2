export default function FinancialManagementSidebar() {
  return (
    <aside
      className="w-[320px] shrink-0 p-6"
      style={{ backgroundColor: "hsla(270, 32%, 94%, 1)" }}
    >
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Help &amp; Information</h2>

        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold ">Company Name</h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              Will be displayed throughout the patient experience in emails.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold ">Home Page URL</h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              This link will be used to redirect patients to your Home Page
              after clicking on the Affiliates Logo within the emails.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold ">Correspondence Manager</h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              This field will be used in patient emails. The patients will be
              redirected for correspondence with the affiliate via email, either
              TelegraMD (shared) Portal, or your own Patient Portal.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold ">Co-Branded</h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              This setting determines whether your Online Visit will be
              co-branded with Telegra or remain fully branded (your logo will
              still be displayed).
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold ">Logo</h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              We will use this image where appropriate and display it as a logo.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold ">Communications</h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              You can activate each of the communication emails sent to
              patients.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-300">
          <h3 className="text-xs font-semibold ">Support</h3>
          <a
            href="mailto:support@telegra.com"
            className="text-xs text-primary hover:underline"
          >
            support@telegra.com
          </a>
        </div>
      </div>
    </aside>
  );
}
