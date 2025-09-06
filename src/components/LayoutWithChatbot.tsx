// src/components/LayoutWithChatbot.tsx
import { PageLayout } from "./PageLayout";
import Chatbot from "./Chatbot";

interface LayoutWithChatbotProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function LayoutWithChatbot({ title, subtitle, children }: LayoutWithChatbotProps) {
  return (
    <>
      <PageLayout title={title} subtitle={subtitle}>
        {children}
      </PageLayout>
      <Chatbot />
    </>
  );
}