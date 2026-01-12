import { AuthNetEnvironment } from "@/constants";

const REACT_APP_AUTH_NET_LOGIN_ID =
  import.meta.env.VITE_AUTH_NET_LOGIN_ID || '${REACT_APP_AUTH_NET_LOGIN_ID}';
const REACT_APP_AUTH_NET_CLIENT_KEY =
  import.meta.env.VITE_AUTH_NET_CLIENT_KEY ||
  '${REACT_APP_AUTH_NET_CLIENT_KEY}';
export const REACT_APP_AUTH_NET_ENVIRONMENT =
  import.meta.env.VITE_AUTH_NET_ENVIRONMENT ||
  '${REACT_APP_AUTH_NET_ENVIRONMENT}';

export const authData = {
  apiLoginID: REACT_APP_AUTH_NET_LOGIN_ID,
  clientKey: REACT_APP_AUTH_NET_CLIENT_KEY,
  sandbox: REACT_APP_AUTH_NET_ENVIRONMENT !== AuthNetEnvironment.Production
};
