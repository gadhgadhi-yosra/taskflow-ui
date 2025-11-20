import { useState, useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Brain, Mic, Send, X, Volume2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Chatbot({ onClose }) {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Salam ! Je suis ton assistant IA. Dis-moi ce que tu veux faire" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickSuggestions = [
    "Créer une tâche urgente",
    "Prédire les retards",
    "Suggérer une équipe",
    "Résumer mon projet",
  ];

  const handleSend = async () => {
    const textToSend = (input || transcript).trim();
    if (!textToSend) return;

    setMessages((prev) => [...prev, { role: "user", content: textToSend }]);
    setInput("");
    resetTranscript();
    setLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: `Tâche / demande "${textToSend}" bien prise en compte. IA propose : deadline demain, priorité haute, risque de retard faible.`,
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "fr-FR";
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };


  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({
        continuous: true,
        language: "fr-FR",
      });
    }
  };

  if (!browserSupportsSpeechRecognition) {
    console.warn("Ton navigateur ne supporte pas la reconnaissance vocale");
  }

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[580px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col z-50">
 
      <div className="p-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 animate-pulse" />
          <div>
            <p className="font-bold">IA TaskFlow</p>
            <p className="text-xs opacity-90">En ligne • Répond en ~1s</p>
          </div>
        </div>
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>


      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-400">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-2xl text-sm shadow-sm ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              }`}
            >
              <p className="break-words">{msg.content}</p>
              {msg.role === "bot" && (
                <button
                  onClick={() => speak(msg.content)}
                  className="mt-2 flex items-center gap-1 text-xs opacity-70 hover:opacity-100 transition"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Lire
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 animate-spin text-indigo-600" />
              <span className="text-xs text-gray-600 dark:text-gray-300">
                L'IA réfléchit...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>


      <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
        {quickSuggestions.map((sug) => (
          <button
            key={sug}
            type="button"
            onClick={() => {
              setInput(sug);
              resetTranscript();
            }}
            className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900 transition whitespace-nowrap"
          >
            {sug}
          </button>
        ))}
      </div>


      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <div className="flex gap-2 items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={listening ? "Je vous écoute..." : "Pose ta question..."}
            className="flex-1 border-gray-300 dark:border-gray-700 focus-visible:ring-indigo-500"
            disabled={loading}
          />

          <Button
            type="button"
            size="icon"
            variant={listening ? "destructive" : "outline"}
            onClick={toggleListening}
            disabled={!browserSupportsSpeechRecognition || loading}
            title={browserSupportsSpeechRecognition ? "Dictée vocale" : "Micro non supporté"}
          >
            <Mic className={`w-5 h-5 ${listening ? "animate-pulse text-red-600" : ""}`} />
          </Button>

          <Button
            type="button"
            onClick={handleSend}
            size="icon"
            disabled={loading || (!input.trim() && !transcript)}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>

        {listening && (
          <div className="mt-2 text-center text-xs text-indigo-600 animate-pulse">
            En écoute... Parle maintenant
          </div>
        )}
      </div>
    </div>
  );
}