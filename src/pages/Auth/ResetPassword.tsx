import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/schemas/resetPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "@/redux/services/authApi";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import InputField from "@/components/common/InputField/InputField";
import AuthHeader from "@/components/common/AuthHeader/AuthHeader";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

const ResetPassword = () => {
  const [resetPassword] = useResetPasswordMutation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  
  const access_token = searchParams.get("access_token");

  const form = useForm<ResetPasswordFormValues>({
    mode: "onChange",
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      access_token: access_token || "",
      password: "",
      passwordConfirm: "",
    },
  });

  const {
    formState: { isDirty, isValid, isSubmitting },
  } = form;

  // Check if access token is present
  useEffect(() => {
    if (!access_token) {
      toast.error("Invalid or missing reset token");
      navigate(ROUTES.LOGIN);
    } else {
      form.setValue("access_token", access_token);
    }
  }, [access_token, navigate, form]);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      await resetPassword({
        access_token: values.access_token,
        password: values.password,
        passwordConfirm: values.passwordConfirm,
      }).unwrap();

      setIsPasswordReset(true);
      toast.success("Password reset successfully!", {
        duration: 3000,
      });
      
      form.reset();
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 3000);
    } catch (error: unknown) {
      console.error("Reset password failed:", error);

      const err = error as {
        status?: number;
        data?: {
          message?: string;
        };
      };

      const message = err?.data?.message || "Failed to reset password. Please try again.";
      toast.error(message, {
        duration: 3000,
      });
    }
  };

  if (isPasswordReset) {
    return (
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
          <AuthHeader 
            title="Password Reset Successfully" 
            description="Your password has been changed successfully" 
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
              You can now log in with your new password.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Redirecting to login page...
            </p>
          </div>

          <div className="flex items-center justify-center">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center text-primary font-medium text-sm hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
        <AuthHeader 
          title="Reset Your Password" 
          description="Enter your new password below" 
        />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <InputField
                  {...field}
                  name="password"
                  label="New Password"
                  type="password"
                  placeholder="Enter your new password"
                  required
                />
              )}
            />

            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <InputField
                  {...field}
                  name="passwordConfirm"
                  label="Confirm New Password"
                  type="password"
                  placeholder="Confirm your new password"
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
                {isSubmitting ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;