"use client";

import Link from "next/link";
import { AdmLogo } from "@/components/brand/adm-logo";
import { LoginForm } from "@/components/login-form";
import { ADM_COPY } from "@/lib/brand/copy";
import { admPageClass } from "@/lib/brand/ui-classes";

export function LoginScreen() {
  return (
    <div className={admPageClass}>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Link href="/" className="flex flex-col items-center gap-2 self-center">
            <AdmLogo size="lg" priority />
            <span className="text-heading text-center text-lg font-semibold">{ADM_COPY.moduleTitle}</span>
            <span className="text-muted-foreground text-center text-sm">{ADM_COPY.serviceName}</span>
          </Link>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
