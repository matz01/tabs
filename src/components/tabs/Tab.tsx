import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "../../utils/cx";
import { Badge, type BadgeProps } from "../badge/Badge";
import styles from "./Tabs.module.scss";
import { getPanelId, getTabId, useTabsContext } from "./TabsContext";

export type TabProps = {
  value: string;
  badge?: Pick<BadgeProps, "label" | "variant">;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"button">, "value" | "type" | "role" | "id">;

export const Tab = ({ value, badge, children, className, onClick, onFocus, ...rest }: TabProps) => {
  const { selectedValue, baseId, select, variant } = useTabsContext("Tab");
  const isSelected = selectedValue === value;

  return (
    <button
      {...rest}
      type="button"
      role="tab"
      id={getTabId(baseId, value)}
      aria-selected={isSelected}
      aria-controls={getPanelId(baseId, value)}
      className={cx(styles.tab, className)}
      data-variant={variant}
      tabIndex={isSelected ? 0 : -1}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) select(value);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        select(value);
      }}
    >
      <span className={styles.label}>{children}</span>
      {badge && <Badge {...badge} />}
    </button>
  );
};
