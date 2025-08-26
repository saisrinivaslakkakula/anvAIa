import { statusColor } from "../lib/format";

export default function StatusPill({ status }: { status: string }) {
    return (
        <span
            className={`badge ${
                statusColor[status] || "bg-gray-100 text-gray-700"
            }`}
        >
            {status}
        </span>
    );
}
