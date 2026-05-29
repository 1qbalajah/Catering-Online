"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createAnonClient } from "@/lib/supabase";

type RealtimeRefreshProps = {
  tables: string[];
};

export default function RealtimeRefresh({ tables }: RealtimeRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createAnonClient();
    const channel = supabase.channel(`realtime-refresh-${tables.join("-")}-${Date.now()}`);

    tables.forEach((table) => {
      channel.on("postgres_changes", { event: "*", schema: "public", table }, () => {
        router.refresh();
      });
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, tables]);

  return null;
}
