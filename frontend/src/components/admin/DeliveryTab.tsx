import { ShieldCheck } from "lucide-react";
import type { DeliveryAgent, DeliveryAgentFormData } from "./adminTypes";

type Props = {
  deliveryAgents: DeliveryAgent[];
  orderAgentCounts: Record<number, number>;
  showAgentForm: boolean;
  agentForm: DeliveryAgentFormData;
  onOpenAgentForm: (agent?: DeliveryAgent) => void;
  onCancelAgentForm: () => void;
  onChangeAgentForm: (value: DeliveryAgentFormData) => void;
  onSaveAgent: () => Promise<void>;
  onDeleteAgent: (id?: number) => Promise<void>;
};

export default function DeliveryTab({
  deliveryAgents,
  orderAgentCounts,
  showAgentForm,
  agentForm,
  onOpenAgentForm,
  onCancelAgentForm,
  onChangeAgentForm,
  onSaveAgent,
  onDeleteAgent,
}: Props): React.JSX.Element {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold text-white">Delivery Agents</h2>
          <p className="text-slate-400">
            Track delivery capacity and active assignments.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onOpenAgentForm()}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            Add Agent
          </button>
        </div>
      </div>

      {showAgentForm && (
        <div className="mb-4 rounded-lg border border-slate-700 bg-slate-900/80 p-4">
          <div className="grid gap-3 md:grid-cols-3">
            <input
              value={agentForm.username}
              onChange={(e) =>
                onChangeAgentForm({ ...agentForm, username: e.target.value })
              }
              placeholder="Username"
              className="rounded-lg bg-slate-800 px-3 py-2 text-white"
            />
            <input
              value={agentForm.email}
              onChange={(e) =>
                onChangeAgentForm({ ...agentForm, email: e.target.value })
              }
              placeholder="Email"
              className="rounded-lg bg-slate-800 px-3 py-2 text-white"
            />
            <input
              value={agentForm.phone}
              onChange={(e) =>
                onChangeAgentForm({ ...agentForm, phone: e.target.value })
              }
              placeholder="Phone"
              className="rounded-lg bg-slate-800 px-3 py-2 text-white"
            />
            <input
              value={agentForm.password}
              onChange={(e) =>
                onChangeAgentForm({ ...agentForm, password: e.target.value })
              }
              placeholder="Password (for new agent)"
              className="rounded-lg bg-slate-800 px-3 py-2 text-white md:col-span-2"
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onSaveAgent}
                className="rounded-lg bg-pink-500 px-4 py-2 text-white"
              >
                Save
              </button>
              <button
                onClick={onCancelAgentForm}
                className="rounded-lg bg-slate-700 px-4 py-2 text-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {deliveryAgents.map((agent) => (
          <div
            key={agent.id}
            className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 sm:p-5"
          >
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-lg font-semibold text-white">
                  {agent.username}
                </p>
                <p className="truncate text-sm text-slate-400">{agent.email}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onOpenAgentForm(agent)}
                  className="rounded-md bg-blue-500 px-3 py-1 text-xs text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteAgent(agent.id)}
                  className="rounded-md bg-red-600 px-3 py-1 text-xs text-white"
                >
                  Delete
                </button>
                <ShieldCheck className="h-6 w-6 text-pink-400" />
              </div>
            </div>
            <p className="text-sm text-slate-400">
              Phone: {agent.phone || "—"}
            </p>
            <p className="mt-3 text-sm text-slate-300">
              Assigned Orders: {orderAgentCounts[agent.id] || 0}
            </p>
          </div>
        ))}
      </div>
      {deliveryAgents.length === 0 && (
        <p className="mt-6 text-center text-slate-400">
          No delivery agents available.
        </p>
      )}
    </div>
  );
}
