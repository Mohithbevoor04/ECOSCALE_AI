import { useState, useRef, useEffect } from "react";
import { api } from "../services/api";
import { ChatMessage } from "../types";
import { Bot, Send, Sparkles, User, Terminal, HelpCircle } from "lucide-react";

export const CopilotPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "copilot",
      text: "👋 Hello! I am your **EcoScale AI FinOps & GreenOps Architectural Copilot**.\n\nAsk me anything about your cloud cluster utilization, cost optimization formulas, dynamic grid carbon intensity, or GitOps IaC auto-remediation snippets.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await api.sendCopilotMessage(query);
      const copilotMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "copilot",
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, copilotMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "copilot",
        text: "⚠️ Apologies, I encountered an issue processing your architectural query. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Why are my nodes flagged as Zombies?",
    "How do I shift workloads to low-carbon regions?",
    "What is the total USD saved and ECO tokens earned?",
    "Give me a Terraform code snippet to right-size EC2 to ARM Graviton",
  ];

  return (
    <div className="h-full flex flex-col p-6 max-w-5xl mx-auto space-y-4">
      {/* Header Banner */}
      <div className="pane p-4 rounded-md border border-slate-700 bg-slate-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-sm bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <span>EcoScale AI FinOps Copilot</span>
              <span className="bg-emerald-950 text-emerald-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-sm border border-emerald-800">
                Gemini 2.5 Active
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Contextual Cloud Infrastructure & Sustainability Expert System</p>
          </div>
        </div>
      </div>

      {/* Chat History Box */}
      <div className="pane flex-1 p-6 rounded-md border border-slate-700 bg-slate-900/90 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div key={msg.id} className={`flex items-start space-x-3 ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}>
              <div
                className={`w-8 h-8 rounded-sm shrink-0 flex items-center justify-center font-bold text-xs ${
                  isUser
                    ? "bg-slate-700 text-slate-200 border border-slate-600"
                    : "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-2xl p-4 rounded-md text-xs leading-relaxed ${
                  isUser
                    ? "bg-slate-800 text-slate-100 border border-slate-700"
                    : "bg-slate-800/90 text-slate-200 border border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5 mb-2 text-[10px] text-slate-400 font-mono">
                  <span className="font-bold uppercase tracking-wider">{isUser ? "You" : "EcoScale Copilot"}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="prose prose-invert prose-xs max-w-none whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-3 text-slate-400 text-xs">
            <div className="w-8 h-8 rounded-sm bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="italic">Analyzing cluster telemetry & generating architectural response...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 shrink-0">
        <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest shrink-0">Quick Prompts:</span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="bg-slate-800 hover:bg-slate-700 hover:border-emerald-500/50 border border-slate-700 text-[11px] text-slate-300 px-3 py-1 rounded-full whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="pane p-2 rounded-md border border-slate-700 bg-slate-800 flex items-center space-x-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask Copilot about FinOps, IaC PRs, or Carbon Intensity..."
          className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold p-2 rounded-sm transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
