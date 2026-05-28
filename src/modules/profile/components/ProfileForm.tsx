import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile } from "../store/use-profile-store";
import { User, Mail, Phone, MapPin, ShieldCheck } from "lucide-react";

interface ProfileFormProps {
  profile: UserProfile;
  isEditing: boolean;
  fullName: string;
  setFullName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  mobile: string;
  setMobile: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  state: string;
  setState: (val: string) => void;
  pincode: string;
  setPincode: (val: string) => void;
}

export function ProfileForm({
  profile,
  isEditing,
  fullName,
  setFullName,
  email,
  setEmail,
  mobile,
  setMobile,
  address,
  setAddress,
  state,
  setState,
  pincode,
  setPincode,
}: ProfileFormProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Account Details Card */}
      <Card className="bg-panel border-border shadow-sm py-0 overflow-hidden">
        <CardContent className="p-5 flex flex-col gap-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-border/40 pb-2 flex items-center gap-2">
            <User className="size-4 text-primary" />
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="full_name"
                className="text-xs font-bold text-text/80"
              >
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
                <Input
                  id="full_name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={!isEditing}
                  className="pl-10 disabled:bg-muted/40 disabled:opacity-90 font-medium text-text bg-background border-border"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-xs font-bold text-text/80">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  className="pl-10 disabled:bg-muted/40 disabled:opacity-90 font-medium text-text bg-background border-border"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="mobile"
                className="text-xs font-bold text-text/80"
              >
                Mobile Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
                <Input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  disabled={!isEditing}
                  className="pl-10 disabled:bg-muted/40 disabled:opacity-90 font-medium text-text bg-background border-border"
                  placeholder="+91 99999 99999"
                  required
                />
              </div>
            </div>

            {/* <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-text/80">User Type</Label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
                <Input
                  value={profile.user_type_id === 1 ? "Administrator" : "Partner / Client"}
                  disabled
                  className="pl-10 bg-muted/40 opacity-80 font-medium text-text border-border"
                />
              </div>
            </div> */}
          </div>
        </CardContent>
      </Card>

      {/* Address Card */}
      <Card className="bg-panel border-border shadow-sm py-0 overflow-hidden">
        <CardContent className="p-5 flex flex-col gap-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-border/40 pb-2 flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            Address & Locations
          </h3>

          <div className="flex flex-col gap-2">
            <Label htmlFor="address" className="text-xs font-bold text-text/80">
              Street Address
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 size-4 text-text-muted" />
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={!isEditing}
                className="min-h-20 w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background disabled:bg-muted/40 disabled:opacity-90 font-medium text-sm outline-none focus:border-primary/50 text-text transition-colors resize-none"
                placeholder="Enter your street address..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="state" className="text-xs font-bold text-text/80">
                State / Region
              </Label>
              <Input
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                disabled={!isEditing}
                className="disabled:bg-muted/40 disabled:opacity-90 font-medium text-text bg-background border-border"
                placeholder="e.g. Maharashtra"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="pincode"
                className="text-xs font-bold text-text/80"
              >
                Pincode / Postal Code
              </Label>
              <Input
                id="pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                disabled={!isEditing}
                className="disabled:bg-muted/40 disabled:opacity-90 font-medium text-text bg-background border-border"
                placeholder="e.g. 400001"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
