import { FolderCode, List } from "lucide-react";

function Projects({ projects, setFiles, setUserInput, setShowMessages }) {
  return (
    <div className="flex flex-col fixed left-0 top-0 w-[320px] h-full bg-gradient-to-br bg-[#161616] border-r-2 border-[#2F2F2F] z-50 shadow-2xl rounded-r-3xl text-sm overflow-hidden animate-slide-in">
    <div className="flex items-center justify-between px-5 py-4 border-b border-[#2F2F2F] bg-[#101010]">
        <span className="font-bold text-lg text-white tracking-wide flex items-center gap-2">
        <List className="w-5 h-5 text-white" />
        Historique projets
        </span>
        <span className="text-xs text-gray-400">{projects.length} projet{projects.length > 1 ? 's' : ''}</span>
    </div>
    <ul className="flex-1 overflow-y-auto no-scrollbar px-2 py-2 space-y-1">
        {projects.map(p => (
        <li key={p.id} className="group">
            <button
            className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg bg-[#292929] hover:bg-blue-900/30 transition border border-transparent hover:border-blue-500 shadow-sm"
            onClick={() => {
                setUserInput(p.title); 
                setFiles(p.content);
                setShowMessages(true);
            }}
            >
            <FolderCode className="w-4 h-4 text-white group-hover:text-blue-400" />
            <span className="truncate font-medium text-white">{p.title}</span>
            <span className="ml-auto text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString()}</span>
            </button>
        </li>
        ))}
        {projects.length === 0 && (
        <li className="text-center text-gray-500 py-8">Aucun projet enregistré</li>
        )}
    </ul>
    </div>
          
  );
}

export default Projects;
