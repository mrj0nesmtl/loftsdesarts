"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { WelcomeMessage } from "@/components/admin/WelcomeMessage";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [isConfirmingSignOut, setIsConfirmingSignOut] = useState(false);

  const handleSignOut = async () => {
    if (!isConfirmingSignOut) {
      setIsConfirmingSignOut(true);
      return;
    }
    
    await signOut();
    setIsConfirmingSignOut(false);
  };

  return (
    <div>
      <WelcomeMessage />
      
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-zinc-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-zinc-700/50 border-b border-zinc-600">
            <h2 className="text-lg font-medium">Account Information</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-zinc-400 mb-1">Email</p>
                <p className="text-lg">{user?.email || '-'}</p>
              </div>
              
              <div>
                <p className="text-sm text-zinc-400 mb-1">Account Type</p>
                <p className="text-lg">Administrator</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-zinc-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-zinc-700/50 border-b border-zinc-600">
            <h2 className="text-lg font-medium">Notifications</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <p className="text-zinc-400">
                New inquiry notifications are automatically sent to your email address.
              </p>
              
              <p>
                To update notification settings, please contact your administrator.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-zinc-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-zinc-700/50 border-b border-zinc-600">
            <h2 className="text-lg font-medium">Actions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                {isConfirmingSignOut ? "Confirm Sign Out" : "Sign Out"}
              </button>
              
              {isConfirmingSignOut && (
                <p className="text-sm text-zinc-400 mt-2">
                  Click again to confirm sign out
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 