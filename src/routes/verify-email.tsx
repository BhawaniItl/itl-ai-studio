import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/verify-email")({
  component: Verify,
  head: () => ({ meta: [{ title: "Verify email — ITL AI" }] }),
});

function Verify() {
  return (
    <AuthLayout title="Check your inbox." subtitle="We sent a verification link to your email address.">
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
        <CheckCircle2 className="mb-3 h-8 w-8 text-success" />
        <p className="text-sm font-semibold">Verification email sent</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Click the link in the email to activate your workspace. You can close this tab.
        </p>
      </div>
      <Button asChild variant="outline" className="mt-4 h-11 w-full rounded-xl">
        <Link to="/login">Return to sign in</Link>
      </Button>
    </AuthLayout>
  );
}
