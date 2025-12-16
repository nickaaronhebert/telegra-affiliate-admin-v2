// Main Pages
export { DashboardPage } from "./DashboardPage";
export { SubscriptionsPage } from "./SubscriptionsPage";
export { default as CouponsPage } from "./Coupons";
export { default as CouponDetailsPage } from "./Coupons/details";


export const EncountersPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Encounters</h1>
    <div className="bg-white p-8 rounded-lg text-center">
      <p className="text-gray-500">Medical encounters interface</p>
    </div>
  </div>
);

export const LabOrdersPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Lab Orders</h1>
    <div className="bg-white p-8 rounded-lg text-center">
      <p className="text-gray-500">Laboratory orders interface</p>
    </div>
  </div>
);

export const SettingsPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
    <div className="bg-white p-8 rounded-lg text-center">
      <p className="text-gray-500">Application settings interface</p>
    </div>
  </div>
);
