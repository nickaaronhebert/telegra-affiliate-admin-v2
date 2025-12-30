import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormValues } from "@/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useLoginMutation } from "@/redux/services/authApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import InputField from "@/components/common/InputField/InputField";
import AuthHeader from "@/components/common/AuthHeader/AuthHeader";
import ReCaptchaV3 from "@/components/common/ReCaptchaV3";
import { useCallback } from "react";

const LoginPage = () => {
  const [login] = useLoginMutation();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    mode: "onChange",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      recaptcha_token: "",
    },
  });

  const {
    formState: { isDirty, isValid, isSubmitting },
  } = form;

  // Memoize reCAPTCHA callbacks to prevent infinite loops
  const handleRecaptchaVerify = useCallback(
    (token: string) => {
      form.setValue("recaptcha_token", token);
    },
    [form]
  );

  const handleRecaptchaError = useCallback(
    (error: Error) => {
      console.error("reCAPTCHA v3 error:", error);
      form.setValue("recaptcha_token", "");
    },
    [form]
  );

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await login({
        username: values.email,
        password: values.password,
        recaptcha_token: values.recaptcha_token,
      }).unwrap();

      form.reset();

      // Check if 2FA is required
      const is2FAEnabled = `${import.meta.env.VITE_ENABLE_2FA}` !== "false";
      
      if (is2FAEnabled && response.token && !response.user?.id) {
        // 2FA required - navigate to 2FA page with temporary token
        navigate(ROUTES.TWO_FA, {
          state: {
            accessToken: response.token,
            userEmail: response.user?.email,
            userPhone: response.user?.phone,
          },
        });
      } else if (response.user?.id) {
        // Already authenticated (2FA disabled)
        navigate(ROUTES.DASHBOARD);
      } else {
        // Navigate to dashboard as fallback
        navigate(ROUTES.DASHBOARD);
      }
    } catch (error: unknown) {
      console.error("Login failed:", error);

      const err = error as {
        status?: number;
        data?: {
          message?: string;
        };
      };

      const message = err?.data?.message || "Incorrect details";
      toast.error(message, {
        duration: 1500,
      });
    }
  };
  return (
    <div className="w-full max-w-lg">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
        <AuthHeader title="Welcome Back" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <InputField
                    {...field}
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Enter your email address"
                    required
                  />
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <InputField
                    {...field}
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                )}
              />
            </div>
            {/* ReCaptcha component outside FormField to prevent re-renders */}
            <ReCaptchaV3
              siteKey={import.meta.env.VITE_RECAPTCHA_V3_SITE_KEY || ""}
              action={"login"}
              onVerify={handleRecaptchaVerify}
              onError={handleRecaptchaError}
            />

            <div className="flex items-center justify-center mb-6 mt-4">
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="text-muted-peach font-normal text-[14px] leading-[18px]"
              >
                Forgot password?
              </Link>
            </div>

            <div className="flex justify-center">
              <Button
                disabled={!isDirty || !isValid}
                type="submit"
                className=" h-12 bg-primary text-[16px] leading-[22px] font-semibold text-white  rounded-full min-w-[150px] min-h-[52px] pointer"
              >
                {isSubmitting ? "Signing in..." : "Login"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
