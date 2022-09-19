import { marked } from "marked";
import { useContext } from "react";
import { useEditor } from ".";

export function Preview() {
  const editor = useEditor();

  if (!editor.preview) return null;

  const html = marked
    .parse(editor.text || "")
    .replace(/<h1/g, "<h1 class='text-4xl font-bold'")
    .replace(/<h2/g, "<h2 class='text-3xl font-bold'")
    .replace(/<h3/g, "<h3 class='text-2xl font-bold'")
    .replace(/<h4/g, "<h4 class='text-xl font-bold'")
    .replace(/<h5/g, "<h5 class='text-xl font-bold'")
    .replace(/<h6/g, "<h6 class='text-xl font-bold'")
    .replace(/<ul>/g, "<ul style='list-style: disc;'>")
    .replace(/<li>/g, "<li style='margin-left: 2.5rem;'>");

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      className="bg-red-200 md:block w-1/2"
    />
  );
}
