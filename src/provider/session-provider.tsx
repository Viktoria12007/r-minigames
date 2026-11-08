import {type ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {SessionContext} from "../context/session-context.ts";
import type {AppSession, SessionCheck} from "../types/types.ts";
import {signOutFirebase} from "../shared/firebase.ts";
import type {User} from "firebase/auth";
import {useSnackbar} from "../hooks/use-snackbar.ts";

const appSessionKey = 'r-minigames:viktoria12007:app-session';
const appSessionDuration = 5 * 60 * 1000;

export default function SessionProvider({ children }: { children: ReactNode }) {
    const { showSnackbar } = useSnackbar();

    const [_, setSession] = useState<AppSession | null>(null);

    function isValidSession(value: unknown, now: number): value is AppSession {
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
            return false;
        }
        const candidate = value as Partial<AppSession>;
        return (
            typeof candidate.displayName === 'string' &&
            typeof candidate.email === 'string' &&
            candidate.email.length > 0 &&
            typeof candidate.authenticatedAt === 'number' &&
            Number.isFinite(candidate.authenticatedAt) &&
            candidate.authenticatedAt <= now &&
            (candidate.avatarUrl === undefined || typeof candidate.avatarUrl === 'string')
        );
    }

    // function notifySessionChange(session?: AppSession): void {
    //     dispatchEvent(
    //         new CustomEvent<AppSession | undefined>('minigames:sessionchange', { detail: session }),
    //     );
    // }

    function removeSessionAndSignOut(): void {
        localStorage.removeItem(appSessionKey);
        // notifySessionChange();
        setSession(null);
        void signOutFirebase().catch(() => null);
    }

    const createAppSession = useCallback((user: User) => {
        const email = user.email;
        if (!email) {
            throw new Error('The authentication provider did not return an email address.');
        }
        const session: AppSession = {
            displayName: user.displayName ?? '',
            email,
            authenticatedAt: Date.now(),
            ...(user.photoURL && { avatarUrl: user.photoURL }),
        };
        localStorage.setItem(appSessionKey, JSON.stringify(session));
        // notifySessionChange(session);
        setSession(session);
        return session;
    }, [])

    const checkAppSession = useCallback((now = Date.now()): SessionCheck => {
        const rawSession = localStorage.getItem(appSessionKey);
        if (!rawSession) {
            setSession(null);
            return { status: 'guest' };
        }
        let parsed: unknown;
        try {
            parsed = JSON.parse(rawSession);
        } catch {
            removeSessionAndSignOut();
            return { status: 'invalid' };
        }
        if (!isValidSession(parsed, now)) {
            removeSessionAndSignOut();
            return { status: 'invalid' };
        }
        if (now - parsed.authenticatedAt >= appSessionDuration) {
            removeSessionAndSignOut();
            return { status: 'expired' };
        }
        setSession(parsed);
        return { status: 'active', session: parsed };
    }, [])

    const refreshAppSession = useCallback((): ReturnType<typeof checkAppSession> => {
        const sessionCheck = checkAppSession();
        document.documentElement.dataset.authenticated = String(sessionCheck.status === 'active');
        if (sessionCheck.status === 'expired') {
            showSnackbar('Your session has expired. You are now browsing as a guest.', 'error');
        }
        return sessionCheck;
    }, [checkAppSession, showSnackbar])

    const clearAppSession = useCallback(async (): Promise<void> => {
        localStorage.removeItem(appSessionKey);
        // notifySessionChange();
        setSession(null);
        await signOutFirebase();
    }, [])

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                void refreshAppSession();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [refreshAppSession]);

    // useEffect(() => {
    //     void refreshAppSession();
    // }, [refreshAppSession]);

    const contextValue = useMemo(() => ({
        createAppSession,
        checkAppSession,
        clearAppSession,
    }), [checkAppSession, clearAppSession, createAppSession])

    return (<SessionContext.Provider value={contextValue}>
        {children}
    </SessionContext.Provider>)
}
