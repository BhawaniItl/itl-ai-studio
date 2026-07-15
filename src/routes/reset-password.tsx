import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  component: Reset,
  head: () => ({ meta: [{ title: "Set a new password — ITL AI" }] }),
});

function Reset() {
  return (
    <AuthLayout
      title="Set a new password."
      subtitle="Choose a strong password you don't use elsewhere."
      footer={<Link to="/login" className="font-semibold text-primary hover:underline">Back to sign in</Link>}
    >
      <form className="space-y-4">
        <div>
          <Label className="mb-1.5 block text-xs">New password</Label>
          <Input type="password" placeholder="••••••••" className="h-11" />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs">Confirm password</Label>
          <Input type="password" placeholder="••••••••" className="h-11" />
        </div>
        <Button className="h-11 w-full rounded-xl gradient-primary text-primary-foreground shadow-soft">
          Update password
        </Button>
      </form>
    </AuthLayout>
  );
}
