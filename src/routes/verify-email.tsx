import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { authService } from "@/services/auth.service";

export const Route = createFileRoute("/verify-email")({
  component: Verify,
  head: () => ({ meta: [{ title: "Verify email — ITL AI" }] }),
});

type Step = "email" | "otp" | "done";

function Verify() {
  const nav = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestOtp() {
    setBusy(true);
    setError(null);
    await authService.requestEmailOtp(email);
    setBusy(false);
    setStep("otp");
    toast.success("Verification code sent");
  }

  async function verify() {
    setBusy(true);
    setError(null);
    const r = await authService.verifyEmailOtp(email, otp);
    setBusy(false);
    if (!r.ok) {
      setError("Invalid or expired code.");
      return;
    }
    setStep("done");
    toast.success("Email verified");
  }

  return (
    <AuthLayout
      title={step === "done" ? "Email verified." : "Verify your email."}
      subtitle={
        step === "email"
          ? "Enter your email to receive a verification code."
          : step === "otp"
            ? `We sent a 6-digit code to ${email}.`
            : "You can now sign in to your workspace."
      }
      footer={
        <>
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      {error && <p className="mb-3 text-sm text-destructive">{error}</p>}
      {step === "email" && (
        <div className="space-y-4">
          <div>
            <Label className="mb-1.5 block text-xs">Email</Label>
            <Input
              type="email"
              placeholder="you@firm.in"
              className="h-11"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            onClick={requestOtp}
            disabled={busy || !email}
            className="h-11 w-full rounded-xl gradient-primary text-primary-foreground shadow-soft"
          >
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Send code
          </Button>
        </div>
      )}
      {step === "otp" && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} className="h-12 w-12" />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button
            onClick={verify}
            disabled={busy || otp.length !== 6}
            className="h-11 w-full rounded-xl gradient-primary text-primary-foreground shadow-soft"
          >
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Verify
          </Button>
          <button
            onClick={requestOtp}
            className="w-full text-center text-xs font-semibold text-primary hover:underline"
          >
            Resend code
          </button>
        </div>
      )}
      {step === "done" && (
        <div className="space-y-4 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-success/10 text-success">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <Button
            onClick={() => nav({ to: "/login" })}
            className="h-11 w-full rounded-xl gradient-primary text-primary-foreground shadow-soft"
          >
            Continue to sign in
          </Button>
        </div>
      )}
    </AuthLayout>
  );
}
