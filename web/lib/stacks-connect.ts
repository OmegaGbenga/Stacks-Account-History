import { AppConfig, UserSession, showConnect } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);

/**
 * User session configuration for Stacks authentication
 */
export const userSession = new UserSession({ appConfig });

export interface AuthenticateOptions {
  onFinish?: () => void;
  onCancel?: () => void;
}

/**
 * Trigger the Stacks wallet authentication flow
 */
export function authenticate(options?: AuthenticateOptions) {
  showConnect({
    appDetails: {
      name: 'Stacks History App',
      icon: typeof window !== 'undefined' ? window.location.origin + '/logo.png' : '',
    },
    redirectTo: '/',
    onFinish: () => {
      if (options?.onFinish) options.onFinish();
      else window.location.reload();
    },
    onCancel: options?.onCancel,
    userSession,
  });
}

export function getUserData() {
    if (userSession.isUserSignedIn()) {
        return userSession.loadUserData();
    }
    return null;
}
