import {
  Sparkles,
  ArrowRight,
  Copy,
  FolderCode,
  Code,
  Hash,
  FileText,
  Download,
  Play,
  Square,
  RefreshCw,
  Settings,
  Maximize2,
  Minimize2,
  Terminal,
  Eye,
  EyeOff
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Preview from "./Preview";
import Editor from "@monaco-editor/react"

function Generate() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [showMessages, setShowMessages] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setShowMessages(true);
    setIsLoading(true);

    // Ajouter un message de loading
    setMessages(prev => [...prev, { role: "assistant", content: "🤖 Génération en cours...", isLoading: true }]);

    try {
      // APPEL API GEMINI (corrigé)
      const response = await fetch( 
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyC9vNkHk0PewELwI8gvJJiVrC0cgAqRsdI",
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

      // Nettoyer la réponse de l'IA pour ne garder que le texte explicatif
      const cleanedText = rawText.replace(/\*\*(.*?)\*\*\s*:?[\r\n]+```[\s\S]*?```/gm, '')
                                 .replace(/\n{3,}/g, '\n\n').trim();
      console.log("Cleaned Text:", cleanedText);

      // Supprimer le message de loading et afficher la réponse
      setMessages((prev) => prev.filter(msg => !msg.isLoading));

      // Afficher uniquement l’explication dans l'interface
      if (cleanedText) {
        setMessages((prev) => [...prev, { role: "assistant", content: cleanedText }]);
      }

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
      setMessages((prev) => prev.filter(msg => !msg.isLoading));
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Erreur API ou format incorrect." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

//   Scroll auto vers le bas
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

// function extractFiles(text) {
//   const regex = /\*\*(.*?)\*\*\s*:?[\r\n]+```(?:\w+)?\s*([\s\S]*?)```/gm;
//   const files = [];
//   let match;

//   while ((match = regex.exec(text)) !== null) {
//     const filename = match[1].trim().replace(/^\d+\.\s*/, '').replace(/\s*\(.*\):$/, '').replace(/:+$/, '');;
//     const content = match[2].trim();
//     if (filename && content) {
//       files.push({ file: filename, content });
//     }
//   }

//   return files;
// }

function extractFiles(text) {
  const regex = /\*\*(.+?)\*\*.*?\n+```(?:\w+)?\n([\s\S]*?)```/gm;
  const files = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const title = match[1].trim(); // ex: "index.html" ou "JavaScript (script.js)"
    const code = match[2].trim();

    // Extraire un nom de fichier valide :
    const nameInParentheses = title.match(/\(([^)]+)\)/);
    const filename = nameInParentheses
      ? nameInParentheses[1]
      : title.match(/[\w\-]+\.\w+/)?.[0] || "fichier.txt"; // ex: "index.html", sinon "fichier.txt"

    files.push({ file: filename, content: code });
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

function getLanguage(file){
  const ext = file.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'html':
      return 'html'
    case 'css':
      return 'css'
    case 'js':
      return 'javascript'
    default:
      return 'plaintext'
  }
}

const handleEdit = (newContent) => {
  if (typeof newContent !== "string") return;
  const updatedFiles = [...files];
  updatedFiles[selectedFileIndex] = {
    ...updatedFiles[selectedFileIndex],
    content: newContent,
  };
  setFiles(updatedFiles);
};

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
      <div className="w-[32%] h-full flex flex-col justify-between">
        {/* Zone de messages (user) */}
        {showMessages && (
          <div className="overflow-y-auto no-scrollbar rounded-lg transition-opacity duration-300 ease-in">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm text-white whitespace-pre-wrap mb-2 p-2 rounded ${
                  msg.role === "user"
                    ? "bg-[#1e1e1e]"
                    : ""
                }`}
              >
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
        <div className="w-[65%] ml-[3%] h-full bg-[#1e1e1e] p-4 rounded-md flex flex-col">
          {/* Boutons preview et download */}
          <div className="flex justify-between items-center pb-2">
            <button
              className="px-2 py-0.5 bg-blue-600 text-sm text-white rounded hover:shadow-[0_0_15px_rgba(37,99,235,0.3)]"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? "Code" : "Preview"}
            </button>
            <button
              onClick={handleDownload}
              className={`text-gray-400 hover:text-gray-500 ${
                          Object.keys(files).length === 0 ? "cursor-not-allowed" : "cursor-auto"
                        }`}
            >
              <Download className="w-4.5 h-4.5" />
            </button>
          </div>
         
          {showPreview ? (
            <Preview files={files} />
          ) : (
              <div className="flex overflow-auto">
              {/* Sidebar fichier */}
              <div className="w-1/4 bg-[#161616] border-r border-gray-800">
                <div className="flex items-center px-4 py-2 text-sm font-semibold">
                  <FolderCode className="w-4.5 h-4.5 mr-2" />
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
                    <div className="flex items-center">
                      {getIcon(file.file)}
                      <span className="truncate">{file.file}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Affichage du code du fichier sélectionné */}
              <div className="w-3/4 h-full overflow-y-auto">
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
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    {/* <pre className="text-sm h-full overflow-y-auto font-mono whitespace-pre-wrap"> */}
                      {/*<code>{files[selectedFileIndex].content}</code> */}
                      
                      {/* <SyntaxHighlighter
                        language={getLanguage(files[selectedFileIndex].file)}
                        style={vscDarkPlus}
                        wrapLines={true}
                        customStyle={{ background: '#0e0e0e', padding: '1rem' }}
                      >
                        {files[selectedFileIndex]?.content}
                      </SyntaxHighlighter> */}
                    {/* </pre> */}
                   
                        <Editor
                          height="400px"
                          defaultLanguage={getLanguage(files[selectedFileIndex].file)}
                          value={files[selectedFileIndex].content}
                          onChange={(newValue) => handleEdit(newValue)}
                          theme="vs-dark"
                          options={{
                            fontSize: 14,
                            minimap: { enabled: false },
                            padding: { top: 10 },
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                          }}
                          // beforeMount={(monaco) => {
                          //   // Pour JavaScript
                          //   monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                          //     noSemanticValidation: true,
                          //     noSyntaxValidation: true, // Désactive tout
                          //   });
                          //   // Pour HTML : désactive validation CSS/JS dans HTML
                          //   monaco.languages.html.htmlDefaults.setOptions({
                          //     validate: false, // Désactive les erreurs HTML
                          //   });
                          // }}
                        />

                  </div>
                )}
              </div>
            </div>
          )}

        </div>
        
      )}
    </div>
    
  );
}

export default Generate;
