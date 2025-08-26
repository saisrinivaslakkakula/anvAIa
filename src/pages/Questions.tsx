// src/pages/Questions.tsx
import { useEffect, useState } from "react";
import QuestionItem from "../components/QuestionItem";
import { USE_API } from "../lib/datasource";
import { api } from "../lib/api";
import {
    getOpenQuestions as mockGet,
    answerQuestion as mockAnswer,
} from "../lib/db";

export default function Questions() {
    const [items, setItems] = useState<any[]>([]);
    const [toast, setToast] = useState("");

    const refresh = async () => {
        if (USE_API) {
            const rows = await api.questions("OPEN");
            setItems(rows);
        } else {
            setItems(mockGet());
        }
    };

    useEffect(() => {
        void refresh();
    }, []);

    const handleSave = async (id: number, ans: string) => {
        if (USE_API) {
            await api.answerQuestion(id, ans);
        } else {
            mockAnswer(id, ans);
        }
        setToast("Saved. Application moved to IN_PROGRESS.");
        setTimeout(() => setToast(""), 1200);
        void refresh();
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
