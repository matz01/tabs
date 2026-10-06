import type { ComponentPropsWithoutRef } from "react";
import styles from "./Badge.module.scss";

export type BadgeVariant = "neutral" | "positive" | "negative";

export type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
} & Omit<ComponentPropsWithoutRef<"span">, "children">;

export const Badge = ({ label, variant = "neutral", className, ...rest }: BadgeProps) => {
  return (
    <span
      {...rest}
      className={[styles.badge, className].filter(Boolean).join(" ")}
      data-variant={variant}
    >
      {label}
    </span>
  );
};
