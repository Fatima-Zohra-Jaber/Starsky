import { Sparkles, ArrowRight} from "lucide-react";
import { useEffect, useRef, useState } from "react";

function Generate() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [showMessages, setShowMessages] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setShowMessages(true);

    try {
      // APPEL API GEMINI (corrigé)
      const response = await fetch(  // AIzaSyB0WoMsCziVK2BosNZekidysrfpEUDPqXA
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyD4O9uoTrziTDwnkfXgH5f30Bk42ffnF4s",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userInput }] }],
          }),
        }
      );

      const data = await response.json();
      console.log('Réponse API Gemini:', data);
      const aiResponse =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "Pas de réponse.";

      setMessages([...newMessages, { role: "assistant", content: aiResponse }]);
    } catch (error) {
      console.error('Erreur API Gemini:', error);
      setMessages([...newMessages, { role: "assistant", content: "Erreur lors de la récupération de la réponse AI." }]);
    }
  };

//   Scroll auto vers le bas
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white py-4">
      {/* Colonne utilisateur */}
      <div className="w-[40%] flex flex-col h-full">
        {/* Zone de messages (user) */}
        {showMessages && (
          <div className="flex-1 overflow-y-auto space-y-4 transition-opacity duration-300 ease-in">
            {messages.map((msg, i) => (
              msg.role === "user" && 
                <div key={i} className="text-sm whitespace-pre-wrap" >
                  {msg.content}
                </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}
        {/* Zone d'entrée */}
        <div className="flex items-center border border-blue-500 bg-[#1e1e1e] p-3 rounded-xl w-full max-w-2xl mx-auto shadow-sm focus-within:ring-1 focus-within:ring-blue-500 transition mt-4">
          <Sparkles className="w-5 h-5 animate-pulse text-blue-500 mr-3" />
          <textarea
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Posez une question..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
          />
          {userInput.trim() && (
            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-blue-800 to-blue-500 p-2 rounded-md ml-3 transition"
            >
              <ArrowRight size={20} className="text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Colonne assistant */}
      {showMessages && (
        <div className="bg-[#1e1e1e] w-[58%] ml-[2%] p-3 flex flex-col h-full rounded-md">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 transition-opacity duration-300 ease-in">
            {messages.map((msg, i) => (
              msg.role === "assistant" && 
                <div key={i} className="text-sm whitespace-pre-wrap" >
                  {msg.content}
                </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>
      )}
    </div>
    // <iframe
    //       src={link}
    //       className="w-full h-full border-0 transition-transform duration-300"
    //       title={title}
    //       loading="lazy"
    //       sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
    //       style={{ zoom: 0.25, pointerEvents: 'none' }}
    //     />
  );
}

export default Generate;
