import { createContext, useContext } from "react";

export type TabsVariant = "pill" | "underline";

export type TabsContextType = {
  selectedTab: string | undefined;
  select: (value: string) => void;
  variant: TabsVariant;
  baseId: string;
};

export const TabContext = createContext<TabsContextType | null>(null);

export const useTabsContext = (componentName: string): TabsContextType => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error(`<${componentName}> must be used within <Tabs>`);
  }
  return context;
};
