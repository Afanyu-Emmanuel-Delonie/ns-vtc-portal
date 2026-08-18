"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-md place-items-center">
      <Card className="w-full">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--slate)]">
            Staff portal
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Login</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--slate)]">
            Use a demo credential to enter the dashboard scaffold.
          </p>
        </div>
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            document.cookie = "ns_vtc_auth=demo; path=/";
            router.push("/");
          }}
        >
          <div className="grid gap-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="recruiter@nsvtc.co.za"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Password</label>
            <Input type="password" defaultValue="••••••••" />
          </div>
          <Button type="submit">Enter dashboard</Button>
        </form>
      </Card>
    </div>
  );
}
