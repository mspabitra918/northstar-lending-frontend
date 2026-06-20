export const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | boolean | null;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
      {label}
    </span>
    <span className="text-sm font-semibold text-gray-900">
      {value !== null && value !== undefined && value !== ""
        ? String(value)
        : "-"}
    </span>
  </div>
);
