import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useCallback,
  useId,
  useMemo,
  useState,
} from "react";
import { cx } from "../../utils/cx";
import styles from "./Tabs.module.scss";
import { TabsContext, type TabsVariant } from "./TabsContext";

type SelectionProps =
  | {
      value: string;
      defaultValue?: never;
    }
  | {
      defaultValue: string;
      value?: never;
    };

export type TabsProps = SelectionProps & {
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
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
  const [internalValue, setInternalValue] = useState(defaultValue);

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  const select = useCallback(
    (next: string) => {
      if (next === selectedValue) return;
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [selectedValue, isControlled, onValueChange],
  );

  const contextValue = useMemo(
    () => ({ selectedValue, select, variant, baseId }),
    [selectedValue, select, variant, baseId],
  );

  return (
    <TabsContext value={contextValue}>
      <div {...rest} className={cx(styles.tabs, className)} data-variant={variant}>
        {children}
      </div>
    </TabsContext>
  );
};
