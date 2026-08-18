import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UserCircle, Building2, Lock } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate">Account</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Profile</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-6">
          {/* Personal details */}
          <Card>
            <div className="mb-5 flex items-center gap-2.5">
              <UserCircle size={18} className="text-navy" />
              <h2 className="text-base font-semibold">Personal details</h2>
            </div>
            <form className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <label className="text-xs font-medium text-slate">First name</label>
                  <Input placeholder="First name" defaultValue="Recruitment" />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-xs font-medium text-slate">Last name</label>
                  <Input placeholder="Last name" defaultValue="Admin" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <label className="text-xs font-medium text-slate">Email address</label>
                <Input type="email" placeholder="Email" defaultValue="info@nsvtc.co.za" />
              </div>
              <div className="grid gap-1.5">
                <label className="text-xs font-medium text-slate">Phone number</label>
                <Input type="tel" placeholder="Phone" defaultValue="+250 788 000 000" />
              </div>
              <div className="grid gap-1.5">
                <label className="text-xs font-medium text-slate">Role / title</label>
                <Input placeholder="Role" defaultValue="Recruitment Manager" />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Save changes</Button>
              </div>
            </form>
          </Card>

          {/* School information */}
          <Card>
            <div className="mb-5 flex items-center gap-2.5">
              <Building2 size={18} className="text-navy" />
              <h2 className="text-base font-semibold">School information</h2>
            </div>
            <form className="grid gap-4">
              <div className="grid gap-1.5">
                <label className="text-xs font-medium text-slate">School name</label>
                <Input placeholder="School name" defaultValue="NS VTC" />
              </div>
              <div className="grid gap-1.5">
                <label className="text-xs font-medium text-slate">Primary contact</label>
                <Input placeholder="Primary contact" defaultValue="Recruitment Office" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <label className="text-xs font-medium text-slate">Contact email</label>
                  <Input type="email" placeholder="Contact email" defaultValue="info@nsvtc.co.za" />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-xs font-medium text-slate">Phone</label>
                  <Input type="tel" placeholder="Phone" defaultValue="+250 788 000 000" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <label className="text-xs font-medium text-slate">Address</label>
                <Input placeholder="Address" defaultValue="Kigali, Rwanda" />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Save changes</Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right column */}
        <div className="grid gap-6 self-start">
          {/* Avatar / identity card */}
          <Card className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-navy/10 text-navy">
              <UserCircle size={48} strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-heading text-lg font-bold">Recruitment Admin</p>
              <p className="text-sm text-slate">Recruitment Manager</p>
            </div>
            <span className="rounded-full border border-border bg-canvas px-3 py-1 text-xs font-semibold text-slate">
              NS VTC
            </span>
          </Card>

          {/* Security */}
          <Card>
            <div className="mb-5 flex items-center gap-2.5">
              <Lock size={18} className="text-navy" />
              <h2 className="text-base font-semibold">Security</h2>
            </div>
            <form className="grid gap-4">
              <div className="grid gap-1.5">
                <label className="text-xs font-medium text-slate">Current password</label>
                <Input type="password" placeholder="Current password" />
              </div>
              <div className="grid gap-1.5">
                <label className="text-xs font-medium text-slate">New password</label>
                <Input type="password" placeholder="New password" />
              </div>
              <div className="grid gap-1.5">
                <label className="text-xs font-medium text-slate">Confirm new password</label>
                <Input type="password" placeholder="Confirm password" />
              </div>
              <Button type="submit" variant="secondary">Update password</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
