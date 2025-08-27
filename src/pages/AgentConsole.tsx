// src/pages/AgentConsole.tsx
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { RunLog } from "../lib/types";

export default function AgentConsole() {
    const [runs, setRuns] = useState<RunLog[]>([]);
    const [loading, setLoading] = useState(false);

    const refresh = async () => {
        try {
            const runsData = await api.runs();
            setRuns(runsData as RunLog[]);
        } catch (error) {
            console.error("Failed to fetch runs:", error);
        }
    };

    useEffect(() => {
        void refresh();
    }, []);

    const onResearcher = async () => {
        try {
            setLoading(true);
            await api.runResearcher();
            void refresh();
        } catch (error) {
            console.error("Failed to run researcher:", error);
        } finally {
            setLoading(false);
        }
    };

    const onApplier = async () => {
        try {
            setLoading(true);
            await api.runApplier();
            void refresh();
        } catch (error) {
            console.error("Failed to run applier:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="card flex items-center justify-between">
                <div>
                    <h2 className="font-semibold">Run Agents</h2>
                    <p className="text-sm text-gray-600">
                        Live API integration.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        className="btn"
                        onClick={onResearcher}
                        disabled={loading}
                    >
                        {loading ? "Running..." : "Run Researcher"}
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={onApplier}
                        disabled={loading}
                    >
                        {loading ? "Running..." : "Run Applier"}
                    </button>
                </div>
            </div>
            <div className="card">
                <h3 className="font-medium mb-3">Run history</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr>
                                <th className="py-2 pr-4">Agent</th>
                                <th className="py-2 pr-4">Started</th>
                                <th className="py-2 pr-4">Finished</th>
                                <th className="py-2 pr-4">Summary</th>
                            </tr>
                        </thead>
                        <tbody>
                            {runs.map((r: RunLog) => (
                                <tr key={r.id} className="border-t">
                                    <td className="py-2 pr-4 capitalize">
                                        {r.agent}
                                    </td>
                                    <td className="py-2 pr-4">
                                        {new Date(
                                            r.started_at
                                        ).toLocaleString()}
                                    </td>
                                    <td className="py-2 pr-4">
                                        {r.finished_at
                                            ? new Date(
                                                  r.finished_at
                                              ).toLocaleString()
                                            : "-"}
                                    </td>
                                    <td className="py-2 pr-4">{r.summary}</td>
                                </tr>
                            ))}
                            {runs.length === 0 && (
                                <tr>
                                    <td
                                        className="py-4 text-gray-500"
                                        colSpan={4}
                                    >
                                        No runs yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
