import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "../../utils/cx";
import styles from "./Tabs.module.scss";
import { getPanelId, getTabId, useTabsContext } from "./TabsContext";

export type TabPanelProps = {
  value: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "role" | "id" | "hidden">;

export const TabPanel = ({ value, children, className, tabIndex = 0, ...rest }: TabPanelProps) => {
  const { selectedValue, baseId } = useTabsContext("TabPanel");
  const isSelected = selectedValue === value;

  return (
    <div
      {...rest}
      tabIndex={tabIndex}
      role="tabpanel"
      id={getPanelId(baseId, value)}
      aria-labelledby={getTabId(baseId, value)}
      hidden={!isSelected}
      className={cx(styles.panel, className)}
    >
      {children}
    </div>
  );
};
