import { Link, useParams, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { journeySchema } from "@/schemas/journeySchema";
import { useViewJourneyByIdQuery, useUpdateJourneyMutation } from "@/redux/services/journey";
import { getLocalStorage } from "@/lib/utils";
import { LOCAL_STORAGE_KEYS } from "@/constants";
import type { User } from "@/types/global/commonTypes";
import { toast } from "sonner";
import EditJourneyName from "./EditJourneyName";
import EditJourneyStepper from "./EditJourneyStepper";
import EditJourneySuccess from "./EditJourneySuccess";
import PrepareEditJourney from "./PrepareEditJourney";
import { useState, useEffect } from "react";

const EDIT_JOURNEY_STEPS = {
  JOURNEY_NAME: "journey-name",
  LOADING: "loading",
  STEPPER: "stepper",
  SUCCESS: "success",
} as const;

type EditJourneyStep =
  (typeof EDIT_JOURNEY_STEPS)[keyof typeof EDIT_JOURNEY_STEPS];

const EditJourneyPage = () => {
  const { id: journeyName } = useParams(); // This is actually the journey name from the route
  const navigate = useNavigate();
  const { data: journeyData, isLoading, refetch } = useViewJourneyByIdQuery(journeyName!);
  const [updateJourney, { isLoading: isUpdating }] = useUpdateJourneyMutation();

  const [currentStep, setCurrentStep] = useState<EditJourneyStep>(
    EDIT_JOURNEY_STEPS.JOURNEY_NAME
  );

  const form = useForm<z.infer<typeof journeySchema>>({
    resolver: zodResolver(journeySchema),
    defaultValues: {
      affiliate: "",
      name: "",
      productVariations: [],
      preCheckoutQuestionnaire: [],
    },
  });

  // Prefill data when loaded
  useEffect(() => {
    if (journeyData) {
      // Handle both cases: data.data (expected) vs direct data (actual API response)
      const j = (journeyData as any).data || (journeyData as any);
      console.log("Processing journey data for form:", j);
      
      form.reset({
        affiliate: j.affiliate?.id || j.affiliate || "",
        name: j.name || "",
        productVariations:
          j.productVariations?.map((pv: any) => ({
            productVariation: typeof pv.productVariation === "object" ? pv.productVariation.id : pv.productVariation || pv.id,
            quantity: pv.quantity || 1,
            pricePerUnitOverride: pv.pricePerUnitOverride,
            billingCycleLength: pv.billingCycleLength,
          })) || [],
        preCheckoutQuestionnaire:
          j.preCheckoutQuestionnaire?.map((q: any) => ({
            questionnaire: typeof q.questionnaire === "object" ? q.questionnaire._id || q.questionnaire.id : q.questionnaire || q._id,
            isPreAuthQuestionnaire: q.isPreAuthQuestionnaire || false,
          })) || [],
        theme: j.theme || {
          layout: "GUIDED_CARDS",
          inheritFromAffiliate: false,
          brandColors: {
            primary: "#5456f4",
            accent: "#d8b8f3",
            neutral: "#fcfcff",
          },
        },
        metadata: j.metadata || {},
      });
    }
  }, [journeyData, form]);

  function handleJourneyNameNext(values: z.infer<typeof journeySchema>) {
    if (!values.name?.trim()) {
      return;
    }

    setCurrentStep(EDIT_JOURNEY_STEPS.LOADING);
    setTimeout(() => {
      setCurrentStep(EDIT_JOURNEY_STEPS.STEPPER);
    }, 1200);
  }

  async function handleStepperSubmit(values: z.infer<typeof journeySchema>) {
    try {
      const user = getLocalStorage<User>(LOCAL_STORAGE_KEYS.USER);

      if (!user?.affiliate) {
        console.error("No affiliate found in user data");
        return;
      }

      if (!journeyData) {
        console.error("No journey data available for update");
        return;
      }

      // Handle both cases: data.data vs direct data
      const j = (journeyData as any).data || (journeyData as any);
      const actualJourneyId = j.id || j._id;

      const journeyUpdateData = {
        affiliate: user.affiliate,
        name: values.name,
        productVariations: values.productVariations
          .filter(
            (pv) => pv.productVariation && pv.productVariation.trim() !== ""
          )
          .map((pv) => ({
            productVariation: pv.productVariation,
            quantity: pv.quantity,
            ...(pv.pricePerUnitOverride && {
              pricePerUnitOverride: pv.pricePerUnitOverride,
            }),
            ...(pv.billingCycleLength && {
              billingCycleLength: pv.billingCycleLength,
            }),
          })),
        preCheckoutQuestionnaire: (values.preCheckoutQuestionnaire || [])
          .filter((q) => q.questionnaire && q.questionnaire.trim() !== "")
          .map((q) => ({
            questionnaire: q.questionnaire,
            isPreAuthQuestionnaire: q.isPreAuthQuestionnaire,
          })),
        ...(values.theme && { theme: values.theme }),
        ...(values.metadata && { metadata: values.metadata }),
      };

      console.log("Submitting journey update with data:", journeyUpdateData);

      await updateJourney({ journeyId: actualJourneyId, ...journeyUpdateData }).unwrap();
      
      console.log("Journey update successful, triggering refetch");
      // Trigger refetch to get fresh data after successful update
      refetch();
      
      toast.success("Journey updated successfully!", {
        duration: 2000,
      });
      setCurrentStep(EDIT_JOURNEY_STEPS.SUCCESS);
    } catch (error: unknown) {
      const err = error as {
        status?: number;
        data?: {
          message?: string;
        };
      };
      const message =
        err?.data?.message || "Failed to update journey. Please try again.";
      toast.error(message, {
        duration: 2000,
      });
    }
  }

  function handleEditAnother() {
    navigate(ROUTES.JOURNEYS_PATH);
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="bg-lilac py-3 px-12">
        <Link
          to={ROUTES.JOURNEYS_PATH}
          className="font-normal text-sm text-muted-foreground"
        >
          {"<- Back to Journeys"}
        </Link>

        <h1 className="text-2xl font-bold mt-1">
          {currentStep === EDIT_JOURNEY_STEPS.STEPPER
            ? form.watch("name") || "Edit Journey"
            : `Edit Journey: ${(journeyData as any)?.name || ""}`}
        </h1>
      </div>

      <div className="px-10">
        <div
          className="rounded-[15px] mx-auto p-6"
        >
          {currentStep === EDIT_JOURNEY_STEPS.JOURNEY_NAME && (
            <EditJourneyName form={form} onNext={handleJourneyNameNext} />
          )}

          {currentStep === EDIT_JOURNEY_STEPS.LOADING && (
            <PrepareEditJourney />
          )}

          {currentStep === EDIT_JOURNEY_STEPS.STEPPER && journeyData && (
            <EditJourneyStepper
              form={form}
              onSubmit={handleStepperSubmit}
              isSubmitting={isUpdating}
              existingJourneyData={journeyData}
            />
          )}

          {currentStep === EDIT_JOURNEY_STEPS.SUCCESS && (
            <EditJourneySuccess onEditAnother={handleEditAnother} />
          )}
        </div>
      </div>
    </>
  );
};

export default EditJourneyPage;
