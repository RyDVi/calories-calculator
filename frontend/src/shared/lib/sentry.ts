import * as Sentry from '@sentry/react';

export const initSentry = () => {
  if (import.meta.env.DEV || !import.meta.env.SENTRY_DSN) return;
  Sentry.init({
    dsn: import.meta.env.SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    environment: process.env.NODE_ENV,
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ['localhost', /^https:\/\/foodstat\.ru\//],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    ignoreErrors: ['AbortError', 'querySelector'],
  });
};
