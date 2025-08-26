import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Questions from "./pages/Questions";
import AgentConsole from "./pages/AgentConsole";
import Layout from "./components/Layout";

export default function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Layout title="Dashboard">
                        <Dashboard />
                    </Layout>
                }
            />
            <Route
                path="/questions"
                element={
                    <Layout title="Unanswered Questions">
                        <Questions />
                    </Layout>
                }
            />
            <Route
                path="/agents"
                element={
                    <Layout title="Agent Console">
                        <AgentConsole />
                    </Layout>
                }
            />
        </Routes>
    );
}
