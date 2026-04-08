import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';

/**
 * Programmatic logout with duplicate-submit protection and Inertia cache flush.
 */
export function useLogout(logoutUrl: string) {
    const [loggingOut, setLoggingOut] = useState(false);

    const performLogout = useCallback(() => {
        if (loggingOut) {
            return;
        }

        setLoggingOut(true);
        router.flushAll();
        router.post(
            logoutUrl,
            {},
            {
                preserveScroll: true,
                onFinish: () => setLoggingOut(false),
            },
        );
    }, [loggingOut, logoutUrl]);

    return { loggingOut, performLogout };
}
