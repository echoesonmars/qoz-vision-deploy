import Image from "next/image";
import { cn } from "@/lib/utils";

export const ADM_LOGO_SRC = "/ADM (transparent).png";

type AdmLogoSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeClass: Record<AdmLogoSize, string> = {
  xs: "h-6 w-auto max-w-[5.5rem]",
  sm: "h-10 w-auto max-w-[6.5rem]",
  md: "h-14 w-auto max-w-[9.5rem]",
  lg: "h-20 w-auto max-w-[13rem]",
  xl: "h-24 w-auto max-w-[16rem]",
};

const sizePx: Record<AdmLogoSize, { width: number; height: number }> = {
  xs: { width: 88, height: 24 },
  sm: { width: 104, height: 40 },
  md: { width: 152, height: 56 },
  lg: { width: 208, height: 80 },
  xl: { width: 256, height: 96 },
};

type AdmLogoProps = {
  className?: string;
  size?: AdmLogoSize;
  priority?: boolean;
};

export function AdmLogo({ className, size = "md", priority }: AdmLogoProps) {
  const px = sizePx[size];
  return (
    <Image
      src={ADM_LOGO_SRC}
      alt="Almaty Digital Mektebi"
      width={px.width}
      height={px.height}
      priority={priority}
      className={cn(sizeClass[size], "object-contain object-left", className)}
    />
  );
}
