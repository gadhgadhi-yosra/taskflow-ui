
import { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Brain, Mic, Send, X, Volume2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Chatbot({ onClose }) {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Salam ! Je suis ton assistant IA. Dis-moi ce que tu veux faire" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const quickSuggestions = [
    "Créer une tâche urgente",
    "Prédire les retards",
    "Suggérer une équipe",
    "Résumer mon projet"
  ];

  const handleSend = async () => {
    if (!input.trim() && !transcript) return;
    const text = input || transcript;
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setInput("");
    resetTranscript();
    setLoading(true);


    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "bot",
        content: `Tâche "${text}" bien créée ! Deadline demain, priorité haute. IA prévoit 0 retard`
      }]);
      setLoading(false);
    }, 1000);
  };

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "fr-FR";
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[580px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col z-50">

      <div className="p-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 animate-pulse" />
          <div>
            <p className="font-bold">IA TaskFlow</p>
            <p className="text-xs opacity-90">En ligne • Répond en 0.8s</p>
          </div>
        </div>
        <Button onClick={onClose} variant="ghost" size="icon" className="text-white hover:bg-white/20">
          <X className="w-5 h-5" />
        </Button>
      </div>


      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs px-4 py-3 rounded-2xl ${
              msg.role === "user"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            }`}>
              <p className="text-sm">{msg.content}</p>
              {msg.role === "bot" && (
                <button onClick={() => speak(msg.content)} className="mt-2">
                  <Volume2 className="w-4 h-4 opacity-70 hover:opacity-100" />
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl">
              <Sparkles className="w-5 h-5 animate-spin text-indigo-600" />
            </div>
          </div>
        )}
      </div>


      <div className="px-4 py-2 flex gap-2 overflow-x-auto">
        {quickSuggestions.map((sug) => (
          <button
            key={sug}
            onClick={() => { setInput(sug); }}
            className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900 transition whitespace-nowrap"
          >
            {sug}
          </button>
        ))}
      </div>


      <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex gap-3 items-center bg-gray-50 dark:bg-gray-900">
        <Input
          value={input || transcript}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Pose ta question..."
          className="flex-1 border-gray-300 dark:border-gray-700"
        />
        <Button
          size="icon"
          variant={listening ? "destructive" : "outline"}
          onClick={() => listening ? SpeechRecognition.stopListening() : SpeechRecognition.startListening({ continuous: true, language: "fr-FR" })}
        >
          <Mic className={`w-5 h-5 ${listening ? "animate-pulse" : ""}`} />
        </Button>
        <Button onClick={handleSend} size="icon" className="bg-gradient-to-r from-indigo-600 to-violet-600">
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}