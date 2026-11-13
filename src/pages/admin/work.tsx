// ponytail: work experiences crud page separated from unified dashboard layout
import { useState, useEffect } from "react";
import { BasePageLayout } from "@/shared/ui/base-page-layout";
import { Plus, Pencil, Trash2, BookOpen, Image as ImageIcon } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { RowActions } from "@/shared/ui/row-actions";
import { Skeleton } from "@/shared/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/shared/ui/table";
import { apiClient } from "@/shared/api/client";
import { Effect } from "effect";
import { useToast } from "@/shared/ui/toast";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import type { WorkExperience } from "@/features/work-experience/types";
import { WorkExperienceDrawer } from "@/features/work-experience/components/work-experience-drawer";
import { WorkExperienceDescriptionsDrawer } from "@/features/work-experience/components/work-experience-descriptions-drawer";
import { WorkExperienceImagesDrawer } from "@/features/work-experience/components/work-experience-images-drawer";

export function AdminWorkPage() {
  const { toast } = useToast();
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<WorkExperience | null>(null);
  const [descOpen, setDescOpen] = useState(false);
  const [imagesOpen, setImagesOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchExperiences = () => {
    setLoading(true);
    Effect.runPromise(
      apiClient.get<{ success: boolean; data?: WorkExperience[] | { experiences?: WorkExperience[] } }>(
        "/api/v1/work-experiences"
      )
    )
      .then((res) => {
        const data = res.data;
        setExperiences(Array.isArray(data) ? data : (data?.experiences ?? []));
      })
      .catch((err) =>
        toast({
          title: "Load Failed",
          description: err.message || "Failed to load work experiences",
          variant: "destructive",
        })
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchExperiences(); }, []);

  const handleOpenCreate = () => { setEditingExp(null); setFormOpen(true); };
  const handleOpenEdit = (exp: WorkExperience) => { setEditingExp(exp); setFormOpen(true); };
  const handleOpenDescriptions = (exp: WorkExperience) => { setEditingExp(exp); setDescOpen(true); };
  const handleOpenImages = (exp: WorkExperience) => { setEditingExp(exp); setImagesOpen(true); };

  const handleDelete = () => {
    if (!deleteId) return;
    setDeleting(true);
    Effect.runPromise(apiClient.delete(`/api/v1/work-experiences/${deleteId}`))
      .then(() => { setDeleteId(null); fetchExperiences(); toast({ title: "Deleted", description: "Experience deleted", variant: "success" }); })
      .catch((err) => toast({ title: "Error", description: err.message, variant: "destructive" }))
      .finally(() => setDeleting(false));
  };

  return (
    <BasePageLayout
      title="Work Experiences"
      subtitle="Manage work experience records"
      headerAction={
        <Button onClick={handleOpenCreate} className="gap-2 self-start">
          <Plus size={16} /> Add Experience
        </Button>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="text-right" fixed="right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell className="text-right" fixed="right">
                  <Skeleton className="ml-auto size-8 rounded-md" />
                </TableCell>
              </TableRow>
            ))
          ) : experiences.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="p-8 text-center text-muted-foreground">
                No work experiences configured.
              </TableCell>
            </TableRow>
          ) : (
            experiences.map((exp) => (
              <TableRow key={exp.id}>
                <TableCell className="font-medium text-foreground">
                  <div className="flex flex-col">
                    <span>{exp.title}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {exp.images?.length ?? 0} images
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right" fixed="right">
                  <div className="flex justify-end">
                    <RowActions
                      actions={[
                        { key: "descriptions", label: "Manage descriptions", icon: <BookOpen size={14} />, onSelect: () => handleOpenDescriptions(exp) },
                        { key: "images", label: "Manage images", icon: <ImageIcon size={14} />, onSelect: () => handleOpenImages(exp) },
                        { key: "edit", label: "Edit experience", icon: <Pencil size={14} />, onSelect: () => handleOpenEdit(exp) },
                        { key: "delete", label: "Delete experience", icon: <Trash2 size={14} />, variant: "danger", onSelect: () => setDeleteId(exp.id) },
                      ]}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <WorkExperienceDrawer
        open={formOpen}
        onOpenChange={setFormOpen}
        editingExperience={editingExp}
        onSuccess={fetchExperiences}
      />

      <WorkExperienceDescriptionsDrawer
        open={descOpen}
        onOpenChange={setDescOpen}
        experience={editingExp}
        setExperience={setEditingExp}
        onSuccess={fetchExperiences}
      />

      <WorkExperienceImagesDrawer
        open={imagesOpen}
        onOpenChange={setImagesOpen}
        experience={editingExp}
        setExperience={setEditingExp}
        onSuccess={fetchExperiences}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => { if (!open && !deleting) setDeleteId(null); }}
        title="Delete experience?"
        description="This will permanently delete the work experience. This action cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </BasePageLayout>
  );
}
