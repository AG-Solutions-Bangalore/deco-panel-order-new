import { useProfile } from "../hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { ProfileHeader } from "../components/ProfileHeader";
import { ProfileForm } from "../components/ProfileForm";
import {
  LogOut,
  Edit3,
  Save,
  XCircle,
  Sun,
  Moon
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/components/providers/theme-provider";

export function ProfilePage() {
  const { resolvedTheme, setTheme } = useTheme();
  const {
    profile,
    isLoading,
    isEditing,
    fullName,
    email,
    mobile,
    address,
    state,
    pincode,
    setFullName,
    setEmail,
    setMobile,
    setAddress,
    setState,
    setPincode,
    handleEditToggle,
    handleCancel,
    handleSave,
    handleLogout,
  } = useProfile();
  const isDarkMode = resolvedTheme === "dark";

  if (isLoading && !profile) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-3xl mx-auto pb-24 md:pb-6">
        <PageHeader title="Profile" subtitle="Loading your account details..." />

        {/* Profile Card Skeleton */}
        <Card className="bg-panel border-border shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full shrink-0" />
            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
          <div className="border-t border-border/50 my-2" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
            <div className="flex flex-col gap-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 p-4 md:p-6 w-full max-w-3xl mx-auto pb-24 md:pb-6 animate-fade-in duration-300">
      <div className="flex items-center justify-between">
        <PageHeader title="Profile" subtitle="Manage your personal details, credentials, and settings." />

        {!isEditing && profile && (
          <Button onClick={handleEditToggle} className="flex gap-2">
            <Edit3 className="size-4" />
            Edit Profile
          </Button>
        )}
      </div>

      {profile && (
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          {/* Header Component */}
          <ProfileHeader
            profile={profile}
            fullName={fullName}
            email={email}
          />

          {/* Form details cards */}
          <ProfileForm
            profile={profile}
            isEditing={isEditing}
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            mobile={mobile}
            setMobile={setMobile}
            address={address}
            setAddress={setAddress}
            state={state}
            setState={setState}
            pincode={pincode}
            setPincode={setPincode}
          />

          {/* Action buttons in Edit Mode */}
          {isEditing && (
            <div className="flex items-center gap-3 w-full animate-in fade-in duration-200">
              <Button type="button" variant="outline" onClick={handleCancel} className="flex-1 flex gap-2 h-11 rounded-xl">
                <XCircle className="size-4" />
                Cancel
              </Button>
              <Button type="submit" className="flex-1 flex gap-2 h-11 rounded-xl">
                <Save className="size-4" />
                Save Changes
              </Button>
            </div>
          )}

          {/* Settings Section (Log Out) */}
          {!isEditing && (
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setTheme(isDarkMode ? "light" : "dark")}
                className="md:hidden flex items-center justify-center gap-2 h-11 rounded-xl border-border bg-transparent text-foreground shadow-none hover:bg-muted/60 active:scale-[0.98] transition-transform"
              >
                {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 h-11 rounded-xl border border-destructive/10 bg-destructive/5 hover:bg-destructive/10 text-destructive shadow-none active:scale-[0.98] transition-transform"
              >
                <LogOut className="size-4" />
                Log Out Account
              </Button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
