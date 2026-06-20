// app/applications/[id]/page.tsx

import ApplicationDetailsCard from "@/components/admin/ApplicationDetailsCard";
import StatusUpdatePanel from "@/components/admin/StatusUpdatePanel";
import BackButton from "@/components/ui/BackButton";
import { api } from "@/lib/api";
import { BiLeftArrow } from "react-icons/bi";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ApplicationDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const data = await api.getApplicationByIdAdmin(id);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <BackButton />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loan Application</h1>
          <p className="text-gray-500">Application ID: {data.application_id}</p>
        </div>

        <StatusUpdatePanel
          applicationId={data.application_id}
          currentStatus={data.status}
          isLocked={data.is_locked ?? false}
          declineReason={data.decline_reason ?? null}
        />

        <ApplicationDetailsCard loan={data} />
      </div>
    </div>
  );
}
