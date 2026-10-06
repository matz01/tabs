// Tabs.tsx
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { TabsVariant } from "./TabsContext";

export type TabsProps = {
  value?: string; // controlled
  defaultValue?: string; // uncontrolled
  onValueChange?: (value: string) => void;
  variant?: TabsVariant; // default: "pill"
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange">;
