import { useEffect, useState } from "react";
import { useProfileStore, UserProfile } from "../store/use-profile-store";
import { useWebHaptics } from "web-haptics/react";
import { useNavigate } from "react-router-dom";

export function useProfile() {
  const navigate = useNavigate();
  const { trigger } = useWebHaptics();
  const { profile, isLoading, fetchProfile, updateProfile } = useProfileStore();
  const [isEditing, setIsEditing] = useState(false);
  const [userImageFile, setUserImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleImageChange = (file: File) => {
    setUserImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  
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
    setUserImageFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
    setIsEditing(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    trigger("heavy");

    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("name", fullName);
    formData.append("email", email);
    formData.append("mobile", mobile);
    formData.append("address", address);
    formData.append("state", state);
    formData.append("pincode", pincode);
    
    if (userImageFile) {
      formData.append("user_image", userImageFile);
    }

    await updateProfile(formData);
    setUserImageFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
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
    navigate("/login");
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
    userImageFile,
    previewUrl,
    setFullName,
    setEmail,
    setMobile,
    setAddress,
    setState,
    setPincode,
    handleImageChange,
    handleEditToggle,
    handleCancel,
    handleSave,
    handleLogout,
  };
}
