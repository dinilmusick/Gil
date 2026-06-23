export const throttle = (key: string, intervalMs: number, state: any) => {
    const now = Date.now();
    const last = state[key] || 0;
    if (now - last < intervalMs) return false;
    state[key] = now;
    return true;
};

export const FUNCTIONS = {
    throttle
};
