import React, { useState, useRef, useEffect } from 'react';
import { Folders, Sparkles, ArrowRight, Copy, FolderCode, Code, Hash, FileText, Download, Bot, Eye, Loader2, AlertCircle, CheckCheck, List } from "lucide-react";
import JSZip, { file } from "jszip";
import { saveAs } from "file-saver";
import Preview from "./Preview";
import Editor from "@monaco-editor/react";
import { addProject, getProjects} from '../services/api';
import Projects from "./Projects";

function Generate() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [showMessages, setShowMessages] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const chatEndRef = useRef(null);


  const sendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setShowMessages(true);
    setIsLoading(true);

    // Ajouter un message de loading
    setMessages(prev => [...prev, { role: "assistant", content: <div className="flex items-center space-x-2"><Bot className="animate-pulse" /><p>Génération en cours...</p></div>, isLoading: true }]);

    try {
      // APPEL API GEMINI 
      const host = "https://generativelanguage.googleapis.com";
      const path = "v1beta/models/gemini-2.0-flash:generateContent?";
      const apiKey = "AIzaSyD5BrtOUP9ApUS4UeWiXZHMSl6Z7r3Dl6M";
      const response = await fetch( `${host}/${path}key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userInput }] }],
            generationConfig: {
              temperature: 0.2, //from 0 (very strict) to 1 (very creative)
              maxOutputTokens: 2000
            }
          }),
        }
      );

      const data = await response.json();

      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Nettoyer la réponse de l'IA pour ne garder que le texte explicatif
      const cleanedText = rawText.replace(/\*\*(.*?)\*\*\s*:?[\r\n]+```[\s\S]*?```/gm, '')
                                 .replace(/\n{3,}/g, '\n\n').trim();

      // Supprimer le message de loading et afficher la réponse
      setMessages((prev) => prev.filter(msg => !msg.isLoading));

      // Afficher uniquement l’explication dans l'interface
      if (cleanedText) {
        setMessages((prev) => [...prev, { role: "assistant", content: cleanedText }]);
      }

      const extractedFiles = extractFiles(rawText); // From Markdown

      if (extractedFiles.length > 0) {
        setFiles(extractedFiles); // Mise à jour des fichiers
        saveProject(extractedFiles); // Sauvegarder le projet
        // Ajouter un message de succès
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: ` ${extractedFiles.length} fichier(s) généré(s) avec succès !`,
          isSuccess: true
        }]);
      } else {
        console.warn("❌ Aucun fichier détecté. Contenu brut :", rawText);
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: " Aucun fichier n'a pu être généré. Veuillez reformuler votre demande.",
          isError: true
        }]);
      }

    } catch (error) {
      setMessages((prev) => prev.filter(msg => !msg.isLoading));
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Erreur API ou format incorrect." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const { email, token } = JSON.parse(stored);
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      if (tokenPayload?.sub) {
        setUser({ email, id: tokenPayload.sub }); // 'sub' contient l'ID utilisateur dans les tokens JWT
        loadHistory(tokenPayload.sub);
      }
    }
  }, []);

  // Scroll auto vers le bas
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Extraire les fichiers du texte de l'IA
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

  // Récupérer l'icône correspondant au fichier
  function getIcon(file) {
    if (file.endsWith(".html")) return <Code className="w-3.5 h-3.5 mr-2 text-orange-400" />;
    if (file.endsWith(".css")) return <Hash className="w-3.5 h-3.5 mr-2 text-blue-400" />;
    if (file.endsWith(".js")) return <span className="w-4 h-4 mr-1.5 text-yellow-300" >js</span>;
    return <FileText className="w-4 h-4 mr-2 text-gray-400" />;
  }

  // Récupérer le langage correspondant au fichier
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

  // Modifier le contenu d'un fichier
  const handleEdit = (newContent) => {
    if (typeof newContent !== "string") return;
    const updatedFiles = [...files];
    updatedFiles[selectedFileIndex] = {
      ...updatedFiles[selectedFileIndex],
      content: newContent,
    };
    setFiles(updatedFiles);
  };

  // Copier le contenu du fichier sélectionné dans le presse-papier
  const handleCopy = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  // Télécharger les fichiers
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

  }

  // Sauvegarder le projet
  const saveProject = async (filesToSave) => {
    try {
      const projectContent = filesToSave.map(f => ({
        file: f.file,
        content: f.content,
      }));

      const response = await addProject({
        user_id: user.id,
        title: userInput.substring(0, 50) || 'Projet sans titre',
        content: projectContent
      });

      loadHistory();

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // Charger l'historique des projets
  const loadHistory = async (userId = user?.id) => {
    if (!userId) return;
    try {
      const list = await getProjects(userId);
      setProjects(list);
      
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {!showMessages ? (
        <div className='absolute inset-0 px-6'>
          {/* Zone d'entrée */}
          <div className='flex flex-col items-center justify-center h-full'>
            <h3 className="text-2xl font-bold text-white mb-2">
              Qu’est-ce que vous voulez créer ?
            </h3>
            <div className="flex items-center border border-blue-500 bg-[#1e1e1e] mt-2 p-3 rounded-xl w-[35%] max-w-2xl shadow-sm focus-within:ring-1 focus-within:ring-blue-500 transition">
              <Sparkles className="w-5 h-5 animate-pulse text-blue-500 mr-3" />
              <textarea
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Décrivez le site web que vous souhaitez créer..."
                className="flex-1 h-20 leading-[5rem] self-center bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none overflow-y-auto no-scrollbar"
                disabled={isLoading}
              />
                <button
                  onClick={sendMessage}
                  disabled={!userInput.trim() || isLoading}
                  className={` p-2 rounded-md ml-3 transition-all duration-200
                  ${userInput.trim() && !isLoading
                    ? "bg-gradient-to-r from-blue-800 to-blue-500"
                    : "bg-gray-500/50 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )}
                </button>
            </div>
          </div>
          {/* Historique projets */}
          <div 
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
            className="relative flex flex-col items-center justify-end"
          >
            <button
              className="absolute bottom-0 left-0 h-7 w-7 mb-20 flex justify-center items-center bg-[#1e1e1e] rounded-full"
            >
              <Folders className='w-4 h-4'/>
            </button>
            {showDropdown && projects?.length > 0 && ( 
              <Projects  projects={projects} setFiles={setFiles} setUserInput={setUserInput} setShowMessages={setShowMessages}/>
            )}
          </div>
        </div>
       
        ) : (
        <div className="relative flex h-full w-full justify-center items-center py-4 px-6">
          
          {/* Historique projets */}
          <div 
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
            className="flex flex-col items-center justify-end h-full mb-10"
            
          >
            <button
              className="h-7 w-7 mr-2 flex justify-center items-center bg-[#1e1e1e] rounded-full"
            >
              <Folders className='w-4 h-4'/>
            </button>
            {showDropdown && projects?.length > 0 && ( 
              <Projects  
                projects={projects} 
                setFiles={setFiles} 
                setUserInput={setUserInput} 
                setShowMessages={setShowMessages}
              />
            )}
          </div>
        
          {/* Colonne utilisateur */}
          <div className="w-[32%] h-full flex flex-col justify-between">
            {/* Zone de messages (user) */}
            <div className="overflow-y-auto no-scrollbar rounded-lg transition-opacity duration-300 ease-in">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`text-sm text-white whitespace-pre-wrap mb-2 p-2 rounded-lg ${
                    msg.role === "user"
                      ? "bg-[#1e1e1e]"
                      : msg.isLoading
                      ? "bg-gray-800 text-gray-300 animate-pulse"
                      : msg.isSuccess
                      ? "bg-green-900/50 border border-green-500/30"
                      : msg.isError
                      ? "bg-red-900/50 border border-red-500/30"
                      : ""
                  }`}
                >
                  {msg.isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Bot className="animate-pulse" />
                      <p>Génération en cours...</p>
                    </div>
                  ) : msg.isSuccess ? (
                    <div className="flex items-center space-x-2 text-green-300">
                      <CheckCheck className="w-5 h-5" />
                      <p>{msg.content}</p>
                    </div>
                    ) : msg.isError ? (
                    <div className="flex items-center space-x-2 text-red-300">
                      <AlertCircle className="w-5 h-5 " />
                      <p>{msg.content}</p>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>         

            {/* Zone d'entrée */}
            <div>
              <div className="flex items-center border border-blue-500 bg-[#1e1e1e] mt-2 p-3 rounded-xl w-full max-w-2xl shadow-sm focus-within:ring-1 focus-within:ring-blue-500 transition">
                <Sparkles className="w-5 h-5 animate-pulse text-blue-500 mr-3" />
                <textarea
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Décrivez le site web que vous souhaitez créer..."
                  className="flex-1 h-14 leading-[3.5rem] self-center bg-transparent text-white text-xs placeholder-gray-500 focus:outline-none overflow-y-auto no-scrollbar"
                  disabled={isLoading}
                />
                  <button
                    onClick={sendMessage}
                    disabled={!userInput.trim() || isLoading}
                    className={` p-2 rounded-md ml-3 transition-all duration-200
                    ${userInput.trim() && !isLoading
                      ? "bg-gradient-to-r from-blue-800 to-blue-500"
                      : "bg-gray-500/50 cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <ArrowRight className="w-5 h-5" />
                    )}
                  </button>
              </div>
              <p className="text-right text-xs text-gray-500 mt-1">
                {userInput.length}/500
              </p>
            </div>
          </div>

          {/* Colonne assistant  */}
          <div className="w-[75%] ml-[3%] h-full bg-[#1e1e1e] p-4 rounded-md flex flex-col">
            {files.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-400 mb-2">Aucun fichier généré</h3>
                  <p className="text-gray-500 text-sm">Commencez par décrire votre projet dans le chat</p>
                </div>
              </div>
            ) : (
              // Boutons preview et download
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center pb-2">
                  <button
                    className="px-2 py-0.5 bg-gradient-to-r from-blue-800 to-blue-500 text-sm text-white rounded-lg transition-opacity duration-300"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview 
                      ? <div className="flex items-center">
                          <Code className="w-4 h-4 mr-2" />
                          <span>Code</span> 
                        </div>
                      : <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-2" />
                          <span>Preview</span> 
                        </div>
                      }
                  </button>
                  <button
                    onClick={handleDownload}
                    className={`text-gray-400 hover:text-gray-500 ${
                                files.length === 0 ? "cursor-not-allowed" : "cursor-auto"
                              }`}
                  >
                    <Download className="w-4.5 h-4.5" />
                  </button>
                </div>
              
                {showPreview ? (
                    <Preview files={files} />
                  ) : (
                    <div className="flex overflow-auto no-scrollbar">
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
                      <div className="w-3/4 h-full ">
                        {files[selectedFileIndex] && (
                          <div className="flex flex-col h-full border border-gray-700 bg-[#0e0e0e]">
                            <div className="bg-gray-900 text-white px-4 py-2 text-sm font-mono flex justify-between items-center">
                              <span>{files[selectedFileIndex].file}</span>
                              <button
                                onClick={() => handleCopy(files[selectedFileIndex].content)}
                                className="text-gray-400 hover:text-gray-500"
                              >
                                {copySuccess ? (
                                  <div className="flex items-center">
                                    <CheckCheck className="w-3 h-3 mr-1" /> Copié 
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <Copy className="w-3 h-3 mr-1" /> Copier
                                  </div>
                                )}
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

        </div>
      )}

    </>
  );
}

export default Generate;
