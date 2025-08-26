import { NavLink } from "react-router-dom";

const link =
    "px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition";
const active = "bg-gray-900 text-white hover:bg-gray-900";

export default function Nav() {
    return (
        <nav className="border-b bg-white">
            <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
                <div className="font-semibold tracking-wide">Job Agents</div>
                <div className="flex gap-2">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `${link} ${isActive ? active : ""}`
                        }
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/questions"
                        className={({ isActive }) =>
                            `${link} ${isActive ? active : ""}`
                        }
                    >
                        Questions
                    </NavLink>
                    <NavLink
                        to="/agents"
                        className={({ isActive }) =>
                            `${link} ${isActive ? active : ""}`
                        }
                    >
                        Agent Console
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}
