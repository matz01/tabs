// TabPanel.tsx
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type TabPanelProps = {
  value: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<"div">;
