import { useModalStore } from "@/store/modalStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**
 * Global modal renderer — mount once (already done in RootComponent).
 * Modals are opened via `modal.confirm({...})` / `useModalStore.open(...)`.
 */
export function ModalManager() {
  const stack = useModalStore((s) => s.stack);
  const close = useModalStore((s) => s.close);

  return (
    <>
      {stack.map((m) => (
        <Dialog key={m.id} open onOpenChange={(v) => !v && close(m.id, false)}>
          <DialogContent className="max-w-lg">
            {(m.title || m.description) && (
              <DialogHeader>
                {m.title && <DialogTitle>{m.title}</DialogTitle>}
                {m.description && <DialogDescription>{m.description}</DialogDescription>}
              </DialogHeader>
            )}
            {m.content}
            {(m.kind === "confirm" || m.kind === "delete" || m.kind === "alert") && (
              <DialogFooter className="mt-2 gap-2 sm:gap-2">
                {m.kind !== "alert" && (
                  <Button variant="outline" onClick={() => close(m.id, false)}>
                    {m.cancelLabel ?? "Cancel"}
                  </Button>
                )}
                <Button
                  variant={m.destructive || m.kind === "delete" ? "destructive" : "default"}
                  onClick={() => close(m.id, true)}
                >
                  {m.confirmLabel ?? (m.kind === "delete" ? "Delete" : "Confirm")}
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      ))}
    </>
  );
}
