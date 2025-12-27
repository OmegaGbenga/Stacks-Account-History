import { AppConfig, UserSession, showConnect } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);

/**
 * User session configuration for Stacks authentication
 */
export const userSession = new UserSession({ appConfig });

export interface AuthenticateOptions {
