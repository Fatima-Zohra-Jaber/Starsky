import { useEffect, useState } from "react";

export default function Preview({ files }) {
  const [srcDoc, setSrcDoc] = useState("");

  useEffect(() => {
    setSrcDoc(generatePreviewHTML(files));
  }, [files]);

  return (
    <div className="border border-gray-600/50 rounded overflow-hidden h-[500px]">
      <iframe
       key={srcDoc} // 🔁 force React à re-render l'iframe
        srcDoc={srcDoc}
        title="Live Preview"
        sandbox="allow-scripts"
        frameBorder="0"
        className="w-full h-full bg-white"
      />
    </div>
  );
}

function generatePreviewHTML(files) {
  const htmlFile = files.find(f => f.file.endsWith(".html"))?.content || "";
  const css = files.find(f => f.file.endsWith(".css"))?.content || "";
  const js = files.find(f => f.file.endsWith(".js"))?.content || "";

  // Supprimer <link> et <script> externes
  let cleanedHtml = htmlFile
    .replace(/<link[^>]*href=["']?style\.css["']?[^>]*>/i, "")
    .replace(/<script[^>]*src=["']?script\.js["']?[^>]*><\/script>/i, "");

  // Extraire uniquement le contenu de <body>
  const match = cleanedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = match ? match[1] : cleanedHtml;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Preview</title>
        <style>${css}</style>
      </head>
      <body>
        ${bodyContent}
        <script>
          ${js}
        </script>
      </body>
    </html>
  `;
}



