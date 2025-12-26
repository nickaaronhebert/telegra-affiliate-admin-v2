import { authData } from "@/utils/authNet";

/**
 * AuthNet Accept Hosted Form Integration Helper
 * Handles initialization and setup of Authorize.Net hosted payment form
 * React 19 compatible
 */

declare global {
  interface Window {
    Accept?: any;
  }
}

/**
 * Load Accept.js library from CDN
 * @returns Promise that resolves when library is loaded
 */
export const loadAcceptJs = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Accept) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://jslib.authorize.net/v1/Accept.js";
    script.async = true;
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      reject(new Error("Failed to load Accept.js"));
    };

    document.body.appendChild(script);
  });
};

/**
 * Initialize AuthNet Accept Hosted Form
 * @param containerId - ID of container element for the form
 * @param onSuccess - Callback when form is ready
 * @param onError - Callback on error
 */
export const initializeAuthNetForm = (
  containerId: string,
  onSuccess?: () => void,
  onError?: (error: string) => void
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Load Accept.js if not already loaded
      await loadAcceptJs();

      if (!window.Accept) {
        throw new Error("Accept.js library failed to load");
      }

      // Configuration for Accept Hosted Form
      const formConfig = {
        apiLoginID: authData.apiLoginID,
        clientKey: authData.clientKey,
        formCharacterEncoding: "UTF-8",
        hosted: {
          billingAddressOptions: {
            show: false,
            required: false,
          },
          hostSignature: "", // Leave empty for production
        },
      };

      // Dispatch the form
      window.Accept.dispatchData(
        {
          action: "getHostedFormHTML",
          ...formConfig,
        },
        (response: any) => {
          if (response.success) {
            const formHTML = response.formHTML;
            const container = document.getElementById(containerId);

            if (container) {
              container.innerHTML = formHTML;

              // Add Accept.js event listeners
              const form = document.querySelector(".accept-hosted-form") as HTMLFormElement;
              if (form) {
                form.addEventListener("submit", (e) => {
                  e.preventDefault();
                  // Handle form submission
                });
              }

              if (onSuccess) {
                onSuccess();
              }
              resolve();
            } else {
              throw new Error(`Container with id "${containerId}" not found`);
            }
          } else {
            throw new Error(
              response.message || "Failed to load hosted form"
            );
          }
        }
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      if (onError) {
        onError(message);
      }

      reject(error);
    }
  });
};

/**
 * Get payment data from AuthNet form
 * Returns opaqueData that should be sent to backend
 */
export const getAuthNetPaymentData = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!window.Accept) {
      reject(new Error("Accept.js not loaded"));
      return;
    }

    window.Accept.dispatchData(
      {
        action: "getPaymentData",
      },
      (response: any) => {
        if (response.success) {
          resolve({
            opaqueData: response.opaqueData,
            messages: response.messages,
          });
        } else {
          reject(new Error(response.message || "Failed to get payment data"));
        }
      }
    );
  });
};

export default {
  loadAcceptJs,
  initializeAuthNetForm,
  getAuthNetPaymentData,
};
