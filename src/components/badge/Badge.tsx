interface BadgeProps {
    label: string,
    variant?:
        | "neutral"
        | "positive"
        | "negative",
    id: string
}

export const Badge = ({label, variant, id}: BadgeProps) => {
    return <span data-testid={`badge-${id}`} data-variant={variant}>{label}</span>
};

