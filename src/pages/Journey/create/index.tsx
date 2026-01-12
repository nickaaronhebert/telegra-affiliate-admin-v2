import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { journeySchema } from "@/schemas/journeySchema";
import { useCreateJourneyMutation } from "@/redux/services/journey";
import { getLocalStorage } from "@/lib/utils";
import { LOCAL_STORAGE_KEYS } from "@/constants";
import type { User } from "@/types/global/commonTypes";
import { toast } from "sonner";
import JourneyName from "./JourneyName";
import PrepareJourney from "./PrepareJourney";
import JourneyStepper from "./JourneyStepper";
import JourneySuccess from "./JourneySuccess";
import { useState } from "react";

const JOURNEY_STEPS = {
  JOURNEY_NAME: "journey-name",
  LOADING: "loading",
  STEPPER: "stepper",
  SUCCESS: "success",
} as const;

type JourneyStep = (typeof JOURNEY_STEPS)[keyof typeof JOURNEY_STEPS];

const CreateJourneyPage = () => {
  const [createJourney, { isLoading: isCreating }] = useCreateJourneyMutation();
  const [currentStep, setCurrentStep] = useState<JourneyStep>(
    JOURNEY_STEPS.JOURNEY_NAME
  );

  const form = useForm<z.infer<typeof journeySchema>>({
    resolver: zodResolver(journeySchema),
    defaultValues: {
      affiliate: "",
      name: "",
      productVariations: [
        {
          productVariation: "",
          quantity: 1,
          pricePerUnitOverride: undefined,
          billingCycleLength: undefined,
        },
      ],
      preCheckoutQuestionnaire: [],
      theme: {
        layout: "GUIDED_CARDS",
        inheritFromAffiliate: false,
        brandColors: {
          primary: "#5456f4",
          accent: "#d8b8f3",
          neutral: "#fcfcff",
        },
      },
      metadata: {},
    },
  });

  function handleJourneyNameNext(values: z.infer<typeof journeySchema>) {
    if (!values.name || values.name.trim() === "") {
      console.log("Name validation failed");
      return;
    }
    setCurrentStep(JOURNEY_STEPS.LOADING);

    setTimeout(() => {
      setCurrentStep(JOURNEY_STEPS.STEPPER);
    }, 2000);
  }

  function handleCreateAnother() {
    form.reset({
      affiliate: "",
      name: "",
      productVariations: [
        {
          productVariation: "",
          quantity: 1,
          pricePerUnitOverride: undefined,
          billingCycleLength: undefined,
        },
      ],
      preCheckoutQuestionnaire: [],
      theme: {
        layout: "GUIDED_CARDS",
        inheritFromAffiliate: false,
        brandColors: {
          primary: "#5456f4",
          accent: "#d8b8f3",
          neutral: "#fcfcff",
        },
      },
      metadata: {},
    });

    setCurrentStep(JOURNEY_STEPS.JOURNEY_NAME);
  }

  async function handleStepperSubmit(values: z.infer<typeof journeySchema>) {
    try {
      const user = getLocalStorage<User>(LOCAL_STORAGE_KEYS.USER);

      if (!user?.affiliate) {
        console.error("No affiliate found in user data");
        return;
      }
      const journeyData = {
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
      await createJourney(journeyData).unwrap();
      // Show success toast
      toast.success("Journey created successfully!", {
        duration: 2000,
      });
      setCurrentStep(JOURNEY_STEPS.SUCCESS);
    } catch (error: unknown) {
      const err = error as {
        status?: number;
        data?: {
          message?: string;
        };
      };
      const message =
        err?.data?.message || "Failed to create journey. Please try again.";
      toast.error(message, {
        duration: 2000,
      });
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case JOURNEY_STEPS.JOURNEY_NAME:
        return <JourneyName form={form} onSubmit={handleJourneyNameNext} />;
      case JOURNEY_STEPS.LOADING:
        return <PrepareJourney />;
      case JOURNEY_STEPS.STEPPER:
        return (
          <JourneyStepper
            form={form}
            onSubmit={handleStepperSubmit}
            isSubmitting={isCreating}
          />
        );
      case JOURNEY_STEPS.SUCCESS:
        return <JourneySuccess onCreateAnother={handleCreateAnother} />;
      default:
        return <JourneyName form={form} onSubmit={handleJourneyNameNext} />;
    }
  };
  return (
    <>
      <div className="bg-lilac py-3 px-12">
        <Link
          to={ROUTES.JOURNEYS_PATH}
          className="font-normal text-sm text text-muted-foreground"
        >
          {"<- Back to Journeys"}
        </Link>

        <h1 className="text-2xl font-bold mt-1">
          {currentStep === JOURNEY_STEPS.STEPPER
            ? form.watch("name") || "Create Journey"
            : "Create Journey"}
        </h1>
      </div>
      <div className="px-10">
        <div
          className="rounded-[15px] mx-auto p-6 "
          // style={{
          //   boxShadow: "0px 8px 10px 0px hsla(0, 0%, 0%, 0.08)",
          // }}
        >
          {renderCurrentStep()}
        </div>
      </div>
    </>
  );
};

export default CreateJourneyPage;
