"use client";

import dynamic from "next/dynamic";

const IntroExperience = dynamic(() => import("@/components/intro/IntroExperience"), { ssr: false });
const WelcomeOnboarding = dynamic(() => import("@/components/WelcomeOnboarding"), { ssr: false });
const TouchFeedback = dynamic(() => import("@/components/TouchFeedback"), { ssr: false });
const SensoryFeedback = dynamic(() => import("@/components/SensoryFeedback"), { ssr: false });
const SignatureInk = dynamic(() => import("@/components/SignatureInk"), { ssr: false });
const PerfObserver = dynamic(() => import("@/components/PerfObserver"), { ssr: false });
const PageTransition = dynamic(() => import("@/components/PageTransition"), { ssr: false });
const ChatBot = dynamic(() => import("@/components/chat/LazyChatBot").then((m) => m.ChatBot), { ssr: false });
const DevOnly = dynamic(() => import("@/components/DevOnly"), { ssr: false });
const GridOverlay = dynamic(() => import("@/components/GridOverlay"), { ssr: false });

export default function ClientOverlays() {
  return (
    <>
      <IntroExperience />
      <WelcomeOnboarding />
      <TouchFeedback />
      <SensoryFeedback />
      <SignatureInk />
      <PerfObserver />
      <PageTransition />
      <DevOnly><GridOverlay /></DevOnly>
      <ChatBot />
    </>
  );
}