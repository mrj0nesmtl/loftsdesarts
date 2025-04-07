/**
 * Default Messaging Page
 * Shown when no conversation is selected
 */

import { Button } from "@/components/ui/button";
import { MessageSquarePlus, Users } from "lucide-react";
import Link from "next/link";

export default function MessagingPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <MessageSquarePlus className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Sélectionnez une conversation</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        Choisissez une conversation existante dans la barre latérale ou commencez-en une nouvelle pour débuter la messagerie.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/admin/messaging/new">
          <Button>
            Messagerie un résident
          </Button>
        </Link>
        <Link href="/admin/syndic">
          <Button variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Messagerie un membre du conseil
          </Button>
        </Link>
      </div>
    </div>
  );
} 