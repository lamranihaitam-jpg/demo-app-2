'use client'
import { useEffect, useState } from "react";
import Link from "next/link";

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([
    "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
  ]);
  const [input, setInput] = useState("");

  function sendMessage() {
    if (!input.trim()) return;
    setMessages((m) => [...m, input.trim()]);
    setInput("");
    // Placeholder: here you could call an API for intelligent replies
    setTimeout(() => {
      setMessages((m) => [...m, "Merci pour votre message — un conseiller vous répondra bientôt."]);
    }, 700);
  }

  return (
    <div className="relative">
      {/* Chat bubble */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chat"
        className="hidden lg:flex h-12 w-12 items-center justify-center rounded-full shadow-lg 
             bg-primary hover:bg-[#E0E2FF] text-white hover:text-black transition-colors duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4-.8L3 20l1.2-3.6A7.963 7.963 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Chat panel */}
      {open && (
        <div className="absolute right-0 bottom-14 z-50 w-80 max-w-xs rounded-lg bg-white shadow-xl text-black">
          <div className="flex items-center justify-between rounded-t-lg bg-deep-slate/5 px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-primary text-white flex items-center justify-center">ID</div>
              <div className="font-medium">Assistant</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="close chat" className="text-black/60 hover:text-black">×</button>
          </div>
          <div className="max-h-60 overflow-auto px-3 py-2 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className="rounded-md bg-gray-100 px-3 py-2 text-sm">{m}</div>
            ))}
          </div>
          <div className="px-3 py-2 border-t">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ecrire un message..."
                className="flex-1 rounded-md border px-2 py-1 text-sm"
              />
              <button onClick={sendMessage} className="rounded-md px-3 py-1 text-sm 
               bg-primary text-white hover:bg-[#E0E2FF] hover:text-black transition-colors duration-300">Envoyer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Top: 0 takes us all the way back to the top of the page
  // Behavior: smooth keeps it smooth!
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // Button is displayed after scrolling for 500 pixels
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-999">
      <div className="flex items-center gap-2.5">
        <Chatbot />
        {isVisible && (
          <div
            onClick={scrollToTop}
            aria-label="scroll to top"
            className="group flex h-10 w-10 cursor-pointer items-center justify-center rounded-md 
             bg-primary text-white shadow-md transition-colors duration-300 ease-in-out 
             hover:bg-[#E0E2FF]"
          >
            <span className="mt-[6px] h-3 w-3 rotate-45 border-l border-t border-white 
                   transition-colors duration-300 ease-in-out 
                   group-hover:border-black"></span>
          </div>
        )}
      </div>
    </div>
  );
}
