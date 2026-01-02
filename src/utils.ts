export const isTurnstileEnabled = (env: Env): boolean => {
    return env.TURNSTILE_ENABLED ?? false;
};
