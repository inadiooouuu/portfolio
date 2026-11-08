import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Layers,
  FolderGit,
  FileText,
  Award,
  Briefcase,
  User,
  HardDrive,
  Search,
} from "lucide-react";
import { Sidebar, useSidebar } from "@cloudflare/kumo";
import { Input } from "@/shared/ui/input";
import { Blobatar } from "@blobatar/react";
import "blobatar/motion.css";

const mainNavItems = [
  { path: "/admin/projects", label: "Projects", icon: FolderGit },
  { path: "/admin/stacks", label: "Tech Stacks", icon: Layers },
  { path: "/admin/articles", label: "Articles", icon: FileText },
];

const secondaryNavItems = [
  { path: "/admin/achievements", label: "Achievements", icon: Award },
  { path: "/admin/work", label: "Work Experience", icon: Briefcase },
  { path: "/admin/storage", label: "Storage", icon: HardDrive },
  { path: "/admin/profile", label: "Profile Settings", icon: User },
];

export function AdminSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { state } = useSidebar();
  const [query, setQuery] = useState("");

  const isCollapsed = state === "collapsed";

  const filterItems = (items: typeof mainNavItems) => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => item.label.toLowerCase().includes(term));
  };

  const filteredMain = filterItems(mainNavItems);
  const filteredSecondary = filterItems(secondaryNavItems);
  const hasResults = filteredMain.length > 0 || filteredSecondary.length > 0;

  const isActive = (path: string) =>
    currentPath === path ||
    (path === "/admin/projects" && currentPath === "/admin/dashboard");

  return (
    <Sidebar>
      <Sidebar.Header>
        <Link
          to="/admin/projects"
          className="flex min-w-0 items-center gap-2.5 no-underline"
        >
          <div className="flex items-center gap-2.5">
            <Blobatar
              name="simone"
              animate="always"
              background="circle"
              amplitude={20}
              className="block w-12 h-12"
            />
          </div>
        </Link>
      </Sidebar.Header>

      <Sidebar.Content>
        {!isCollapsed && (
          <div className="relative mb-2 px-0.5">
            <Search
              size={13}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-kumo-subtle"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search menu..."
              aria-label="Search navigation"
              className="h-7 pl-8 text-xs"
            />
          </div>
        )}

        {filteredMain.length > 0 && (
          <Sidebar.Group>
            <Sidebar.GroupLabel>Content</Sidebar.GroupLabel>
            <Sidebar.Menu>
              {filteredMain.map((item) => (
                <Sidebar.MenuButton
                  key={item.path}
                  icon={item.icon}
                  href={item.path}
                  active={isActive(item.path)}
                >
                  {item.label}
                </Sidebar.MenuButton>
              ))}
            </Sidebar.Menu>
          </Sidebar.Group>
        )}

        {filteredSecondary.length > 0 && (
          <Sidebar.Group>
            <Sidebar.GroupLabel>Settings</Sidebar.GroupLabel>
            <Sidebar.Menu>
              {filteredSecondary.map((item) => (
                <Sidebar.MenuButton
                  key={item.path}
                  icon={item.icon}
                  href={item.path}
                  active={isActive(item.path)}
                >
                  {item.label}
                </Sidebar.MenuButton>
              ))}
            </Sidebar.Menu>
          </Sidebar.Group>
        )}

        {query && !hasResults && !isCollapsed && (
          <p className="px-2 py-4 text-center text-xs text-kumo-subtle">
            No menu found.
          </p>
        )}
      </Sidebar.Content>
    </Sidebar>
  );
}
