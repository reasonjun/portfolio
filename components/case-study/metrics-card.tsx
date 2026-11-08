interface MetricsCardProps {
  items: { label: string; before: string; after: string }[];
}

export const MetricsCard = ({ items }: MetricsCardProps) => (
  <dl className="grid gap-4 sm:grid-cols-2">
    {items.map((item) => (
      <div key={item.label} className="rounded-lg border bg-muted/30 p-4">
        <dt className="text-sm text-muted-foreground">{item.label}</dt>
        <dd className="mt-1 text-2xl font-bold">
          <span className="text-muted-foreground">{item.before}</span>
          {" → "}
          <span className="text-primary">{item.after}</span>
        </dd>
      </div>
    ))}
  </dl>
);
