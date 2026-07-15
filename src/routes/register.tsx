import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/register")({
  component: Register,
  head: () => ({ meta: [{ title: "Create account — ITL AI" }] }),
});

function Register() {
  return (
    <AuthLayout
      title="Create your workspace."
      subtitle="Start free. No credit card required."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="mb-1.5 block text-xs">Full name</Label>
            <Input placeholder="Your name" className="h-11" />
          </div>
          <div>
            <Label className="mb-1.5 block text-xs">Firm (optional)</Label>
            <Input placeholder="Firm name" className="h-11" />
          </div>
        </div>
        <div>
          <Label className="mb-1.5 block text-xs">Work email</Label>
          <Input type="email" placeholder="you@firm.in" className="h-11" />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs">Password</Label>
          <Input type="password" placeholder="At least 8 characters" className="h-11" />
        </div>
        <Button className="h-11 w-full rounded-xl gradient-primary text-primary-foreground shadow-soft">
          Create account
        </Button>
        <p className="text-center text-[11px] text-muted-foreground">
          By continuing you agree to our{" "}
          <Link to="/terms" className="underline">Terms</Link> and{" "}
          <Link to="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </form>
    </AuthLayout>
  );
}
