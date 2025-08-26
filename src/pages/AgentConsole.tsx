import { useEffect, useState } from "react";
import { getRuns, fakeResearcherRun, fakeApplierRun } from "../lib/db";

type Run = ReturnType<typeof getRuns>[number];

export default function AgentConsole() {
    const [runs, setRuns] = useState<Run[]>([]);

    const refresh = () => setRuns(getRuns());

    useEffect(() => {
        refresh();
    }, []);

    const onResearcher = () => {
        fakeResearcherRun();
        refresh();
    };
    const onApplier = () => {
        fakeApplierRun();
        refresh();
    };

    return (
        <div className="space-y-4">
            <div className="card flex items-center justify-between">
                <div>
                    <h2 className="font-semibold">Run Agents</h2>
                    <p className="text-sm text-gray-600">
                        Simulate runs; adds a row to history.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="btn" onClick={onResearcher}>
                        Run Researcher
                    </button>
                    <button className="btn btn-secondary" onClick={onApplier}>
                        Run Applier
                    </button>
                </div>
            </div>

            <div className="card">
                <h3 className="font-medium mb-3">Run history</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="text-left text-gray-500">
                            <tr>
                                <th className="py-2 pr-4">Agent</th>
                                <th className="py-2 pr-4">Started</th>
                                <th className="py-2 pr-4">Finished</th>
                                <th className="py-2 pr-4">Summary</th>
                            </tr>
                        </thead>
                        <tbody>
                            {runs.map((r) => (
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
                                        {new Date(
                                            r.finished_at
                                        ).toLocaleString()}
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
