"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{
    text: string;
    kind: "error" | "info";
  } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setFeedback(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data: unknown = await res.json().catch(() => ({}));
    const err =
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : null;
    setPending(false);
    if (!res.ok) {
      setFeedback({
        text: err ?? "Не удалось войти",
        kind: "error",
      });
      return;
    }
    router.push("/overview");
    router.refresh();
  }

  async function handleSignUp(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setFeedback({
        text: "Укажите почту и пароль для регистрации (пароль от 8 символов).",
        kind: "error",
      });
      return;
    }
    setPending(true);
    setFeedback(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data: unknown = await res.json().catch(() => ({}));
    const err =
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : null;
    setPending(false);
    if (!res.ok) {
      setFeedback({
        text: err ?? "Не удалось зарегистрироваться",
        kind: "error",
      });
      return;
    }
    router.push("/overview");
    router.refresh();
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">С возвращением</CardTitle>
          <CardDescription>Войдите по почте и паролю</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-4">
              {feedback ? (
                <p
                  className={cn(
                    "text-center text-sm",
                    feedback.kind === "error"
                      ? "text-destructive"
                      : "text-primary",
                  )}
                  role={feedback.kind === "error" ? "alert" : "status"}
                >
                  {feedback.text}
                </p>
              ) : null}
              <Field>
                <FieldLabel htmlFor="email">Эл. почта</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.ru"
                  required
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  disabled={pending}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Пароль</FieldLabel>
                  <span className="ml-auto text-sm text-muted-foreground">
                    от 8 символов
                  </span>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  minLength={8}
                  required
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  disabled={pending}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={pending}>
                  {pending ? "…" : "Войти"}
                </Button>
                <FieldDescription className="text-center">
                  Нет аккаунта?{" "}
                  <a
                    href="#"
                    className="text-primary underline-offset-4 hover:underline"
                    onClick={handleSignUp}
                  >
                    Регистрация
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Продолжая, вы принимаете{" "}
        <a href="#" className="text-primary underline-offset-4 hover:underline">
          Условия использования
        </a>{" "}
        и{" "}
        <a href="#" className="text-primary underline-offset-4 hover:underline">
          Политику конфиденциальности
        </a>
        .
      </FieldDescription>
    </div>
  );
}
