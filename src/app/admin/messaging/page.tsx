/**
 * Default Messaging Page
 * Shown when no conversation is selected
 */

import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import Link from "next/link";

export default function MessagingPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <MessageSquarePlus className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Select a conversation</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        Choose an existing conversation from the sidebar or start a new one to begin messaging.
      </p>
      <Link href="/admin/residents">
        <Button>
          Message a Resident
        </Button>
      </Link>
    </div>
  );
} 