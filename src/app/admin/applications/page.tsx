"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Calendar, RotateCw, AlertTriangle } from "lucide-react";
import { ApplicationStatus, Loan } from "@/lib/types";
import { api } from "@/lib/api";
import {
  formatDate,
  formatMoney,
  initials,
  LOAN_STATUS_META,
  LOAN_STATUSES,
  todayISO,
} from "@/components/admin/adminFormat";
import { formatDateTime, tzOffsetMinutes } from "@/lib/datetime";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { ImHourGlass } from "react-icons/im";
import { LoanDrawer } from "@/components/ui/LoanDrawer";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function AdminLoanApplicationsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const [search, setSearch] = useState("");
  // const [searchQuery, setSearchQuery] = useState(
  //   searchParams.get("q")?.trim() || "",
  // );

  const [search, setSearch] = useState(searchParams.get("q")?.trim() || "");

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("q")?.trim() || "",
  );

  const [statusFilter, setStatusFilter] = useState<"all" | ApplicationStatus>(
    (searchParams.get("status") as ApplicationStatus) || "all",
  );

  const [date, setDate] = useState(searchParams.get("date") || todayISO());
  // const [statusFilter, setStatusFilter] = useState<"all" | ApplicationStatus>(
  //   "all",
  // );

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (searchQuery) params.set("q", searchQuery);
    if (date) {
      params.set("date", date);
    }
    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.replace(url, { scroll: false });
  }, [statusFilter, searchQuery, date, pathname, router]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();

      const trimmedSearch = searchQuery.trim();

      if (trimmedSearch) {
        params.set("q", trimmedSearch);
      } else if (statusFilter !== "all") {
        params.set("status", statusFilter);
      } else if (date) {
        params.set("date", date);
        // Pacific-time offset for the selected day (noon UTC sits safely inside
        // the day regardless of DST), so the backend groups submissions by
        // Pacific calendar day no matter where the admin is browsing from.
        params.set(
          "tzOffset",
          String(tzOffsetMinutes(new Date(`${date}T12:00:00Z`))),
        );
      }

      const { applications } = await api.getApplication(params.toString());
      //   const data = await api.getApplication(params.toString());
      setLoans(applications);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, searchQuery, statusFilter]);

  const filtered = useMemo(
    () =>
      statusFilter === "all"
        ? loans
        : loans.filter((l) => l.status === statusFilter),
    [loans, statusFilter],
  );

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    setUpdatingId(id);
    // try {
    //   const updated = await updateLoanStatus(id, status);
    //   setLoans((prev) =>
    //     prev.map((l) => (l.id === id ? { ...l, status: updated.status } : l)),
    //   );
    // } catch (err) {
    //   alert(err instanceof Error ? err.message : "Update failed.");
    // } finally {
    //   setUpdatingId(null);
    // }
  }

  function resetFilters() {
    const today = todayISO();

    setSearch("");
    setSearchQuery("");
    setStatusFilter("all");
    setDate(today);

    const params = new URLSearchParams();
    params.set("date", today);

    api.getApplication(params.toString());
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Loan Applications
        </h1>
        <p className="text-sm text-slate-500">
          {loading
            ? "Loading…"
            : `${filtered?.length} application${filtered?.length === 1 ? "" : "s"}`}
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearchQuery(search.trim());
            // load();
          }}
          className="relative flex-1"
        >
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, status…"
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0B7A5A] focus:ring-2 focus:ring-[#0B7A5A]/15"
          />
        </form>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "all" | ApplicationStatus)
          }
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B7A5A] focus:ring-2 focus:ring-[#0B7A5A]/15"
        >
          <option value="all">All statuses</option>
          {LOAN_STATUSES.map((s) => (
            <option key={s} value={s}>
              {LOAN_STATUS_META[s].label}
            </option>
          ))}
        </select>

        <div className="relative">
          <Calendar
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="date"
            value={date}
            max={todayISO()}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-[#0B7A5A] focus:ring-2 focus:ring-[#0B7A5A]/15"
          />
        </div>

        <button
          onClick={resetFilters}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <RotateCw size={16} />
          Reset
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-5 py-3 font-medium">Applicant ID</th>
              <th className="px-5 py-3 font-medium">IP</th>
              <th className="px-5 py-3 font-medium">Applicant</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Term</th>
              <th className="px-5 py-3 font-medium">Applied</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Bank Verified</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td
                  className="px-5 py-10 text-center text-slate-400"
                  colSpan={6}
                >
                  Loading applications…
                </td>
              </tr>
            ) : filtered?.length === 0 ? (
              <tr>
                <td
                  className="px-5 py-10 text-center text-slate-400"
                  colSpan={6}
                >
                  No applications match the current filters.
                </td>
              </tr>
            ) : (
              filtered?.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3.5 text-slate-500">
                    {l.application_id}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{l.ip_address}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                        {initials(l.first_name)}
                      </span>
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 truncate font-medium text-slate-900">
                          {l.first_name} {l.last_name}
                          {l.ip_flagged && (
                            <span
                              title={`${l.ip_flag_count ?? 2} applications from IP ${l.ip_address ?? ""} within 24h — review for fraud`}
                              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-700 ring-1 ring-inset ring-rose-200"
                            >
                              <AlertTriangle size={11} />
                              Duplicate IP
                            </span>
                          )}
                        </p>
                        <p className="truncate text-xs text-slate-400">
                          {l.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-700">
                    {formatMoney(l.loan_amount)}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {l.loan_term} mo
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {formatDateTime(l.createdAt)}
                  </td>
                  <td className="px-5 py-3.5">
                    {/* <select
                      value={l.status}
                      disabled={updatingId === l.id}
                      onChange={(e) =>
                        handleStatusChange(
                          l.id,
                          e.target.value as ApplicationStatus,
                        )
                      }
                      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 outline-none transition focus:border-[#0B7A5A] focus:ring-2 focus:ring-[#0B7A5A]/15 disabled:opacity-50"
                    >
                      {LOAN_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {LOAN_STATUS_META[s].label}
                        </option>
                      ))}
                    </select> */}
                    {l?.status}
                  </td>
                  <td className="px-5 py-3.5 ">
                    {l?.bank_verified === true ? (
                      <IoMdCheckmarkCircleOutline
                        size={24}
                        className="text-green-700 "
                      />
                    ) : (
                      <ImHourGlass size={22} className="text-amber-600" />
                      // <FaXmark size={24}  />
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setSelectedId(l.application_id)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedId && (
        <LoanDrawer
          id={selectedId}
          onClose={() => setSelectedId(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

function mask(value: string | undefined, reveal: boolean): string {
  if (!value) return "—";
  if (reveal) return value;
  return "•".repeat(Math.min(value?.length, 12));
}
