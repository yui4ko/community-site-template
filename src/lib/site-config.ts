/**
 * Site Configuration Helper
 *
 * This module provides a centralized way to access site-wide configuration.
 * All configurable strings come from theme.json (defaults) merged with
 * any overrides stored in the database via the admin Theme Settings page.
 *
 * To customize your site, edit theme.json or use the Admin > Theme Settings UI.
 */

import defaultTheme from '../../theme.json';

export type SiteConfig = typeof defaultTheme;

/**
 * Get the default (static) site config from theme.json.
 * Use this in places where you cannot call an async server action (e.g. static metadata).
 */
export function getDefaultSiteConfig(): SiteConfig {
    return defaultTheme;
}

/**
 * Shorthand helpers that resolve from the static default config.
 * These are safe to use in metadata exports and other synchronous contexts.
 */
export const siteConfig = defaultTheme;
