import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { BadgeProps } from "../badge/Badge";

export type TabProps = {
  value: string;
  badge?: Pick<BadgeProps, "label" | "variant">;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"button">, "value" | "type" | "role">;
