import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@refinedev/core";
import { useForm } from "react-hook-form";
import{ Eye, EyeOff, Boxes, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginSchema, type LoginFormData } from "./schema";

export const LoginPage = () => {
  const { t } = useTranslation();
  const { mutate: login, isPending } = useLogin<LoginFormData>();

  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormData) => {
    setLoginError(null);

    login(values, {
      onSuccess: (data) => {
        if (!data.success) {
          setLoginError(data.error?.message ?? "Erro ao entrar");
        }
      },
    });
  };

  return (
    <main className="grid min-h-screen bg-[#f5f7fa] lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative hidden overflow-hidden bg-[#172535] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 -top-32 size-96 rounded-full border-[48px] border-sky-400/10" />
        <div className="relative flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-sky-500"><Boxes className="size-5" /></div>
          <div><p className="font-semibold tracking-wider">LOTRACK</p><p className="text-[10px] tracking-[0.18em] text-slate-400">OPERAÇÕES</p></div>
        </div>
        <div className="relative max-w-md">
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.16em] text-sky-300">Controle operacional</p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">Estoque organizado para decisões mais seguras.</h1>
          <p className="mt-5 max-w-sm text-base leading-7 text-slate-300">Centralize produtos, fornecedores e categorias em uma única operação confiável.</p>
        </div>
        <div className="relative flex items-center gap-2 text-sm text-slate-400"><ShieldCheck className="size-4 text-sky-300" /> Ambiente de acesso restrito</div>
      </section>
      <section className="flex items-center justify-center p-5 sm:p-10">
      <Card className="w-full max-w-md border border-border/80 py-7 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.18)]">
        <CardHeader className="px-7">
          <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground lg:hidden"><Boxes className="size-5" /></div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.13em] text-primary">{t("login.eyebrow")}</p>
          <CardTitle className="text-2xl font-semibold tracking-tight">{t("login.welcome")}</CardTitle>

          <CardDescription>
            {t("login.description")}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-7 pt-3">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {loginError && (
              <p className="text-sm text-destructive">{loginError}</p>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t("login.email")}</Label>

              <Input
                id="email"
                type="email"
                placeholder={t("login.emailPlaceholder")}
                autoComplete="email"
                {...register("email")}
              />

              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("login.password")}</Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("login.passwordPlaceholder")}
                  autoComplete="current-password"
                  className="pr-10"
                  {...register("password")}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                  aria-label={t(showPassword ? "login.hidePassword" : "login.showPassword")}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="h-10 w-full" disabled={isPending}>
              {isPending ? t("login.submitting") : t("login.submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
      </section>
    </main>
  );
};
