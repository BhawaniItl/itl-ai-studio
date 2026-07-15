import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useContact } from "@/hooks";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({ meta: [{ title: "Contact — ITL AI" }, { name: "description", content: "Get in touch with the ITL AI team — sales, support and partnerships." }] }),
});

function Contact() {
  const { data } = useContact();
  return (
    <PublicLayout>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Contact</p>
          <h1 className="mt-3 font-display text-5xl font-bold tracking-tight">Let's talk.</h1>
          <p className="mt-4 text-muted-foreground">
            Whether you're a solo practitioner or a firm-wide buyer, we'd love to hear from you.
          </p>
          <div className="mt-8 space-y-4 text-sm">
            {data && (
              <>
                <Row icon={<Mail className="h-4 w-4" />} label="Email" value={data.info.email} />
                <Row icon={<Phone className="h-4 w-4" />} label="Phone" value={data.info.phone} />
                <Row icon={<MapPin className="h-4 w-4" />} label="Office" value={data.info.address} />
                <Row icon={<Clock className="h-4 w-4" />} label="Hours" value={data.info.hours} />
              </>
            )}
          </div>
        </div>
        <form className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="mb-1.5 block text-xs">Name</Label>
              <Input placeholder="Your name" className="h-11" />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs">Email</Label>
              <Input type="email" placeholder="you@firm.in" className="h-11" />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs">Firm</Label>
              <Input placeholder="Firm name" className="h-11" />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs">Reason</Label>
              <Select>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {(data?.reasons ?? []).map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <Label className="mb-1.5 block text-xs">Message</Label>
            <Textarea rows={5} placeholder="How can we help?" />
          </div>
          <Button className="mt-6 h-11 w-full rounded-xl gradient-primary text-primary-foreground shadow-soft">
            Send message
          </Button>
        </form>
      </section>
    </PublicLayout>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-lg bg-primary/8 text-primary">{icon}</div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}
