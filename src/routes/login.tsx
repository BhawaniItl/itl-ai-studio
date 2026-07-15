import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: "Sign in — ITL AI" }] }),
});

function Login() {
  return (
    <AuthLayout
      title="Welcome back."
      subtitle="Sign in to your ITL AI workspace."
      footer={
        <>
          New to ITL AI?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-4">
        <div>
          <Label className="mb-1.5 block text-xs">Work email</Label>
          <Input type="email" placeholder="you@firm.in" className="h-11" />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label className="text-xs">Password</Label>
            <Link to="/forgot-password" className="text-[11px] font-medium text-primary hover:underline">
              Forgot?
            </Link>
          </div>
          <Input type="password" placeholder="••••••••" className="h-11" />
        </div>
        <Button className="h-11 w-full rounded-xl gradient-primary text-primary-foreground shadow-soft">
          Sign in
        </Button>
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>
        <Button variant="outline" className="h-11 w-full rounded-xl">
          Continue with Google
        </Button>
      </form>
    </AuthLayout>
  );
}
