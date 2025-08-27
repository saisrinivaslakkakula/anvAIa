import { useState } from "react";
import type { Question } from "../lib/types";

type QuestionWithJob = Question & {
    job?: {
        company: string;
        title: string;
        location?: string;
        external_link?: string;
    };
};

export default function QuestionItem({
    q,
    onSave,
}: {
    q: QuestionWithJob;
    onSave: (id: number, ans: string) => void;
}) {
    const [a, setA] = useState(q.answer ?? "");

    return (
        <div className="card mb-3">
            <div className="text-sm text-gray-500">
                {q.job?.company} • {q.job?.title} • {q.job?.location}
            </div>
            <div className="mt-1 font-medium">{q.field_label}</div>
            {q.help_text && (
                <div className="text-xs text-gray-500 mt-1">{q.help_text}</div>
            )}

            <textarea
                className="mt-3 w-full border rounded p-2"
                rows={3}
                placeholder="Type your answer…"
                value={a}
                onChange={(e) => setA(e.target.value)}
            />
            <div className="mt-2 flex gap-2">
                <button
                    className="btn"
                    onClick={() => onSave(q.id, a.trim())}
                    disabled={!a.trim()}
                >
                    Save
                </button>
                {q.job?.external_link && (
                    <a
                        className="btn btn-secondary"
                        href={q.job.external_link}
                        target="_blank"
                        rel="noreferrer"
                    >
                        View application ↗
                    </a>
                )}
            </div>
        </div>
    );
}
