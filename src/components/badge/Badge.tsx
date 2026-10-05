import styles from './Badge.module.scss';

interface BadgeProps {
    label: string,
    id: string
    variant?:
        | "neutral"
        | "positive"
        | "negative",
}

export const Badge = ({label, id, variant = "neutral"}: BadgeProps) => {
    return (
        <span
            className={styles.badge}
            data-testid={`badge-${id}`}
            data-variant={variant}
        >
            {label}
        </span>
    )
};

