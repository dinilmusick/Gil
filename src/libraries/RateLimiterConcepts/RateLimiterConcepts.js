export const throttle = (key, intervalMs, state) => {
    const now = Date.now();
    const last = state[key] || 0;
    if (now - last < intervalMs) return false;
    state[key] = now;
    return true;
};

export const FUNCTIONS = {
    throttle
};
