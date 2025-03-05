"use client";

import { Analytics, type BeforeSendEvent as AnalyticsEvent } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useCallback } from "react";

export default function AnalyticsClient() {
  // Type-safe beforeSend function for Analytics
  const handleAnalyticsBeforeSend = useCallback((event: AnalyticsEvent) => {
    return event.url.includes("/studio") ? null : event;
  }, []);

  // Generic beforeSend function for SpeedInsights
  const handleSpeedInsightsBeforeSend = useCallback((event: any) => {
    return event?.url?.includes("/studio") ? null : event;
  }, []);

  return (
    <>
      <Analytics beforeSend={handleAnalyticsBeforeSend} />
      <SpeedInsights beforeSend={handleSpeedInsightsBeforeSend} />
    </>
  );
}
