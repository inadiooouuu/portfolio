import { Suspense, lazy, forwardRef } from "react"
import type { ComponentType } from "react"
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link as RouterLink,
  useLocation,
} from "react-router-dom"
import { LinkProvider } from "@cloudflare/kumo"
import { HomePage } from "@/pages/home"
import { ToastProviderWrapper } from "@/shared/ui/toast"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { CustomCursor } from "@/shared/ui/custom-cursor"
import { FullScreenLoader } from "@/shared/ui/full-screen-loader"
import { useGridPattern } from "@/lib/grid-pattern"
import "@/app/styles/index.css"

// Route-level code splitting: only the landing page ships in the initial
// bundle; every other route (public and admin) loads on demand.
const lazyPage = (loader: () => Promise<{ default: ComponentType }>) =>
  lazy(loader)

const AboutPage = lazyPage(() =>
  import("@/pages/about").then((m) => ({ default: m.AboutPage })),
)
const ProjectsPage = lazyPage(() =>
  import("@/pages/projects").then((m) => ({ default: m.ProjectsPage })),
)
const ProjectDetailPage = lazyPage(() =>
  import("@/pages/project-detail").then((m) => ({ default: m.ProjectDetailPage })),
)
const AdminLoginPage = lazyPage(() =>
  import("@/pages/admin/login").then((m) => ({ default: m.AdminLoginPage })),
)
const AdminDashboardPage = lazyPage(() =>
  import("@/pages/admin/dashboard").then((m) => ({ default: m.AdminDashboardPage })),
)
const AdminProjectsPage = lazyPage(() =>
  import("@/pages/admin/projects").then((m) => ({ default: m.AdminProjectsPage })),
)
const AdminStacksPage = lazyPage(() =>
  import("@/pages/admin/stacks").then((m) => ({ default: m.AdminStacksPage })),
)
const AdminArticlesPage = lazyPage(() =>
  import("@/pages/admin/articles").then((m) => ({ default: m.AdminArticlesPage })),
)
const AdminAchievementsPage = lazyPage(() =>
  import("@/pages/admin/achievements").then((m) => ({ default: m.AdminAchievementsPage })),
)
const AdminWorkPage = lazyPage(() =>
  import("@/pages/admin/work").then((m) => ({ default: m.AdminWorkPage })),
)
const AdminStoragePage = lazyPage(() =>
  import("@/pages/admin/storage").then((m) => ({ default: m.AdminStoragePage })),
)
const AdminProfilePage = lazyPage(() =>
  import("@/pages/admin/profile").then((m) => ({ default: m.AdminProfilePage })),
)
const NotFoundPage = lazyPage(() =>
  import("@/pages/not-found").then((m) => ({ default: m.NotFoundPage })),
)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

// Kumo components render plain anchors; bridge them to React Router so all
// sidebar/breadcrumb navigation stays client-side.
const KumoRouterLink = forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string }
>(({ href, ...props }, ref) => (
  <RouterLink ref={ref} to={href ?? "/"} {...props} />
))
KumoRouterLink.displayName = "KumoRouterLink"

function PageFallback() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith("/admin")
  return (
    <FullScreenLoader className={isAdmin ? "bg-kumo-recessed" : undefined} />
  )
}

function App() {
  useGridPattern()

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProviderWrapper>
        <CustomCursor />
        <BrowserRouter>
          <LinkProvider component={KumoRouterLink}>
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:slug" element={<ProjectDetailPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* protected admin layout wrapper */}
                <Route path="/admin" element={<AdminDashboardPage />}>
                  <Route index element={<Navigate to="/admin/projects" replace />} />
                  <Route path="dashboard" element={<Navigate to="/admin/projects" replace />} />
                  <Route path="projects" element={<AdminProjectsPage />} />
                  <Route path="stacks" element={<AdminStacksPage />} />
                  <Route path="articles" element={<AdminArticlesPage />} />
                  <Route path="achievements" element={<AdminAchievementsPage />} />
                  <Route path="work" element={<AdminWorkPage />} />
                  <Route path="storage" element={<AdminStoragePage />} />
                  <Route path="profile" element={<AdminProfilePage />} />
                </Route>

                {/* Legacy redirect for /admin/dashboard */}
                <Route path="/admin/dashboard" element={<Navigate to="/admin/projects" replace />} />

                {/* Catch-all 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </LinkProvider>
        </BrowserRouter>
      </ToastProviderWrapper>
    </QueryClientProvider>
  )
}

export default App
