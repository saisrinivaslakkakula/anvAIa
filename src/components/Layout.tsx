import { NavLink } from "react-router-dom";
import React from "react";
import { fakeResearcherRun, fakeApplierRun } from "../lib/db";

const link =
    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800/60 transition";
const active = "bg-gray-800 text-white";
const idle = "text-gray-300";

export default function Layout({
    title,
    children,
}: {
    title?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                {/* Sidebar */}
                <aside className="hidden md:flex md:w-64 bg-gray-900 text-white">
                    <div className="w-full">
                        <div className="px-4 py-4 border-b border-gray-800">
                            <div className="text-lg font-semibold tracking-wide">
                                Job Agents
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                                Semi‑agentic job runner
                            </div>
                        </div>

                        <nav className="p-3 flex flex-col gap-1">
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) =>
                                    `${link} ${isActive ? active : idle}`
                                }
                            >
                                <span>🏠</span> <span>Dashboard</span>
                            </NavLink>
                            <NavLink
                                to="/questions"
                                className={({ isActive }) =>
                                    `${link} ${isActive ? active : idle}`
                                }
                            >
                                <span>❓</span> <span>Questions</span>
                            </NavLink>
                            <NavLink
                                to="/agents"
                                className={({ isActive }) =>
                                    `${link} ${isActive ? active : idle}`
                                }
                            >
                                <span>🤖</span> <span>Agent Console</span>
                            </NavLink>
                        </nav>

                        <div className="mt-auto p-3 text-xs text-gray-400">
                            <div className="border-t border-gray-800 pt-3">
                                v0.1 • local mock data
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main column */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
                        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                            <div className="font-semibold">
                                {title ?? "Dashboard"}
                            </div>
                            {/* quick actions placeholder */}
                            <div className="flex gap-2">
                                <button className="btn">Run Researcher</button>
                                <button className="btn btn-secondary">
                                    Run Applier
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <main className="mx-auto max-w-6xl px-4 py-6">
                        {children}
                    </main>
                </div>
            </div>

            {/* Mobile footer nav */}
            <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t">
                <div className="flex justify-around p-2 text-sm">
                    <NavLink to="/" end className="px-3 py-1">
                        Dashboard
                    </NavLink>
                    <NavLink to="/questions" className="px-3 py-1">
                        Questions
                    </NavLink>
                    <NavLink to="/agents" className="px-3 py-1">
                        Agents
                    </NavLink>
                </div>
            </nav>

            <button
                className="btn"
                onClick={() => {
                    fakeResearcherRun();
                    alert("Researcher run queued (mock)");
                }}
            >
                Run Researcher
            </button>
            <button
                className="btn btn-secondary"
                onClick={() => {
                    fakeApplierRun();
                    alert("Applier run queued (mock)");
                }}
            >
                Run Applier
            </button>
        </div>
    );
}
