import type { ComponentPropsWithoutRef } from "react";
import { cx } from "../../utils/cx";
import styles from "./Badge.module.scss";

export type BadgeVariant = "neutral" | "positive" | "negative";

export type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
} & Omit<ComponentPropsWithoutRef<"span">, "children">;

export const Badge = ({ label, variant = "neutral", className, ...rest }: BadgeProps) => {
  return (
    <span {...rest} className={cx(styles.badge, className)} data-variant={variant}>
      {label}
    </span>
  );
};
