export default function HelpInformationSidebar() {
  return (
    <aside
      className="w-full lg:w-[320px] shrink-0 p-6 screen-h h-full"
      style={{ backgroundColor: "hsla(270, 32%, 94%, 1)" }}
    >
      <div className="space-y-4">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900">
          Help &amp; Information
        </h2>

        {/* Tag Management */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-800">
            Tag Management
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Create and manage tags to organize your orders, prescriptions, and
            other items.
          </p>
        </div>

        {/* Affiliate Tags */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-800">
            Affiliate Tags
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Affiliate-level tags are visible to all users in your organization
            and can be used by anyone in your affiliate.
          </p>
        </div>

        {/* User Tags */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-800">
            User Tags
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            User-level tags are personal to you and only visible in your account.
          </p>
        </div>

        {/* Tag Colors */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-800">
            Tag Colors
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Choose from a variety of colors to help visually organize and
            categorize your tags.
          </p>
        </div>

        {/* Webhooks */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-800">
            Webhooks
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            You can configure multiple webhooks. Set the URL, security tokens,
            and event types that are listened to.
          </p>
        </div>

        {/* Payment Mechanism */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-800">
            Payment Mechanism
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Determines the method of payment for the visit.
          </p>
        </div>

        {/* Asynchronous Visit Type */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-800">
            Asynchronous Visit Type
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Consultation with a Practitioner will be done in the text format
            (chat).
          </p>
        </div>

        {/* Synchronous Visit Type */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-800">
            Synchronous Visit Type
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Consultation with a Practitioner will be done in the phone call
            format.
          </p>
        </div>

        {/* Requires Approval */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-800">
            Requires Approval
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            All orders of this project will require your approval before they are
            sent to the pharmacy.
          </p>
        </div>

        {/* Support */}
        <div className="pt-4 border-t border-gray-300">
          <h3 className="text-sm font-semibold text-gray-800">Support</h3>
          <a
            href="mailto:support@telegra.com"
            className="text-sm text-primary hover:underline"
          >
            support@telegra.com
          </a>
        </div>
      </div>
    </aside>
  );
}
