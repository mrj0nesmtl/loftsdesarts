/**
 * Messaging Layout
 * Contains the conversation list sidebar and outlet for the selected conversation
 */

import { Metadata } from "next";
import ConversationList from "@/components/messaging/ConversationList";

export const metadata: Metadata = {
  title: "Messaging - Lofts des Arts",
  description: "Internal messaging system for Lofts des Arts administration",
};

export default function MessagingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-6rem)] overflow-hidden">
      <div className="w-80 flex-shrink-0">
        <ConversationList />
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
} 