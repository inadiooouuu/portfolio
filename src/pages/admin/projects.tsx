// ponytail: projects crud page separated from unified dashboard layout
import { useState, useEffect } from "react";
import { Plus, BookOpen, Images, Layers, Link2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { RowActions } from "@/shared/ui/row-actions";
import { apiClient } from "@/shared/api/client";
import { Effect } from "effect";
import { useToast } from "@/shared/ui/toast";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { ProjectDrawer } from "@/features/project/components/project-drawer";
import { ProjectStoriesDrawer } from "@/features/project/components/project-stories-drawer";
import { ProjectTechStacksDrawer } from "@/features/project/components/project-tech-stacks-drawer";
import { ProjectGalleryDrawer } from "@/features/project/components/project-gallery-drawer";
import { ProjectResourcesDrawer } from "@/features/project/components/project-resources-drawer";

import { BasePageLayout } from "@/shared/ui/base-page-layout";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/shared/ui/table";
import { Skeleton } from "@/shared/ui/skeleton";
import type { Project } from "@/features/project/types";
import type { TechStack } from "@/features/tech-stack/types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function AdminProjectsPage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [allStacks, setAllStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const [storiesOpen, setStoriesOpen] = useState(false);
  const [techStacksOpen, setTechStacksOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProjects = () => {
    setLoading(true);
    Effect.runPromise(apiClient.get<ApiResponse<Project[]>>("/api/v1/projects"))
      .then((res) => setProjects(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const fetchTechStacks = () => {
    Effect.runPromise(apiClient.get<ApiResponse<TechStack[]>>("/api/v1/tech-stacks"))
      .then((res) => setAllStacks(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProjects();
    fetchTechStacks();
  }, []);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setFormOpen(true);
  };

  const handleOpenStories = (project: Project) => {
    setEditingProject(project);
    setStoriesOpen(true);
  };

  const handleOpenTechStacks = (project: Project) => {
    setEditingProject(project);
    setTechStacksOpen(true);
  };

  const handleOpenGallery = (project: Project) => {
    setEditingProject(project);
    setGalleryOpen(true);
  };

  const handleOpenResources = (project: Project) => {
    setEditingProject(project);
    setResourcesOpen(true);
  };

  const handleDelete = (soft: boolean) => {
    if (!deleteProject) return;
    setDeleting(true);
    Effect.runPromise(apiClient.delete(`/api/v1/projects/${deleteProject.id}`, `?soft=${soft}`))
      .then(() => {
        setDeleteProject(null);
        fetchProjects();
        toast({ title: "Deleted", description: "Project deleted successfully", variant: "success" });
      })
      .catch((err) => {
        toast({ title: "Deletion Failed", description: err.message || "Deletion failed", variant: "destructive" });
      })
      .finally(() => setDeleting(false));
  };

  return (
    <BasePageLayout
      title="Projects"
      subtitle="Manage project records, case stories, tech stack join links, and demo assets"
      headerAction={
        <Button onClick={handleOpenCreate} className="gap-2 self-start">
          <Plus size={16} /> Add Project
        </Button>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-32">Thumbnail</TableHead>
            <TableHead>Project Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Relations</TableHead>
            <TableHead className="text-right" fixed="right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <Skeleton className="h-12 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                </TableCell>
                <TableCell className="text-right" fixed="right">
                  <Skeleton className="ml-auto size-8 rounded-md" />
                </TableCell>
              </TableRow>
            ))
          ) : projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="p-8 text-center text-muted-foreground">
                No projects configured. Click 'Add Project' to get started.
              </TableCell>
            </TableRow>
          ) : (
            projects.map((proj, idx) => (
              <TableRow
                key={proj.id}
                className="animate-content-enter"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <TableCell>
                  <div className="shine-enter w-20 h-12 rounded-md">
                    <img
                      src={proj.thumbnail_url}
                      alt={proj.title}
                      className="w-full h-full rounded-md object-cover border border-border bg-muted"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground">{proj.title}</TableCell>
                <TableCell className="text-muted-foreground text-xs max-w-xs truncate">{proj.description}</TableCell>
                <TableCell className="text-muted-foreground text-xs space-y-1">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary">{proj.stories?.length || 0} Stories</Badge>
                    <Badge variant="secondary">{proj.tech_stacks?.length || 0} Stacks</Badge>
                    <Badge variant="secondary">{proj.images?.length || 0} Gallery</Badge>
                    <Badge variant="secondary">{proj.resources?.length || 0} Links</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right whitespace-nowrap" fixed="right">
                  <div className="flex justify-end">
                    <RowActions
                      actions={[
                        { key: "stories", label: "Manage stories", icon: <BookOpen size={14} />, onSelect: () => handleOpenStories(proj) },
                        { key: "stacks", label: "Manage tech stacks", icon: <Layers size={14} />, onSelect: () => handleOpenTechStacks(proj) },
                        { key: "gallery", label: "Manage gallery", icon: <Images size={14} />, onSelect: () => handleOpenGallery(proj) },
                        { key: "resources", label: "Manage links", icon: <Link2 size={14} />, onSelect: () => handleOpenResources(proj) },
                        { key: "edit", label: "Edit project", icon: <Pencil size={14} />, onSelect: () => handleOpenEdit(proj) },
                        { key: "delete", label: "Delete project", icon: <Trash2 size={14} />, variant: "danger", onSelect: () => setDeleteProject(proj) },
                      ]}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ProjectDrawer
        open={formOpen}
        onOpenChange={setFormOpen}
        editingProject={editingProject}
        onSuccess={fetchProjects}
      />

      <ProjectStoriesDrawer
        open={storiesOpen}
        onOpenChange={setStoriesOpen}
        project={editingProject}
        setProject={setEditingProject}
        onSuccess={fetchProjects}
      />

      <ProjectTechStacksDrawer
        open={techStacksOpen}
        onOpenChange={setTechStacksOpen}
        project={editingProject}
        setProject={setEditingProject}
        allStacks={allStacks}
        onSuccess={fetchProjects}
      />

      <ProjectGalleryDrawer
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        project={editingProject}
        setProject={setEditingProject}
        onSuccess={fetchProjects}
      />

      <ProjectResourcesDrawer
        open={resourcesOpen}
        onOpenChange={setResourcesOpen}
        project={editingProject}
        setProject={setEditingProject}
        onSuccess={fetchProjects}
      />

      <ConfirmDialog
        open={deleteProject !== null}
        onOpenChange={(open) => { if (!open && !deleting) setDeleteProject(null); }}
        title="Delete project?"
        description="Soft delete hides the project from listings but keeps the record. Delete permanently removes it and all related data. This action cannot be undone."
        confirmLabel="Delete permanently"
        loading={deleting}
        secondaryAction={{ label: "Soft delete", onAction: () => handleDelete(true) }}
        onConfirm={() => handleDelete(false)}
      />
    </BasePageLayout>
  );
}
