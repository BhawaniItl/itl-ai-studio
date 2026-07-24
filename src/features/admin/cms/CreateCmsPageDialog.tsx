/* eslint-disable prettier/prettier */
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { isValidRoute } from "./cms-json-utils";

interface CreateCmsPageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (input: { route: string; title: string }) => Promise<boolean>;
}

export function CreateCmsPageDialog({ open, onOpenChange, onCreate }: CreateCmsPageDialogProps) {
  const [route, setRoute] = useState("");
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const routeTouched = route.length > 0;
  const routeInvalid = routeTouched && !isValidRoute(route);

  const reset = () => {
    setRoute("");
    setTitle("");
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const ok = await onCreate({ route, title });
    setSubmitting(false);
    if (ok) {
      reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New CMS page</DialogTitle>
          <DialogDescription>
            Creates an empty page you can build out with the JSON editor. The route can't be changed
            later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="new-cms-route">Route</Label>
            <Input
              id="new-cms-route"
              autoFocus
              value={route}
              onChange={(e) => setRoute(e.target.value.toLowerCase())}
              placeholder="e.g. careers"
              className={routeInvalid ? "border-destructive" : ""}
            />
            {routeInvalid && (
              <p className="text-xs text-destructive">
                Lowercase letters, numbers and hyphens only.
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-cms-title">Title</Label>
            <Input
              id="new-cms-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Careers"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!route.trim() || !title.trim() || routeInvalid || submitting}
          >
            {submitting ? "Creating..." : "Create page"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}