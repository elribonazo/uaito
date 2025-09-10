import { useCallback, useState } from "react";

export const useThrottle = (callback, delay) => {
    const [lastCall, setLastCall] = useState(0);
    return useCallback((...args) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
            callback(...args);
            setLastCall(now);
        }
    }, [callback, delay, lastCall]);
};