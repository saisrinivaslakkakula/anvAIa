// src/pages/Questions.tsx
import { useEffect, useState } from "react";
import QuestionItem from "../components/QuestionItem";
import { api } from "../lib/api";
import type { Question } from "../lib/types";

// Extended type for questions with job data
type QuestionWithJob = Question & {
    job?: {
        company: string;
        title: string;
        location?: string;
        external_link?: string;
    };
};

export default function Questions() {
    const [items, setItems] = useState<QuestionWithJob[]>([]);
    const [toast, setToast] = useState("");

    const refresh = async () => {
        try {
            const rows = await api.questions("OPEN");
            setItems(rows as QuestionWithJob[]);
        } catch (error) {
            console.error("Failed to fetch questions:", error);
            setToast("Failed to fetch questions");
            setTimeout(() => setToast(""), 3000);
        }
    };

    useEffect(() => {
        void refresh();
    }, []);

    const handleSave = async (id: number, ans: string) => {
        try {
            await api.answerQuestion(id, ans);
            setToast("Saved. Application moved to IN_PROGRESS.");
            setTimeout(() => setToast(""), 1200);
            void refresh();
        } catch (error) {
            console.error("Failed to save answer:", error);
            setToast("Failed to save answer");
            setTimeout(() => setToast(""), 3000);
        }
    };

    return (
        <div>
            <div className="mb-4">
                <h2 className="text-lg font-semibold">Unanswered Questions</h2>
                <div className="text-sm text-gray-600">
                    Open items: {items.length}
                </div>
            </div>
            {items.length === 0 ? (
                <div className="card">No open questions 🎉</div>
            ) : (
                items.map((q) => (
                    <QuestionItem key={q.id} q={q} onSave={handleSave} />
                ))
            )}
            {toast && (
                <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-3 py-2 rounded shadow">
                    {toast}
                </div>
            )}
        </div>
    );
}
