import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export const Route = createFileRoute("/otp")({
  component: OTP,
  head: () => ({ meta: [{ title: "Verify OTP — ITL AI" }] }),
});

function OTP() {
  return (
    <AuthLayout title="Enter verification code." subtitle="We sent a 6-digit code to your email.">
      <div className="flex justify-center">
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} className="h-12 w-12" />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <Button className="mt-6 h-11 w-full rounded-xl gradient-primary text-primary-foreground shadow-soft">
        Verify
      </Button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Didn't receive it? <button className="font-semibold text-primary hover:underline">Resend</button>
      </p>
    </AuthLayout>
  );
}
