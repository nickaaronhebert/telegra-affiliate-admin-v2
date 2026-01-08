import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSendOtpCodeMutation, useVerifyOtpCodeMutation } from '@/redux/services/authApi';
import { useForm } from 'react-hook-form';
import { Form, FormField } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ROUTES } from '@/constants/routes';
import InputField from '@/components/common/InputField/InputField';
import AuthHeader from '@/components/common/AuthHeader/AuthHeader';
import { removeLocalStorage } from '@/lib/utils';
import { LOCAL_STORAGE_KEYS } from '@/constants';

interface TwoFAState {
    accessToken: string;
    userEmail?: string;
    userPhone?: string;
}

type OtpFormValues = {
    otpMethod: 'email' | 'sms';
};

type CodeFormValues = {
    code: string;
};

const TwoFactorAuthPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    //   const dispatch = useDispatch();
    const state = location.state as TwoFAState | null;
    const [isChecking, setIsChecking] = useState(true);

    const [otpSent, setOtpSent] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<'email' | 'sms'>('email');
    const [sendOtp] = useSendOtpCodeMutation();
    const [verifyOtp] = useVerifyOtpCodeMutation();

    const otpForm = useForm<OtpFormValues>({
        mode: 'onChange',
        defaultValues: {
            otpMethod: 'email',
        },
    });

    const codeForm = useForm<CodeFormValues>({
        mode: 'onChange',
        defaultValues: {
            code: '',
        },
    });

    // Redirect to login if no access token in state
    useEffect(() => {
        // Clear any stale tokens from localStorage on mount
        removeLocalStorage(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
        removeLocalStorage(LOCAL_STORAGE_KEYS.USER);
        
        if (!state?.accessToken) {
            // Redirect to login immediately and don't render anything
            navigate(ROUTES.LOGIN, { replace: true });
        } else {
            setIsChecking(false);
        }
    }, []);

    // If checking or no access token, don't render anything
    if (isChecking || !state?.accessToken) {
        return null;
    }

    const handleSendOtp = async (values: OtpFormValues) => {
        if (!state?.accessToken) return;

        try {
            setSelectedMethod(values.otpMethod);
            await sendOtp({
                access_token: state.accessToken,
                method: values.otpMethod,
            }).unwrap();

            setOtpSent(true);
            toast.success('OTP sent successfully');
        } catch (error: any) {
            const message = error?.data?.message || 'Failed to send OTP';
            toast.error(message);
            console.error('Send OTP error:', error);
        }
    };

    const handleVerifyOtp = async (values: CodeFormValues) => {
        if (!state?.accessToken) return;

        try {
            await verifyOtp({
                access_token: state.accessToken,
                code: values.code,
            }).unwrap();

            // Redux automatically handles token storage via the auth slice extraReducer
            toast.success('Verification successful');
            codeForm.reset();
            navigate(ROUTES.PATIENTS);
        } catch (error: any) {
            const message = error?.data?.message || 'Invalid OTP code';
            toast.error(message);
            console.error('Verify OTP error:', error);
        }
    };

    const handleResendCode = async () => {
        if (!state?.accessToken) return;

        try {
            await sendOtp({
                access_token: state.accessToken,
                method: selectedMethod,
            }).unwrap();

            toast.success('New OTP code sent');
        } catch (error: any) {
            const message = error?.data?.message || 'Failed to resend OTP';
            toast.error(message);
        }
    };

    return (
        <div className="w-full max-w-lg">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
                {!otpSent ? (
                    <>
                        <AuthHeader
                            title="Choose the OTP method"
                            description="We'll send you a One Time Password to your mobile phone or your email to verify your identity"
                        />
                        <Form {...otpForm}>
                            <form onSubmit={otpForm.handleSubmit(handleSendOtp)} className="space-y-6">
                                <div className="space-y-4">
                                    <FormField
                                        control={otpForm.control}
                                        name="otpMethod"
                                        render={({ field }) => (
                                            <div className="space-y-2">
                                                {/* Email option */}
                                                <label
                                                    htmlFor="email-option"
                                                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition
          ${field.value === 'email'
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-gray-200 hover:border-primary'
                                                        }
        `}
                                                >
                                                    <input
                                                        type="radio"
                                                        id="email-option"
                                                        value="email"
                                                        checked={field.value === 'email'}
                                                        onChange={field.onChange}
                                                        className="w-4 h-4 text-primary"
                                                    />
                                                    <div className="ml-3">
                                                        <p className="font-medium text-gray-900">Email</p>
                                                        <p className="text-sm text-gray-600">
                                                            {state.userEmail || 'Not provided'}
                                                        </p>
                                                    </div>
                                                </label>

                                                {/* SMS option */}
                                                <label
                                                    htmlFor="sms-option"
                                                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition
          ${field.value === 'sms'
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-gray-200 hover:border-primary'
                                                        }
        `}
                                                >
                                                    <input
                                                        type="radio"
                                                        id="sms-option"
                                                        value="sms"
                                                        checked={field.value === 'sms'}
                                                        onChange={field.onChange}
                                                        className="w-4 h-4 text-primary"
                                                    />
                                                    <div className="ml-3">
                                                        <p className="font-medium text-gray-900">Phone</p>
                                                        <p className="text-sm text-gray-600">
                                                            {state.userPhone || 'Not provided'}
                                                        </p>
                                                    </div>
                                                </label>
                                            </div>
                                        )}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-primary text-[16px] leading-[22px] font-semibold text-white  rounded-full min-w-[150px] min-h-[52px] pointer"
                                    disabled={otpForm.formState.isSubmitting}
                                >
                                    {otpForm.formState.isSubmitting ? 'Sending...' : 'Send me the OTP'}
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-6">
                            <button
                                onClick={() => {
                                    removeLocalStorage(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
                                    removeLocalStorage(LOCAL_STORAGE_KEYS.USER);
                                    navigate(ROUTES.LOGIN, { replace: true });
                                }}
                                className="w-full text-center block text-sm text-gray-600 hover:text-gray-800 py-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <AuthHeader
                            title="Two-factor Authentication"
                            description={`Please type the 2FA code we just sent to your ${selectedMethod === 'email' ? 'e-mail' : 'phone number'}`}
                        />

                        <Form {...codeForm}>
                            <form onSubmit={codeForm.handleSubmit(handleVerifyOtp)} className="space-y-6">
                                <FormField
                                    control={codeForm.control}
                                    name="code"
                                    render={({ field }) => (
                                        <InputField
                                            {...field}
                                            name="code"
                                            label="2FA Code"
                                            placeholder="Enter 6-digit code"
                                            type="text"
                                            maxLength={6}
                                            required
                                        />
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full bg-primary text-[16px] leading-[22px] font-semibold text-white  rounded-full min-w-[150px] min-h-[52px] pointer"
                                    disabled={codeForm.formState.isSubmitting}
                                >
                                    {codeForm.formState.isSubmitting ? 'Verifying...' : 'Submit'}
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-6 text-center space-y-2">
                            <p className="text-sm text-gray-600">
                                It might take a minute to receive your code.
                            </p>
                            <p className="text-sm text-gray-600">
                                Haven't received it?{' '}
                                <button
                                    onClick={handleResendCode}
                                    className="text-blue-600 hover:text-blue-700 font-medium pointer"
                                    disabled={codeForm.formState.isSubmitting}
                                >
                                    Resend a new 2FA code.
                                </button>
                            </p>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => {
                                    removeLocalStorage(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
                                    removeLocalStorage(LOCAL_STORAGE_KEYS.USER);
                                    navigate(ROUTES.LOGIN, { replace: true });
                                }}
                                className="w-full text-center block text-sm text-gray-600 hover:text-gray-800 py-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TwoFactorAuthPage;
