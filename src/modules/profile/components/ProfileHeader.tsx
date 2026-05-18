"use client";

import { Card, CardContent } from "@/components/ui/card";
import { UserProfile } from "../store/use-profile-store";
import { CheckCircle2 } from "lucide-react";

interface ProfileHeaderProps {
  profile: UserProfile;
  fullName: string;
  email: string;
}

export function ProfileHeader({ profile, fullName, email }: ProfileHeaderProps) {
  const initialLetter = fullName ? fullName.charAt(0).toUpperCase() : "U";

  return (
    <Card className="bg-panel border-border shadow-sm overflow-hidden py-0">
      <CardContent className="p-0 relative">
        {/* Soft modern blue gradient decorative background */}
        <div className="h-28 w-full bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border/30" />
        
        <div className="px-6 pb-6 pt-0 flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-10 sm:-mt-8 z-10 relative">
          <div className="size-20 rounded-full border-4 border-background bg-primary text-primary-foreground flex items-center justify-center font-black text-3xl shadow-md">
            {initialLetter}
          </div>
          
          <div className="flex-1 text-center sm:text-left flex flex-col gap-1 mt-2">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl md:text-2xl font-black text-text tracking-tight">
                {fullName || "User Profile"}
              </h2>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                {profile.user_status === "Active" ? (
                  <>
                    <CheckCircle2 className="size-3 mr-1" />
                    Verified
                  </>
                ) : (
                  "Client Account"
                )}
              </span>
            </div>
            <p className="text-sm text-text-muted">{email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
