import { createContext, useContext } from "react";

export type TabsVariant = "pill" | "underline";

export type TabsContextType = {
  selectedValue: string | undefined;
  select: (value: string) => void;
  variant: TabsVariant;
  baseId: string;
};

export const TabsContext = createContext<TabsContextType | null>(null);

export const useTabsContext = (componentName: string): TabsContextType => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error(`<${componentName}> must be used within <Tabs>`);
  }
  return context;
};
