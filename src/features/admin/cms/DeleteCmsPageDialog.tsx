/* eslint-disable prettier/prettier */
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import type { CmsContentPage } from "@/types/cms";

interface DeleteCmsPageDialogProps {
  page: CmsContentPage | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  deleting: boolean;
}

export function DeleteCmsPageDialog({
  page,
  onOpenChange,
  onConfirm,
  deleting,
}: DeleteCmsPageDialogProps) {
  return (
    <AlertDialog open={Boolean(page)} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{page?.title}”?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes the page at <span className="font-mono">/{page?.route}</span>{" "}
            and all of its content. This can't be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting ? "Deleting..." : "Delete page"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}