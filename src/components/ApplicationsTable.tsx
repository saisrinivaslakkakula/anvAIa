import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import StatusPill from "./StatusPill";
import type { Application } from "../lib/types";

type ApplicationWithDetails = Application & {
    company?: string;
    title?: string;
    location?: string;
    external_link?: string;
};

const ALL_STATUSES = [
    "ALL",
    "APPLIED",
    "IN_PROGRESS",
    "PARTIAL_FILLED",
    "LOGIN_REQUIRED",
    "FAILED",
    "SKIPPED",
] as const;

export default function ApplicationsTable() {
    const [status, setStatus] = useState<(typeof ALL_STATUSES)[number]>("ALL");
    const [search, setSearch] = useState("");
    const [applications, setApplications] = useState<ApplicationWithDetails[]>(
        []
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                const apps = await api.applications();
                setApplications(apps as ApplicationWithDetails[]);
            } catch (error) {
                console.error("Failed to fetch applications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const rows = useMemo(() => {
        let filtered = applications;

        if (status !== "ALL") {
            filtered = filtered.filter(
                (r: ApplicationWithDetails) => r.status === status
            );
        }

        if (search.trim()) {
            const q = search.toLowerCase();
            filtered = filtered.filter(
                (r: ApplicationWithDetails) =>
                    r.company?.toLowerCase().includes(q) ||
                    r.title?.toLowerCase().includes(q) ||
                    r.location?.toLowerCase().includes(q)
            );
        }

        // newest updated first
        return filtered.sort(
            (a: ApplicationWithDetails, b: ApplicationWithDetails) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
        );
    }, [applications, status, search]);

    if (loading) {
        return (
            <div className="card">
                <div className="flex items-center justify-center h-32">
                    <div className="text-gray-500">Loading applications...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                <div>
                    <h2 className="font-medium">Applications</h2>
                    <p className="text-sm text-gray-600">
                        Total: {rows.length}
                    </p>
                </div>
                <div className="flex gap-2">
                    <select
                        className="border rounded px-2 py-1 text-sm"
                        value={status}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            setStatus(
                                e.target.value as (typeof ALL_STATUSES)[number]
                            )
                        }
                    >
                        {ALL_STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                    <input
                        className="border rounded px-2 py-1 text-sm"
                        placeholder="Search company, title, location"
                        value={search}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSearch(e.target.value)
                        }
                    />
                </div>
            </div>

            <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="text-left text-gray-500">
                        <tr>
                            <th className="py-2 pr-4">Company</th>
                            <th className="py-2 pr-4">Title</th>
                            <th className="py-2 pr-4">Location</th>
                            <th className="py-2 pr-4">Status</th>
                            <th className="py-2 pr-4">Updated</th>
                            <th className="py-2">Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r: ApplicationWithDetails) => (
                            <tr key={r.id} className="border-t">
                                <td className="py-2 pr-4">{r.company}</td>
                                <td className="py-2 pr-4">{r.title}</td>
                                <td className="py-2 pr-4">{r.location}</td>
                                <td className="py-2 pr-4">
                                    <StatusPill status={r.status} />
                                </td>
                                <td className="py-2 pr-4">
                                    {new Date(r.updated_at).toLocaleString()}
                                </td>
                                <td className="py-2">
                                    <a
                                        className="text-indigo-600 hover:underline"
                                        href={r.external_link}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Apply page ↗
                                    </a>
                                </td>
                            </tr>
                        ))}
                        {rows.length === 0 && (
                            <tr>
                                <td className="py-4 text-gray-500" colSpan={6}>
                                    No applications match your filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
