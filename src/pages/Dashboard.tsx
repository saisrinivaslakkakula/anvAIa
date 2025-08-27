import { useEffect, useState } from "react";
import { api } from "../lib/api";
import StatusPill from "../components/StatusPill";
import ApplicationsTable from "../components/ApplicationsTable";
import type { Application, Job } from "../lib/types";

type ApplicationWithJob = Application & {
    job?: Job;
    company?: string;
    title?: string;
    external_link?: string;
};

export default function Dashboard() {
    const [counts, setCounts] = useState({
        applied: 0,
        inProgress: 0,
        openQs: 0,
    });
    const [recent, setRecent] = useState<ApplicationWithJob[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [apps, qs] = await Promise.all([
                    api.applications(),
                    api.questions("OPEN"),
                ]);

                setCounts({
                    applied: apps.filter((a) => a.status === "APPLIED").length,
                    inProgress: apps.filter((a) => a.status === "IN_PROGRESS")
                        .length,
                    openQs: qs.length,
                });
                setRecent(apps.slice(0, 6) as ApplicationWithJob[]); // simple recent for now
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* cards */}
            <div className="card">
                <div className="text-sm text-gray-500">Applied</div>
                <div className="mt-1 text-2xl font-semibold">
                    {counts.applied}
                </div>
            </div>
            <div className="card">
                <div className="text-sm text-gray-500">In Progress</div>
                <div className="mt-1 text-2xl font-semibold">
                    {counts.inProgress}
                </div>
            </div>
            <div className="card">
                <div className="text-sm text-gray-500">Open Questions</div>
                <div className="mt-1 text-2xl font-semibold">
                    {counts.openQs}
                </div>
            </div>

            {/* recent */}
            <div className="md:col-span-3 card">
                <h2 className="font-medium">Recent activity</h2>
                <div className="mt-3 overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="text-left text-gray-500">
                            <tr>
                                <th className="py-2 pr-4">Company</th>
                                <th className="py-2 pr-4">Title</th>
                                <th className="py-2 pr-4">Status</th>
                                <th className="py-2 pr-4">Updated</th>
                                <th className="py-2">Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recent.map((r: ApplicationWithJob) => (
                                <tr key={r.id} className="border-t">
                                    <td className="py-2 pr-4">
                                        {r.company ?? r.job?.company}
                                    </td>
                                    <td className="py-2 pr-4">
                                        {r.title ?? r.job?.title}
                                    </td>
                                    <td className="py-2 pr-4">
                                        <StatusPill status={r.status} />
                                    </td>
                                    <td className="py-2 pr-4">
                                        {new Date(
                                            r.updated_at
                                        ).toLocaleString()}
                                    </td>
                                    <td className="py-2">
                                        <a
                                            className="text-indigo-600 hover:underline"
                                            href={
                                                r.external_link ??
                                                r.job?.external_link
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Apply page ↗
                                        </a>
                                    </td>
                                </tr>
                            ))}
                            {recent.length === 0 && (
                                <tr>
                                    <td
                                        className="py-4 text-gray-500"
                                        colSpan={5}
                                    >
                                        No activity yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Applications table - now fully API-driven */}
            <div className="md:col-span-3">
                <ApplicationsTable />
            </div>
        </div>
    );
}
