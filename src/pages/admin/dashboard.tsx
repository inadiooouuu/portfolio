// ponytail: Admin layout component built on Kumo's sidebar and loader
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { ChevronRight, Bell, ArrowUpRight, LogOut } from "lucide-react";
import { Sidebar, Loader, LinkButton, DropdownMenu } from "@cloudflare/kumo";
import { AdminSidebar } from "./sidebar";
import { Button } from "@/shared/kumo/button";
import { apiClient } from "@/shared/api/client";
import { Effect } from "effect";

interface UserProfile {
  email: string;
  name: string;
  bio: string;
  avatar_url: string | null;
  role: string;
}

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
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
        console.error("Failed to load profile", err);
        apiClient.removeToken();
        navigate("/admin/login");
      })
      .finally(() => {
        setLoadingProfile(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    apiClient.removeToken();
    navigate("/admin/login");
  };

  if (loadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-kumo-recessed text-kumo-subtle">
        <div className="flex flex-col items-center gap-4">
          <Loader size="lg" aria-label="Loading console" />
          <span className="text-xs font-medium tracking-wider text-kumo-subtle uppercase">
            Loading Console...
          </span>
        </div>
      </div>
    );
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
    <Sidebar.Provider>
      <AdminSidebar />

      <main className="flex min-h-svh flex-1 flex-col bg-kumo-recessed">
        <header className="sticky top-0 z-40 shrink-0 select-none border-b border-kumo-line bg-kumo-base/95 backdrop-blur supports-[backdrop-filter]:bg-kumo-base/80">
          <div className="flex h-12 items-center gap-3 px-3 sm:px-5">
            <Sidebar.Trigger className="text-kumo-subtle hover:text-kumo-default" />
            <div className="hidden h-4 w-px bg-kumo-line sm:block" />
            <nav className="hidden items-center gap-1.5 text-[13px] sm:flex">
              <span className="text-kumo-subtle">Console</span>
              <ChevronRight size={13} className="text-kumo-subtle/60" />
              <span className="font-medium text-kumo-default">{pageTitle}</span>
            </nav>
            <span className="text-sm font-medium text-kumo-default sm:hidden">
              {pageTitle}
            </span>

            <div className="ml-auto flex items-center gap-2">
              <LinkButton
                href="/"
                external
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                View site
                <ArrowUpRight size={13} />
              </LinkButton>

              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Notifications"
                className="relative"
              >
                <Bell size={15} />
                <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[var(--color-cloudflare-orange)]" />
              </Button>

              <DropdownMenu>
                <DropdownMenu.Trigger
                  aria-label="Open profile menu"
                  className="cursor-pointer rounded-full border border-kumo-line bg-kumo-tint p-0 outline-none transition focus-visible:ring-2 focus-visible:ring-kumo-brand/40"
                >
                  <img
                    src={profile?.avatar_url || "/apple-touch-icon.png"}
                    alt="Profile"
                    className="size-7 rounded-full object-cover"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end" className="min-w-56">
                  <DropdownMenu.Label>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-xs font-medium text-kumo-strong">
                        {profile?.name}
                      </span>
                      <span className="truncate text-[11px] font-normal text-kumo-subtle">
                        {profile?.email}
                      </span>
                    </div>
                  </DropdownMenu.Label>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item
                    icon={<LogOut size={14} />}
                    variant="danger"
                    onClick={handleLogout}
                  >
                    Log out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto size-full max-w-360 px-4 py-6 sm:px-6">
            <Outlet context={{ profile, setProfile }} />
          </div>
        </div>
      </main>
    </Sidebar.Provider>
  );
}
