"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";

interface AuthRoutesLayoutProps {
  children: ReactNode;
}

const AuthRoutesLayout = ({ children }: AuthRoutesLayoutProps) => {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return children;
};

export default AuthRoutesLayout;
