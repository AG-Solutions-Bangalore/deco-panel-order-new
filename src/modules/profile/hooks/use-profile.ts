"use client";

import { useEffect, useState } from "react";
import { useProfileStore, UserProfile } from "../store/use-profile-store";
import { useWebHaptics } from "web-haptics/react";
import { useRouter } from "next/navigation";

export function useProfile() {
  const router = useRouter();
  const { trigger } = useWebHaptics();
  const { profile, isLoading, fetchProfile, updateProfile } = useProfileStore();
  const [isEditing, setIsEditing] = useState(false);
  
  // Local form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  // Sync state with fetched profile data
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || profile.name || "");
      setEmail(profile.email || "");
      setMobile(profile.mobile || "");
      setAddress(profile.address || "");
      setState(profile.state || "");
      setPincode(profile.pincode || "");
    }
  }, [profile]);

  const handleEditToggle = () => {
    trigger("light");
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    trigger("medium");
    if (profile) {
      setFullName(profile.full_name || profile.name || "");
      setEmail(profile.email || "");
      setMobile(profile.mobile || "");
      setAddress(profile.address || "");
      setState(profile.state || "");
      setPincode(profile.pincode || "");
    }
    setIsEditing(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    trigger("heavy");

    const updatedData: Partial<UserProfile> = {
      full_name: fullName,
      name: fullName,
      email,
      mobile,
      address,
      state,
      pincode,
    };

    await updateProfile(updatedData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    trigger("heavy");
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user_type_id");
      localStorage.removeItem("id");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
    }
    router.push("/login");
  };

  return {
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
  };
}
