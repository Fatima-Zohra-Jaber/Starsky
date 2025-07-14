import { Sparkles, ArrowRight, Copy, FolderCode, Code, Hash, FileText, Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

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
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyB0WoMsCziVK2BosNZekidysrfpEUDPqXA",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userInput }] }],
            // response_mime_type: "application/json", // Spécification du format JSON
          }),
        }
      );

      const data = await response.json();

      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      console.log("RAW AI TEXT:", rawText);

      const extractedFiles = extractFiles(rawText); // From Markdown

      if (extractedFiles.length > 0) {
        setFiles(extractedFiles); // ou setState équivalent pour afficher dans l'interface
        console.log("✅ Fichiers extraits :", extractedFiles);
      } else {
        console.warn("❌ Aucun fichier détecté. Contenu brut :", rawText);
        // setMessages((prev) => [...prev, { role: "assistant", content: rawText }]);

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

function extractFiles(text) {
  const regex = /\*\*(.*?)\*\*\s*:?[\r\n]+```(?:\w+)?\s*([\s\S]*?)```/gm;
  const files = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const filename = match[1].trim().replace(/^\d+\.\s*/, '').replace(/\s*\(.*\):$/, '').replace(/:+$/, '');;
    const content = match[2].trim();
    if (filename && content) {
      files.push({ file: filename, content });
    }
  }

  return files;
}

function getIcon(file) {
  if (file.endsWith(".html")) return <Code className="w-3.5 h-3.5 mr-2 text-orange-400" />;
  if (file.endsWith(".css")) return <Hash className="w-3.5 h-3.5 mr-2 text-blue-400" />;
  // if (file.endsWith(".js")) return <Braces className="w-4 h-4 mr-2 text-yellow-300" />;
  if (file.endsWith(".js")) return <span className="w-4 h-4 mr-1.5 text-yellow-300" >js</span>;

  return <FileText className="w-4 h-4 mr-2 text-gray-400" />;
}

async function handleDownload() {
  if (Object.keys(files).length === 0) return;
  const zip = new JSZip();

  // Ajouter chaque fichier à l’archive
  files.forEach(f => {
    zip.file(f.file, f.content);
  });

  // Génération de l'archive
  const blob = await zip.generateAsync({ type: "blob" });
  // Déclencher le téléchargement
  saveAs(blob, "Satrsky_Projet.zip");
    // saveAs(zipBlob, 'ai-generated-website.zip');

}


  return (
    <div className="flex-grow overflow-y-auto flex justify-center items-center py-4">
      {/* Colonne utilisateur */}
      <div className="w-[32%] h-full flex flex-col">
        {/* Zone de messages (user) */}
        {showMessages && (
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 transition-opacity duration-300 ease-in">
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
        <div className="flex items-center border border-blue-500 bg-[#1e1e1e] mt-2 p-3 rounded-xl w-full max-w-2xl shadow-sm focus-within:ring-1 focus-within:ring-blue-500 transition">
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
        <div className="bg-[#1e1e1e] w-[65%] ml-[3%] p-3 flex h-full rounded-md">
          {/* Sidebar fichier */}
          <div className="w-1/4 bg-[#161616] border-r border-gray-800">
            <div className="flex justify-between items-center">
              <div className="flex items-center px-4 py-2 text-sm font-semibold">
                <FolderCode className="w-4.5 h-4.5 mr-2" />
                <span className="">Fichiers</span>
              </div>
              <button
                onClick={handleDownload}
                className={`text-gray-400 hover:text-gray-500 px-3 ${
                            Object.keys(files).length === 0 ? "cursor-not-allowed" : "cursor-auto"
                          }`}
              >
                <Download className="w-4.5 h-4.5" />
              </button>
            </div>

            {files.map((file, i) => (
              <div
                key={i}
                className={`flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-[#2a2a2a] ${
                  selectedFileIndex === i ? 'bg-[#2a2a2a]' : ''
                }`}
                onClick={() => setSelectedFileIndex(i)}
              >
                <div className="flex items-center">
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
