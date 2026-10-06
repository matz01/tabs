import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useCallback,
  useId,
  useMemo,
  useState,
} from "react";
import styles from "./Tabs.module.scss";

import { TabsContext, type TabsVariant } from "./TabsContext";

export type TabsProps = {
  value?: string; // controlled
  defaultValue?: string; // uncontrolled
  onValueChange?: (value: string) => void;
  variant?: TabsVariant; // default: "pill"
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange">;

export const Tabs = ({
  value,
  defaultValue,
  onValueChange,
  variant = "pill",
  children,
  className,
  ...rest
}: TabsProps) => {
  const baseId = useId();
  const [internalValue, setInternalValue] = useState<string>();

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  const select = useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const contextValue = useMemo(
    () => ({ selectedValue, select, variant, baseId }),
    [selectedValue, select, variant, baseId],
  );

  return (
    <TabsContext value={contextValue}>
      <div {...rest} className={[styles.tabs, className].join(" ")} data-variant={variant}>
        {children}
      </div>
    </TabsContext>
  );
};
