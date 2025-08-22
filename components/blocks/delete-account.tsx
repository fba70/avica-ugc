"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { UserItem } from "@/types/types"
import { useUser } from "@clerk/nextjs"

interface DeleteAccountDialogProps {
  userId: string
  onDeleted?: () => void
}

export default function DeleteAccountDialog({
  userId,
  onDeleted,
}: DeleteAccountDialogProps) {
  const router = useRouter()
  const { signOut } = useAuth()
  const { user } = useUser()

  const [open, setOpen] = useState(false)
  const [confirmChecked, setConfirmChecked] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [dbUser, setDbUser] = useState<UserItem>()
  const [loadingUser, setLoadingUser] = useState(false)

  // Fetch user data when dialog opens
  useEffect(() => {
    if (open && user?.id) {
      setLoadingUser(true)
      axios
        .get(`/api/user?externalId=${user.id}`)
        .then((res) => {
          const fetchedUser = res.data[0]
          setDbUser(fetchedUser)
          if (fetchedUser && userId !== fetchedUser.id) {
            toast.error("User ID mismatch. Cannot proceed with deletion.")
            setOpen(false)
          }
        })
        .catch(() => toast.error("Failed to fetch user data."))
        .finally(() => setLoadingUser(false))
    }
  }, [open, user?.id, userId])

  console.log("DB User:", dbUser)

  const handleDelete = async () => {
    if (!dbUser?.id) {
      toast.error("User data not loaded. Cannot delete account.")
      return
    }
    setDeleting(true)
    try {
      await axios.patch(`/api/user/${dbUser.id}`, {
        status: "deleted",
        email: `deleted_${dbUser.email}`,
        externalId: `deleted_${dbUser.externalId}`,
      })
      toast.success("Account deleted. Logging out...")
      setOpen(false)
      if (onDeleted) onDeleted()

      // Clerk user sign out and navigation to home page
      await signOut()
      router.push("/")
    } catch (err) {
      toast.error("Failed to delete account.")
      console.log("Error deleting account:", err)
    } finally {
      setDeleting(false)
      setConfirmChecked(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Trash2 className="mr-2" />
          DELETE YOUR ACCOUNT
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            This action is{" "}
            <span className="font-bold text-red-500">irreversible</span>.<br />
            All your user account data will be deleted.
            <br />
            Please confirm you want to proceed.
          </DialogDescription>
        </DialogHeader>
        {loadingUser ? (
          <div className="text-gray-500">Loading user data...</div>
        ) : (
          <>
            <div className="flex items-center gap-2 mt-4">
              <Checkbox
                id="confirm-delete"
                checked={confirmChecked}
                onCheckedChange={(checked) =>
                  setConfirmChecked(checked === true)
                }
              />
              <label htmlFor="confirm-delete" className="text-sm">
                I understand and want to delete my account.
              </label>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={deleting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                disabled={!confirmChecked || deleting}
                onClick={handleDelete}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
