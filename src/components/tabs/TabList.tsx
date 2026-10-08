import { type ComponentPropsWithoutRef, type KeyboardEvent, useRef } from "react";
import { cx } from "../../utils/cx";
import styles from "./Tabs.module.scss";
import { useTabsContext } from "./TabsContext";

export type TabListProps = Omit<ComponentPropsWithoutRef<"div">, "role">;

const getNextIndex = (key: string, currentIndex: number, length: number): number | null => {
  switch (key) {
    case "ArrowRight":
      return (currentIndex + 1) % length;
    case "ArrowLeft":
      return (currentIndex - 1 + length) % length;
    case "Home":
      return 0;
    case "End":
      return length - 1;
    default:
      return null;
  }
};

export const TabList = ({ children, className, onKeyDown, ...rest }: TabListProps) => {
  const { variant } = useTabsContext("TabList");
  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const tabs = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? [],
    );
    const currentIndex = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (currentIndex === -1) return;

    const nextIndex = getNextIndex(event.key, currentIndex, tabs.length);
    if (nextIndex === null) return;

    event.preventDefault();
    tabs[nextIndex].focus();
  };

  return (
    <div
      {...rest}
      ref={listRef}
      role="tablist"
      aria-orientation="horizontal"
      data-variant={variant}
      className={cx(styles.tablist, className)}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
};
