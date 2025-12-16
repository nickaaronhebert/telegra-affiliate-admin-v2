import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/schemas/forgotPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "@/redux/services/authApi";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import InputField from "@/components/common/InputField/InputField";
import AuthHeader from "@/components/common/AuthHeader/AuthHeader";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

const ForgotPassword = () => {
  const [forgotPassword] = useForgotPasswordMutation();
  const [isEmailSent, setIsEmailSent] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    mode: "onChange",
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    formState: { isDirty, isValid, isSubmitting },
  } = form;

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await forgotPassword({
        email: values.email,
      }).unwrap();

      setIsEmailSent(true);
      toast.success("Password reset email sent successfully!", {
        duration: 3000,
      });
      
      form.reset();
    } catch (error: unknown) {
      console.error("Forgot password failed:", error);

      const err = error as {
        status?: number;
        data?: {
          message?: string;
        };
      };

      const message = err?.data?.message || "Failed to send reset email. Please try again.";
      toast.error(message, {
        duration: 3000,
      });
    }
  };

  if (isEmailSent) {
    return (
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
          <AuthHeader 
            title="Check Your Email" 
            description="We've sent you a password reset link" 
          />
          
          <div className="mb-6 text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Please check your email inbox and follow the instructions to reset your password.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => setIsEmailSent(false)}
              variant="outline"
              className="w-full h-12 rounded-full"
            >
              Send Another Email
            </Button>
            
            <div className="flex items-center justify-center">
              <Link
                to={ROUTES.LOGIN}
                className="inline-flex items-center text-primary font-medium text-sm hover:text-primary/80 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
        <AuthHeader 
          title="Forgot Password?" 
          description="Enter your email address and we'll send you a link to reset your password" 
        />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <InputField
                  {...field}
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email address"
                  required
                />
              )}
            />

            <div className="space-y-4">
              <Button
                disabled={!isDirty || !isValid || isSubmitting}
                type="submit"
                className="w-full h-12 bg-primary text-[16px] leading-[22px] font-semibold text-white rounded-full"
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>

              <div className="flex items-center justify-center">
                <Link
                  to={ROUTES.LOGIN}
                  className="inline-flex items-center text-primary font-medium text-sm hover:text-primary/80 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;