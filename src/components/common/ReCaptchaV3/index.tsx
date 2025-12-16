import { useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}

interface ReCaptchaV3Props {
  siteKey: string;
  action: string;
  onVerify: (token: string) => void;
  onError?: (error: Error) => void;
}

export interface ReCaptchaV3Ref {
  execute: () => Promise<void>;
}

export const ReCaptchaV3 = forwardRef<ReCaptchaV3Ref, ReCaptchaV3Props>(
  ({ siteKey, action, onVerify, onError }, ref) => {
    const executeRecaptcha = useCallback(async () => {
      if (!siteKey) {
        const error = new Error('reCAPTCHA site key not configured');
        console.error(error);
        if (onError) {
          onError(error);
        }
        return;
      }

      if (!window.grecaptcha) {
        const error = new Error('reCAPTCHA not loaded');
        console.error(error);
        if (onError) {
          onError(error);
        }
        return;
      }

      try {
        await new Promise<void>((resolve) => {
          window.grecaptcha.ready(() => resolve());
        });

        const token = await window.grecaptcha.execute(siteKey, { action });
        onVerify(token);
      } catch (error) {
        console.error('ReCAPTCHA execution failed:', error);
        if (onError) {
          onError(error as Error);
        }
      }
    }, [siteKey, action, onVerify, onError]);

    useImperativeHandle(ref, () => ({
      execute: executeRecaptcha
    }));

    // Load the reCAPTCHA script and execute when ready
    useEffect(() => {
      if (!siteKey) {
        const error = new Error(
          'CRITICAL: reCAPTCHA v3 site key not configured - login security disabled!'
        );
        console.error(error);
        if (onError) {
          onError(error);
        }
        throw error; // Fail hard - don't allow the form to work without reCAPTCHA
      }

      const loadAndExecute = async () => {
        // Check if script already exists
        const existingScript = document.querySelector(
          'script[src*="recaptcha"]'
        );

        if (!existingScript && !window.grecaptcha) {
          const script = document.createElement('script');
          script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
          script.async = true;
          script.defer = true;

          // Wait for script to load
          script.onload = () => {
            setTimeout(executeRecaptcha, 100); // Small delay to ensure it's ready
          };

          script.onerror = () => {
            const error = new Error('Failed to load reCAPTCHA script');
            console.error(error);
            if (onError) {
              onError(error);
            }
          };

          document.head.appendChild(script);
        } else if (window.grecaptcha) {
          setTimeout(executeRecaptcha, 100);
        }
      };

      loadAndExecute();
    }, [siteKey, executeRecaptcha, onError]);

    return null; // v3 is invisible
  }
);

export default ReCaptchaV3;
