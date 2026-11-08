import { Link, useLocation } from "react-router-dom";
import {
  Layers,
  FolderGit,
  FileText,
  Award,
  Briefcase,
  User,
  HardDrive,
} from "lucide-react";
import { Sidebar, useSidebar } from "@/shared/ui/sidebar";
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
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) =>
    currentPath === path ||
    (path === "/admin/projects" && currentPath === "/admin/dashboard");

  return (
    <Sidebar>
      <Sidebar.Header className="flex min-h-14 items-center border-b border-kumo-line px-3">
        <Link
          to="/admin/projects"
          className="flex min-w-0 items-center gap-2.5 no-underline"
        >
          <Blobatar
            name="simone"
            animate="always"
            background="circle"
            amplitude={20}
            className="block size-9 shrink-0"
          />
          {!isCollapsed && (
            <span className="truncate text-xl font-medium text-kumo-strong">
              Dashboard
            </span>
          )}
        </Link>
      </Sidebar.Header>

      <Sidebar.Content>
        <Sidebar.Group>
          <Sidebar.GroupLabel>Content</Sidebar.GroupLabel>
          <Sidebar.Menu>
            {mainNavItems.map((item) => (
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

        <Sidebar.Group>
          <Sidebar.GroupLabel>Settings</Sidebar.GroupLabel>
          <Sidebar.Menu>
            {secondaryNavItems.map((item) => (
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
      </Sidebar.Content>

      <Sidebar.Footer className="border-t border-kumo-line p-2">
        <Sidebar.Trigger />
      </Sidebar.Footer>
    </Sidebar>
  );
}
