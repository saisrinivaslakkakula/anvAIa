import { useMemo, useState } from "react";
import { ALL_STATUSES, getJoinedApplications } from "../lib/db";
import StatusPill from "./StatusPill";

export default function ApplicationsTable() {
    const [status, setStatus] = useState<(typeof ALL_STATUSES)[number]>("ALL");
    const [search, setSearch] = useState("");

    const rows = useMemo(
        () => getJoinedApplications({ status, search }),
        [status, search]
    );

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
                        onChange={(e) => setStatus(e.target.value as any)}
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
                        onChange={(e) => setSearch(e.target.value)}
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
                        {rows.map((r) => (
                            <tr key={r.id} className="border-t">
                                <td className="py-2 pr-4">{r.job.company}</td>
                                <td className="py-2 pr-4">{r.job.title}</td>
                                <td className="py-2 pr-4">{r.job.location}</td>
                                <td className="py-2 pr-4">
                                    <StatusPill status={r.status} />
                                </td>
                                <td className="py-2 pr-4">
                                    {new Date(r.updated_at).toLocaleString()}
                                </td>
                                <td className="py-2">
                                    <a
                                        className="text-indigo-600 hover:underline"
                                        href={r.job.external_link}
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
