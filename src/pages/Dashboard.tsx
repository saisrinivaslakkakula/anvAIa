import { getCounts, getRecentApplications } from "../lib/db";
import { useMemo } from "react";
import useDBSignal from "../lib/useDBSignal";
import ApplicationsTable from "../components/ApplicationsTable";

export default function Dashboard() {
    const tick = useDBSignal(); // <- bumps on any DB write

    const { applied, inProgress, openQs } = useMemo(() => getCounts(), [tick]);
    const recent = useMemo(() => getRecentApplications(6), [tick]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cards */}
            <div className="card">
                <div className="text-sm text-gray-500">Applied</div>
                <div className="mt-1 text-2xl font-semibold">{applied}</div>
            </div>
            <div className="card">
                <div className="text-sm text-gray-500">In Progress</div>
                <div className="mt-1 text-2xl font-semibold">{inProgress}</div>
            </div>
            <div className="card">
                <div className="text-sm text-gray-500">Open Questions</div>
                <div className="mt-1 text-2xl font-semibold">{openQs}</div>
            </div>

            {/* Optional: keep Recent activity table */}
            {/* <div className="md:col-span-3 card"> ... </div> */}

            {/* Applications table */}
            <div className="md:col-span-3">
                <ApplicationsTable />
            </div>
        </div>
    );
}
