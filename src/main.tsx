import { Provider } from "react-redux";
import { createRoot } from 'react-dom/client'
import { store } from "./redux/store.ts";
import './index.css'
import App from './App.tsx'

// Global debug function for accessing environment variables via browser console
const __sysCheck = (envVarName: string): void => {
  try {
    if (!envVarName) {
      console.error('❌ Please provide an environment variable name');
      console.info('💡 Usage: __sysCheck("VITE_API_URL")');
      return;
    }

    // Get all environment variables
    const envVars = import.meta.env;

    // Check if the specific env var exists
    if (envVarName in envVars) {
      const value = envVars[envVarName];
      console.group(`🔍 Environment Variable: ${envVarName}`);``
      console.log('Value:', value);
      console.log('Type:', typeof value);
      console.groupEnd();
    } else {
      console.error(`❌ Environment variable "${envVarName}" not found`);
      console.group('📋 Available environment variables:');
      Object.keys(envVars)
        .filter(key => key.startsWith('VITE_')) // Only show VITE_ prefixed vars for security
        .forEach(key => console.log(`• ${key}`));
      console.groupEnd();
    }
  } catch (error) {
    console.error('❌ Error accessing environment variables:', error);
  }
};

// Make the function globally accessible via window object
if (typeof window !== 'undefined') {
  (window as any).__sysCheck = __sysCheck;

  // Also add a helper function to list all available env vars
  (window as any).listEnvVars = (): void => {
    try {
      const envVars = import.meta.env;
      console.group('🌍 All Available Environment Variables:');
      Object.keys(envVars)
        .filter(key => key.startsWith('VITE_')) // Only show VITE_ prefixed vars for security
        .forEach(key => {
          console.log(`${key}: ${envVars[key]}`);
        });
      console.groupEnd();
      console.info('💡 Use __sysCheck("VAR_NAME") to get a specific variable');
    } catch (error) {
      console.error('❌ Error listing environment variables:', error);
    }
  };

  console.info('🚀 Debug functions loaded! Use __sysCheck("ENV_VAR_NAME") or listEnvVars() in console');
}

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
