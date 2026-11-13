import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { apiClient } from "@/shared/api/client"
import { useToast } from "@/shared/ui/toast"
import { Effect } from "effect"

export const profileSchema = z.object({
  name: z.string().min(1, "Display Name is required"),
  bio: z.string().min(1, "Bio is required"),
  avatarUrl: z.string().nullable().optional(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>

interface UserProfile {
  email: string;
  name: string;
  bio: string;
  avatar_url: string | null;
  role: string;
}

export function useProfileForm(profile: UserProfile | null, setProfile: (p: UserProfile) => void) {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      bio: profile?.bio || "",
      avatarUrl: profile?.avatar_url || "",
    },
  })

  // ponytail: sync form state with profile prop when loaded or updated
  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        bio: profile.bio,
        avatarUrl: profile.avatar_url || "",
      })
    }
  }, [profile, form])

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    Effect.runPromise(apiClient.uploadFile(file))
      .then((url) => {
        form.setValue("avatarUrl", url)
        toast({ title: "Uploaded", description: "Avatar uploaded successfully", variant: "success" })
      })
      .catch((err) => {
        toast({
          title: "Upload Failed",
          description: err.message || "Failed to upload avatar",
          variant: "destructive",
        })
      })
      .finally(() => {
        setUploading(false)
      })
  }

  const onSubmit = (data: ProfileFormValues) => {
    setSaving(true)

    Effect.runPromise(
      apiClient.put<{ success: boolean; data: UserProfile }>("/api/v1/user/profile", {
        name: data.name,
        bio: data.bio,
        avatar_url: data.avatarUrl || null,
      })
    )
      .then((res) => {
        setProfile(res.data)
        toast({ title: "Saved", description: "Profile updated successfully", variant: "success" })
      })
      .catch((err) => {
        toast({
          title: "Update Failed",
          description: err.message || "Failed to update profile",
          variant: "destructive",
        })
      })
      .finally(() => {
        setSaving(false)
      })
  }

  return {
    form,
    saving,
    uploading,
    handleAvatarUpload,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
