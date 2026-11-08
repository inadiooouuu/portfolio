import { LogOut } from "lucide-react";
import { Breadcrumbs, DropdownMenu } from "@cloudflare/kumo";

export interface HeaderUser {
  name?: string;
  email?: string;
  avatar_url?: string | null;
}

interface AdminHeaderProps {
  pageTitle: string;
  user: HeaderUser | null;
  onLogout: () => void;
}

/**
 * Admin console header. Cloudflare-style: breadcrumb on the left, user
 * identity on the right. No sidebar trigger (that lives in the sidebar
 * footer) and no notifications while they are disabled.
 */
export function AdminHeader({ pageTitle, user, onLogout }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 shrink-0 select-none border-b border-kumo-line bg-kumo-base/95 backdrop-blur supports-[backdrop-filter]:bg-kumo-base/80">
      <div className="flex h-14 items-center gap-3 px-3 sm:px-5">
        <Breadcrumbs size="sm">
          <Breadcrumbs.Link href="/admin/projects">Dashboard</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>{pageTitle}</Breadcrumbs.Current>
        </Breadcrumbs>

        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenu.Trigger
              aria-label="Open profile menu"
              className="flex cursor-pointer items-center gap-2 rounded-md border border-kumo-line bg-kumo-tint p-1 pr-2.5 outline-none transition focus-visible:ring-2 focus-visible:ring-kumo-brand/40"
            >
              <img
                src={user?.avatar_url || "/apple-touch-icon.png"}
                alt="Profile"
                className="size-7 rounded-full object-cover"
              />
              <span className="hidden min-w-0 flex-col text-left sm:flex">
                <span className="max-w-40 truncate text-md font-medium text-kumo-strong">
                  {user?.name}
                </span>
              </span>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" className="min-w-56 shadow-none hover:shadow-none border border-neutral-200">
              <DropdownMenu.Group>
                <DropdownMenu.Label className="flex gap-2 pl-2! justify-start items-center">
                  <img
                    src={user?.avatar_url || "/apple-touch-icon.png"}
                    alt="Profile"
                    className="size-7 rounded-full object-cover"
                  />
                  <span className="hidden min-w-0 flex-col text-left sm:flex">
                    <span className="max-w-40 truncate text-md font-medium text-kumo-strong">
                      {user?.name}
                    </span>
                    <span className="truncate text-xs font-normal text-kumo-subtle">
                      {user?.email}
                    </span>
                  </span>
                </DropdownMenu.Label>
              </DropdownMenu.Group>
              <DropdownMenu.Separator />
              <DropdownMenu.Item
                icon={<LogOut size={14} />}
                variant="danger"
                onClick={onLogout}
              >
                Log out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
