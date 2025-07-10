import { Sparkles, ArrowRight, Copy, FolderCode, Code, Hash, Braces , FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function Generate() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [showMessages, setShowMessages] = useState(false);
  const [files, setFiles] = useState([]); 
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

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

      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      console.log("RAW AI TEXT:", rawText);

      // 🔧 On nettoie les balises Markdown ```json ... ```
      const cleanText = rawText
        .replace(/```json/, '')  // supprime l'ouverture
        .replace(/```/, '')      // supprime la fermeture
        .trim();

      try {
        const parsed = JSON.parse(cleanText);
        if (Array.isArray(parsed)) {
          setFiles(parsed);
        } else {
          setMessages((prev) => [...prev, { role: "assistant", content: rawText }]);
        }
      } catch (err) {
        console.error("Erreur de parsing JSON:", err);
        setMessages((prev) => [...prev, { role: "assistant", content: rawText }]);
      }

    } catch (error) {
      console.error("Erreur API Gemini:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Erreur API ou format incorrect." },
      ]);
    }
  };

//   Scroll auto vers le bas
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

function getIcon(file) {
  if (file.endsWith(".html")) return <Code className="w-3.5 h-3.5 mr-2 text-orange-400" />;
  if (file.endsWith(".css")) return <Hash className="w-3.5 h-3.5 mr-2 text-blue-400" />;
  // if (file.endsWith(".js")) return <Braces className="w-4 h-4 mr-2 text-yellow-300" />;
  if (file.endsWith(".js")) return <span className="w-4 h-4 mr-1.5 text-yellow-300" >js</span>;

  return <FileText className="w-4 h-4 mr-2 text-gray-400" />;
}

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white py-4">
      {/* Colonne utilisateur */}
      <div className="w-[33%] flex flex-col h-full">
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
        <div className="flex items-center border border-blue-500 bg-[#1e1e1e] p-3 rounded-xl w-full max-w-2xl shadow-sm focus-within:ring-1 focus-within:ring-blue-500 transition mx-4">
          <Sparkles className="w-5 h-5 animate-pulse text-blue-500 mr-3" />
          <textarea
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Posez une question..."
            className="flex-1 h-14 leading-[3.5rem] self-center bg-transparent text-white placeholder-gray-500 focus:outline-none overflow-y-auto no-scrollbar"
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

      {/* Colonne assistant  */}
      {showMessages && (
        <div className="bg-[#1e1e1e] w-[65%] ml-[2%] p-3 flex h-full rounded-md">
          {/* Sidebar fichier */}
          <div className="w-1/4 bg-[#161616] border-r border-gray-800">
            <div className="flex items-center px-4 py-2 text-sm font-semibold">
              <FolderCode className="w-4 h-4 mr-2" />
              <span className="">Fichiers</span>
            </div>

            {files.map((file, i) => (
              <div
                key={i}
                className={`flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-[#2a2a2a] ${
                  selectedFileIndex === i ? 'bg-[#2a2a2a]' : ''
                }`}
                onClick={() => setSelectedFileIndex(i)}
              >
                <div className="flex items-center ...">
                  {getIcon(file.file)}
                  <span className="truncate">{file.file}</span>
                </div>

                
              </div>
            ))}
          </div>

          {/* Affichage du code du fichier sélectionné */}
          <div className="w-3/4 max-h-full overflow-y-auto">
            {files[selectedFileIndex] && (
              <div className="flex flex-col h-full border border-gray-700 bg-[#0e0e0e]">
                <div className="bg-gray-900 text-white px-4 py-2 text-sm font-mono flex justify-between items-center">
                  <span>{files[selectedFileIndex].file}</span>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(files[selectedFileIndex].content)
                    }
                    className="text-gray-400 hover:text-gray-500 w-6 h-6 flex items-center justify-center"
                  >
                    <Copy className="w-4 h-4"/>
                  </button>
                </div>
                <pre className="text-sm max-h-full overflow-y-auto p-4 text-green-200 font-mono whitespace-pre-wrap">
                  <code>{files[selectedFileIndex].content}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Generate;
