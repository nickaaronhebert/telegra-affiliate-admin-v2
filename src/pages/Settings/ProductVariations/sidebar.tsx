export default function ProductVariationsSidebar() {
  return (
    <aside
      className="w-full lg:w-[320px] shrink-0 p-6 h-[calc(100vh-80px)]"
      style={{ backgroundColor: "hsla(270, 32%, 94%, 1)" }}
    >
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Help &amp; Information
        </h2>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-800">
            Product Variation List
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Here is the list of product variations you are utilizing with
            TelegraMD.
          </p>
        </div>

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
