import { ProfilePage } from "@/modules/profile/pages/profile-page";

export const metadata = {
  title: "Profile Settings | Deco Panel",
  description: "View and edit your personal contact and address profile details.",
};

export default function ProfileRoute() {
  return <ProfilePage />;
}
