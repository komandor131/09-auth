"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { checkSession, getMe, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

interface AuthProviderProps {
  children: ReactNode;
}

const isPrivatePath = (pathname: string): boolean =>
  pathname.startsWith("/profile") || pathname.startsWith("/notes");

const AuthProvider = ({ children }: AuthProviderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let ignore = false;

    const verifySession = async (): Promise<void> => {
      setIsChecking(true);

      try {
        const session = await checkSession();

        if (!session.success) {
          clearIsAuthenticated();

          if (isPrivatePath(pathname)) {
            await logout().catch(() => undefined);
            router.replace("/sign-in");
          }

          return;
        }

        const user = await getMe();
        if (!ignore) {
          setUser(user);
        }
      } catch {
        clearIsAuthenticated();

        if (isPrivatePath(pathname)) {
          await logout().catch(() => undefined);
          router.replace("/sign-in");
        }
      } finally {
        if (!ignore) {
          setIsChecking(false);
        }
      }
    };

    verifySession();

    return () => {
      ignore = true;
    };
  }, [clearIsAuthenticated, pathname, router, setUser]);

  if (isChecking) {
    return <p>Loading, please wait...</p>;
  }

  return children;
};

export default AuthProvider;
