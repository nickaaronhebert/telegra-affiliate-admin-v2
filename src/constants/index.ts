import User from "@/assets/icons/User";
import Affiliation from "@/assets/icons/User";
import Transmission from "@/assets/icons/User";
import Orders from "@/assets/icons/User";
import Transactions from "@/assets/icons/User";
import SettingsMain from "@/assets/icons/User";
import type { IconSVG } from "@/types/global/icon";
import InvoicesMain from "@/assets/icons/User";
import PatientIcon from "@/assets/icons/User";
import { Settings } from "lucide-react";
import Home from "@/assets/icons/User";

export interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<IconSVG>;
}

export const tabsConfig: TabConfig[] = [
  { id: "personal", label: "Personal Details", icon: User },
] as const;

export const organisationAdminItems = [
  // { title: "Dashboard", url: "/org/dashboard", icon: Dashboard },
  { title: "Orders", url: "/org/orders", icon: Orders },
  { title: "Transmissions", url: "/org/transmissions", icon: Transmission },
  { title: "Encounter", url: "/org/encounter", icon: Affiliation },
  { title: "Invoices", url: "/org/transactions", icon: Transactions },
  { title: "Patients", url: "/org/patients", icon: PatientIcon },
  { title: "Sub-organizations", url: "/org/sub-orgs", icon: Home },
  // { title: "Providers", url: "/org/providers", icon: Provider },
  { title: "Settings", url: "/org/settings", icon: Settings },
];

export const nestedOrgItems = [
  { title: "Providers", url: "/org/providers" },
  {
    title: "Pharmacies",
    url: "/org/pharmacies",
  },
  {
    title: "Medication Library",
    url: "/org/medications",
  },
  {
    title: "Webhooks",
    url: "/org/webhook",
  },
  {
    title: "Pharmacy Assignment",
    url: "/org/access-control",
  },
  { title: "Activity Log", url: "/org/activity-log" },
  { title: "My Settings", url: "/org/settings" },
];

export const nestedPharmacyItems = [
  {
    title: "Medication Library",
    url: "/pharmacy/medications/view-catalogue",
  },
  {
    title: "Organization",
    url: "/pharmacy/organizations",
  },
  { title: "Settings", url: "/pharmacy/settings" },
];

export const pharmacyAdminItems = [
  {
    title: "Transmissions",
    url: "/pharmacy/transmissions",
    icon: Transmission,
  },
  { title: "Invoices", url: "/pharmacy/invoices", icon: InvoicesMain },

  { title: "Settings", url: "/pharmacy/settings", icon: SettingsMain },
];

export const mockStats = {
  totalOrganizations: 247,
  totalPharmacies: 189,
  pendingInvites: 23,
  activeUsers: 1456,
  monthlyGrowth: 12.5,
  systemUptime: 99.9,
};

export const recentInvites = [
  {
    id: 1,
    email: "admin@healthcorp.com",
    type: "Organization",
    status: "Pending",
    date: "2024-01-15",
  },
  {
    id: 2,
    email: "manager@rxpharm.com",
    type: "Pharmacy",
    status: "Completed",
    date: "2024-01-14",
  },
  {
    id: 3,
    email: "director@medplus.com",
    type: "Organization",
    status: "Pending",
    date: "2024-01-14",
  },
  {
    id: 4,
    email: "admin@quickrx.com",
    type: "Pharmacy",
    status: "Completed",
    date: "2024-01-13",
  },
];

export const quickActions = [
  {
    title: "Invite Organization",
    description: "Send invitation to new healthcare organization",
    action: "Send Invite",
    variant: "default" as const,
  },
  {
    title: "Invite Pharmacy",
    description: "Onboard new pharmacy partner",
    action: "Send Invite",
    variant: "outline" as const,
  },
  {
    title: "Generate Report",
    description: "Create system usage and analytics report",
    action: "Generate",
    variant: "outline" as const,
  },
];

export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  USER: "user",
} as const;

export const PRODUCT_TYPES = {
  ONE_TIME: "ONE_TIME",
  SUBSCRIPTION_FIXED: "SUBSCRIPTION_FIXED",
  SUBSCRIPTION_VARIABLE: "SUBSCRIPTION_VARIABLE",
} as const;

export type ProductType = (typeof PRODUCT_TYPES)[keyof typeof PRODUCT_TYPES];

export const PRODUCT_TYPE_VARIANTS = {
  ONE_TIME: "oneTime",
  SUBSCRIPTION_FIXED: "subscriptionFixed",
  SUBSCRIPTION_VARIABLE: "subscriptionVariable",
} as const;

// Legacy alias for backward compatibility
export const productVariationType = {
  SUBSCRIPTION_VARIABLE: "SUBSCRIPTION_VARIABLE",
  SUBSCRIPTION_FIXED: "SUBSCRIPTION_FIXED",
  ONE_TIME: "ONE_TIME",
} as const;

export type ProductVariationType =
  (typeof productVariationType)[keyof typeof productVariationType];

export const GENDER_OPTIONS = {
  MALE: { label: "Male", value: "male" },
  FEMALE: { label: "Female", value: "female" },
} as const;

export type GenderOption =
  (typeof GENDER_OPTIONS)[keyof typeof GENDER_OPTIONS]["value"];

export const PAYMENT_MECHANISMS = {
  PatientPay: "patient_pay",
  AffiliatePay: "affiliate_pay",
} as const;

export const ExternalQuestionnaireSources = {
  TypeForm: "typeform",
} as const;

export type ExternalQuestionnaireSourcesType =
  (typeof ExternalQuestionnaireSources)[keyof typeof ExternalQuestionnaireSources];

export const QuestionnaireInstanceStatuses = {
  Filled: "filled",
  InProgress: "inprogress",
  ApprovedByProvider: "approved_by_provider",
  Stale: "stale",
  Expired: "expired",
  Completed: "completed",
};

export const CommunicationTemplateKeys = {
  USER_INVITED: "USER_INVITED",
  AFFILIATE_ADDED: "AFFILIATE_ADDED",
  FORGOT_PASSWORD: "FORGOT_PASSWORD",
  TWO_FACTOR_VERIFICATION: "TWO_FACTOR_VERIFICATION",
  ORDER_LINK: "ORDER_LINK",
  INVITE_PATIENT_COMPLETE_QUESTIONNAIRE:
    "INVITE_PATIENT_COMPLETE_QUESTIONNAIRE",
  REQUEST_SUBMITTED: "REQUEST_SUBMITTED",
  BILLING_UPDATE_LINK: "BILLING_UPDATE_LINK",
  MESSAGE_RECEIVED: "MESSAGE_RECEIVED",
  PRESCRIPTION_APPROVED: "PRESCRIPTION_APPROVED",
  CONSULTATION_FEE_TAKEN: "CONSULTATION_FEE_TAKEN",
  PRESCRIPTION_SENT_TO_PHARMACY: "PRESCRIPTION_SENT_TO_PHARMACY",
  SHIPPING_DETAILS_SET: "SHIPPING_DETAILS_SET",
} as const;

export type CommunicationTemplateKeys = typeof CommunicationTemplateKeys;

export const PaymentProcessors = {
  Stripe: "stripe",
  AuthNet: "authnet",
};

export const PAYMENT_PROCESSOR_KEYS = {
  STRIPE_PUBLISHER_KEY: "STRIPE_PUBLISHER_KEY",
  STRIPE_SECRET_KEY: "STRIPE_SECRET_KEY",
  PROCESSOR_TYPE: "PROCESSOR_TYPE",
};
export const AuthNetEnvironment = {
  Sandbox: "sandbox",
  Production: "production",
};

export const PAYMENT_BRANDS = {
  Visa: "Visa",
  Mastercard: "Mastercard",
  Amex: "Amex",
  Discover: "Discover",
} as const;

export const PAYMENT_MECHANISMS_TITLE = {
  patient_pay: "Patient",
  affiliate_pay: "Affiliate",
} as const;

export const ORDER_STATUS = {
  Started: "started",
  RequiresOrderSubmission: "requires_order_submission",
  RequiresAdminReview: "requires_admin_review",
  RequiresFeeWriteOff: "requires_fee_write_off",
  RequiresMedicalSpecialistAppointment:
    "requires_medical_specialist_appointment",
  RequiresProviderReview: "requires_provider_review",
  RequiresPharmacyDispatch: "requires_pharmacy_dispatch",
  RejectedByProvider: "rejected_by_provider",
  RequiresPharmacyData: "requires_pharmacy_data",
  RequiresPharmacyResponse: "requires_pharmacy_response",
  RequiresFulfillment: "requires_fulfillment",
  WaitingForAttachedQuestionnaire: "waiting_for_attached_questionnaire",
  PharmacyApproved: "pharmacy_approved",
  PharmacyRejected: "pharmacy_rejected",
  PharmacyDeliveryInProgress: "pharmacy_delivery_in_progress",
  PharmacyShipped: "pharmacy_shipped",
  Delivered: "delivered",
  Cancelled: "cancelled",
  Completed: "completed",
  Stale: "stale",
  Delayed: "delayed",
  RenewalPending: "renewal_pending",
  ProcessedExternally: "processed_externally",
  Failed: "failed",
  Submitted: "submitted",
  ShippingDepartment: "shipping_department",
  RequiresWaitingRoomEgress: "requires_waiting_room_egress",
  RequiresOrderProcessing: "requires_order_processing",
  RequiresAffiliateReview: "requires_affiliate_review",
  RequiresPrerequisiteCompletion: "requires_prerequisite_completion",
  OnHold: "on-hold",
} as const;

export const postPractitionerReviewOrderStatuses = [
  ORDER_STATUS.RequiresOrderProcessing,
  ORDER_STATUS.Completed,
  ORDER_STATUS.Cancelled,
];

export const STATUS_COLORS = {
  pending: {
    badge: "bg-blue-100 text-blue-800",
    label: "Pending",
  },
  "on-hold": {
    badge: "bg-yellow-100 text-yellow-800",
    label: "On Hold",
  },
  completed: {
    badge: "bg-green-100 text-green-800",
    label: "Completed",
  },
  cancelled: {
    badge: "bg-red-100 text-red-800",
    label: "Cancelled",
  },
  processing: {
    badge: "bg-blue-100 text-blue-800",
    label: "Processing",
  },
  started: {
    badge: "bg-blue-100 text-blue-800",
    label: "Started",
  },
  payment_intent_pending: {
    badge: "bg-yellow-100 text-yellow-800",
    label: "Payment Intent Pending",
  },
  payment_intent_succeeded: {
    badge: "bg-green-100 text-green-800",
    label: "Payment Intent Succeeded",
  },
  payment_intent_failed: {
    badge: "bg-red-100 text-red-800",
    label: "Payment Intent Failed",
  },
  payment_intent_canceled: {
    badge: "bg-red-100 text-red-800",
    label: "Payment Intent Canceled",
  },
} as const;

export const ECOMMERCE_PLATFORMS = {
  TELEGRA_COMMERCE: "telegra_commerce",
};

export const EVENT_TYPES = {
  PrescriptionRenew: "prescription_renew",
  SubscriptionsRenew: "subscription_renew",
  FormStarted: "form_started",
  ProductRequest: "product_request",
  NewStatusSetToRequest: "new_status_set_to_request",
  NoAvailableProviders: "no_available_providers",
  ProviderAssigned: "provider_was_assigned",
  ProviderReassigned: "provider_was_reassigned",
  BillingDetailsCompleted: "billing_details_completed",
  PrescriptionCancelled: "prescription_cancelled",
  ShippingDetailsSet: "shipping_details_set",
  ShipmentDelivered: "shipment_delivered",
  PrescriptionSentToPharmacy: "prescription_sent_to_pharmacy",
  GeneratingPrescription: "generating_prescription",
  PharmacyFulfilledPrescription: "pharmacy_fulfilled_prescription",
  PharmacyProcessingPrescription: "pharmacy_processing_prescription",
  PharmacySentPrescription: "pharmacy_sent_prescription",
  PharmacyRejectedPrescription: "pharmacy_rejected_prescription",
  AddressAppendedToOrder: "address_appended_to_order",
  AddressAppendedToSubscription: "address_appended_to_subscription",
  OrderSubmitted: "order_submitted",
  OrderPaymentCollected: "order_payment_collected",
  OrderCreated: "order_created",
  PrescriptionDocumentGenerated: "prescription_document_generated",
  InitializePrescriptionRenewal: "initialize_prescription_renewal",
  UnhandledEvent: "unhandled_event",
  PrescriptionRefill: "prescription_refill",
  ConsultationStatusUpdated: "consultation_status_updated",
  SendConsultationsPrescriptions: "send_consultations_prescriptions",
  RecommendationAccepted: "recommendation_accepted",
  RecommendationRejected: "recommendation_rejected",
  // AFFILIATE
  FormIntentResolved: "form_intent_resolved",
  ExternalOrderReceivedWoocommerce: "external_order_received",
  ExternalOrderReceivedWoocommerceError: "external_order_received_error",
  ExternalOrderReceivedGroupon: "external_order_received_groupon",
  AbandonedCart: "abandoned_cart",
  ConsultationBilledToPatient: "consultation-billed-to-patient",
  ConsultationBilledToAffiliate: "consultation-billed-to-affiliate",
};

export const VISIT_TYPES = {
  Asynchronous: "asynchronous",
  Synchronous: "synchronous",
  SynchronousConnectedPhone: "synchronous_connected_phone",
};

export const VISIT_STATUS = {
  Active: "active",
  Reassigned: "reassigned",
  Expired: "expired",
  Completed: "completed",
  CompletedForFutureUsage: "completed_for_future_usage",
};

export const PROJECT_PRESCRIPTION_DISPERSEMENT_MECHANISM = {
  Manual: "manual",
  Automatic: "automatic",
};

export const COMMUNICATION_TEMPLATE_KEYS = {
  USER_INVITED: "USER_INVITED",
  AFFILIATE_ADDED: "AFFILIATE_ADDED",
  FORGOT_PASSWORD: "FORGOT_PASSWORD",
  TWO_FACTOR_VERIFICATION: "TWO_FACTOR_VERIFICATION",
  ORDER_LINK: "ORDER_LINK",
  INVITE_PATIENT_COMPLETE_QUESTIONNAIRE:
    "INVITE_PATIENT_COMPLETE_QUESTIONNAIRE",
  REQUEST_SUBMITTED: "REQUEST_SUBMITTED",
  BILLING_UPDATE_LINK: "BILLING_UPDATE_LINK",
  MESSAGE_RECEIVED: "MESSAGE_RECEIVED",
  PRESCRIPTION_APPROVED: "PRESCRIPTION_APPROVED",
  CONSULTATION_FEE_TAKEN: "CONSULTATION_FEE_TAKEN",
  PRESCRIPTION_SENT_TO_PHARMACY: "PRESCRIPTION_SENT_TO_PHARMACY",
  SHIPPING_DETAILS_SET: "SHIPPING_DETAILS_SET",
};

export const TAG_TARGET_MODELS = [
  { label: "Order", value: "Order" },
  { label: "Journey Template", value: "JourneyTemplate" },
  { label: "Ecommerce Product", value: "EcommerceProduct" },
] as const;

export type TagTargetModel = (typeof TAG_TARGET_MODELS)[number]["value"];
