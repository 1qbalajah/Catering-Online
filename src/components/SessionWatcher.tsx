"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const publicPaths = ["/", "/login", "/register", "/paket", "/unauthorized"];

function isPublicPath(pathname: string) {
  return publicPaths.includes(pathname);
}

export default function SessionWatcher() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const response = await fetch("/api/session", { cache: "no-store" });
        const data = (await response.json()) as { authenticated: boolean };

        if (!active) return;

        if (!data.authenticated && !isPublicPath(pathname)) {
          router.replace("/");
          router.refresh();
        }
      } catch {
        if (active && !isPublicPath(pathname)) {
          router.replace("/");
        }
      }
    }

    checkSession();
    const interval = window.setInterval(checkSession, 15000);
    window.addEventListener("focus", checkSession);

    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", checkSession);
    };
  }, [pathname, router]);

  return null;
}
