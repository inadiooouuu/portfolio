// ponytail: Admin layout built on Kumo's sidebar and the shared app header.
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Sidebar } from "@/shared/ui/sidebar";
import { AdminSidebar } from "./sidebar";
import { AdminHeader, type HeaderUser } from "@/shared/ui/header";
import { FullScreenLoader } from "@/shared/ui/full-screen-loader";
import { apiClient } from "@/shared/api/client";
import { useToast } from "@/shared/ui/toast";
import { Effect } from "effect";

interface UserProfile extends HeaderUser {
  email: string;
  name: string;
  bio: string;
  avatar_url: string | null;
  role: string;
}

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!apiClient.isAuthenticated()) {
      navigate("/admin/login");
      return;
    }

    Effect.runPromise(
      apiClient.get<{ success: boolean; data: UserProfile }>(
        "/api/v1/user/profile"
      )
    )
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        toast({
          title: "Session Expired",
          description: err.message || "Please sign in again",
          variant: "destructive",
        });
        apiClient.removeToken();
        navigate("/admin/login");
      })
      .finally(() => {
        setLoadingProfile(false);
      });
  }, [navigate, toast]);

  const handleLogout = () => {
    apiClient.removeToken();
    navigate("/admin/login");
    toast({ title: "Signed Out", description: "You have been logged out" });
  };

  if (loadingProfile) {
    return <FullScreenLoader className="bg-kumo-recessed" />;
  }

  const currentPath = location.pathname;
  let pageTitle = "Projects";
  if (currentPath.includes("stacks")) pageTitle = "Tech Stacks";
  else if (currentPath.includes("articles")) pageTitle = "Articles";
  else if (currentPath.includes("achievements")) pageTitle = "Achievements";
  else if (currentPath.includes("work")) pageTitle = "Work Experience";
  else if (currentPath.includes("storage")) pageTitle = "Storage";
  else if (currentPath.includes("profile")) pageTitle = "Profile Settings";

  return (
    <Sidebar.Provider
      defaultOpen
      collapsible="icon"
      className="h-svh overflow-hidden"
    >
      <AdminSidebar />

      <main className="flex h-full min-h-0 flex-1 flex-col bg-kumo-recessed">
        <AdminHeader
          pageTitle={pageTitle}
          user={profile}
          onLogout={handleLogout}
        />

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto size-full max-w-360 px-4 py-6 sm:px-6">
            <Outlet context={{ profile, setProfile }} />
          </div>
        </div>
      </main>
    </Sidebar.Provider>
  );
}
