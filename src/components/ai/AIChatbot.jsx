// import { useState, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import { Send, Bot, User as UserIcon } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
// import { toast } from "sonner";

// export const AIChatbot = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!input.trim() || isLoading) return;

//     const userMessage = input.trim();
//     setInput("");

//     const newMessages = [...messages, { role: "user", content: userMessage }];
//     setMessages(newMessages);
//     setIsLoading(true);

//     try {
//       const { data, error } = await supabase.functions.invoke("ai-chat", {
//         body: { messages: newMessages, conversationHistory: messages },
//       });
//       if (error) throw error;

//       const assistantMessage = { role: "assistant", content: data.response };
//       setMessages([...newMessages, assistantMessage]);
//       scrollToBottom();
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("Erreur lors de la communication avec l'assistant");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Card className="flex h-[600px] flex-col">
//       <div className="border-b p-4">
//         <h3 className="flex items-center gap-2 font-semibold">
//           <Bot className="h-5 w-5 text-primary" />
//           Assistant IA
//         </h3>
//       </div>

//       <div className="flex-1 space-y-4 overflow-auto p-4">
//         {messages.length === 0 ? (
//           <div className="flex h-full items-center justify-center text-center text-muted-foreground">
//             <div>
//               <Bot className="mx-auto mb-4 h-12 w-12 opacity-50" />
//               <p>Posez-moi des questions sur vos projets et tâches</p>
//             </div>
//           </div>
//         ) : (
//           messages.map((msg, idx) => (
//             <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
//               <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
//                 {msg.role === "user" ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
//               </div>
//               <div className={`flex-1 rounded-lg p-3 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
//                 {msg.content}
//               </div>
//             </div>
//           ))
//         )}
//         {isLoading && (
//           <div className="flex gap-3">
//             <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
//               <Bot className="h-4 w-4 animate-pulse" />
//             </div>
//             <div className="flex-1 rounded-lg bg-secondary p-3">Réflexion en cours...</div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       <form onSubmit={handleSubmit} className="border-t p-4">
//         <div className="flex gap-2">
//           <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Écrivez votre message..." disabled={isLoading} />
//           <Button type="submit" disabled={isLoading || !input.trim()}><Send className="h-4 w-4" /></Button>
//         </div>
//       </form>
//     </Card>
//   );
// };
