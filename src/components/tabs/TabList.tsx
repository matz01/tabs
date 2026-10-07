import { type ComponentPropsWithoutRef, type FC, type KeyboardEvent, useRef } from "react";
import styles from "./Tabs.module.scss";
import { useTabsContext } from "./TabsContext";

export type TabListProps = ComponentPropsWithoutRef<"div">;

export const TabList: FC<TabListProps> = ({
  children,
  className,
  onKeyDown,
  ...rest
}: TabListProps) => {
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

    let nextIndex: number;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (currentIndex + 1) % tabs.length;
        break;
      case "ArrowLeft":
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;

      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = tabs.length - 1;
        break;
      default:
        return; // any other key: do nothing
    }

    event.preventDefault();
    tabs[nextIndex].focus();
  };
  return (
    <div
      {...rest}
      ref={listRef}
      role="tablist"
      data-variant={variant}
      className={[styles.tablist, className].filter(Boolean).join(" ")}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
};
