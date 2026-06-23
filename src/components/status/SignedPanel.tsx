import { APP_TIME_ZONE } from "@/lib/datetime";

export function SignedPanel({ name, at }: { name: string; at: string }) {
  const when = new Date(at).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: APP_TIME_ZONE,
    timeZoneName: "short",
  });
  return (
    <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-green-800">
          Signed electronically ✓
        </p>
        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
          Verified
        </span>
      </div>
      <div className="mt-2 border-b border-green-300 pb-1">
        <span
          className="text-3xl text-green-900"
          style={{ fontFamily: "cursive" }}
        >
          {name}
        </span>
      </div>
      <p className="mt-2 text-xs text-green-700">Signed on {when}</p>
      <p className="mt-3 text-sm text-green-700">
        Thank you — our team will review your signed agreement and advance your
        application. No further action is needed right now.
      </p>
    </div>
  );
}
