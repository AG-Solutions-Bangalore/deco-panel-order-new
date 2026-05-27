import { Card, CardContent } from "@/components/ui/card";
import { UserProfile } from "../store/use-profile-store";
import { CheckCircle2, Camera } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface ProfileHeaderProps {
  profile: UserProfile;
  fullName: string;
  email: string;
  isEditing: boolean;
  previewUrl: string;
  onImageSelect: (file: File) => void;
}

export function ProfileHeader({
  profile,
  fullName,
  email,
  isEditing,
  previewUrl,
  onImageSelect,
}: ProfileHeaderProps) {
  const initialLetter = fullName ? fullName.charAt(0).toUpperCase() : "U";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageError, setImageError] = useState(false);
  const [altAttempted, setAltAttempted] = useState(false);

  // Reset image error states if the remote profile image updates
  useEffect(() => {
    setImageError(false);
    setAltAttempted(false);
  }, [profile?.user_image]);

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleImageError = () => {
    if (!altAttempted) {
      setAltAttempted(true);
    } else {
      setImageError(true);
    }
  };

  // Determine active avatar URL
  let remoteUrl = "";
  if (profile?.user_image) {
    remoteUrl = altAttempted
      ? `https://decopanel.in/storage/app/public/user_image/${profile.user_image}`
      : `https://decopanel.in/storage/app/public/user/${profile.user_image}`;
  }
  const currentAvatarUrl = previewUrl || (imageError ? "" : remoteUrl);

  return (
    <Card className="bg-panel border-border shadow-sm overflow-hidden py-0">
      <CardContent className="p-0 relative">
        {/* Soft modern blue gradient decorative background */}
        <div className="h-28 w-full bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border/30" />
        
        <div className="px-6 pb-6 pt-0 flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-10 sm:-mt-8 z-10 relative">
          {/* Avatar Container */}
          <div 
            onClick={handleAvatarClick}
            className={`group relative size-20 rounded-full border-4 border-background bg-primary text-primary-foreground flex items-center justify-center font-black text-3xl shadow-md overflow-hidden ${
              isEditing ? "cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all duration-200" : ""
            }`}
          >
            {currentAvatarUrl ? (
              <img 
                src={currentAvatarUrl} 
                alt={fullName} 
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <span>{initialLetter}</span>
            )}

            {/* Editing Camera Overlay */}
            {isEditing && (
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera className="size-5 text-white" />
                <span className="text-[10px] text-white font-bold uppercase tracking-wider mt-0.5">Edit</span>
              </div>
            )}
            
            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
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

