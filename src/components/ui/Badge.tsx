export function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "success";
}) {
  const tones = { success: "bg-green-50 text-green-700" };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${tones[tone]}`}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.2l-3.5-3.5L4 14.2 9 19l11-11-1.4-1.4z" />
      </svg>
      {children}
    </span>
  );
}
