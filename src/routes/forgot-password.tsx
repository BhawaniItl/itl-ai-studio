import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  component: Forgot,
  head: () => ({ meta: [{ title: "Forgot password — ITL AI" }] }),
});

function Forgot() {
  return (
    <AuthLayout
      title="Reset your password."
      subtitle="We'll email you a secure link."
      footer={<><Link to="/login" className="font-semibold text-primary hover:underline">Back to sign in</Link></>}
    >
      <form className="space-y-4">
        <div>
          <Label className="mb-1.5 block text-xs">Work email</Label>
          <Input type="email" placeholder="you@firm.in" className="h-11" />
        </div>
        <Button className="h-11 w-full rounded-xl gradient-primary text-primary-foreground shadow-soft">
          Send reset link
        </Button>
      </form>
    </AuthLayout>
  );
}
