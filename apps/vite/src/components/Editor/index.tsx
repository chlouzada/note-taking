import React, {
  createContext,
  createRef,
  RefObject,
  useContext,
  useState,
} from "react";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";

import "react-markdown-editor-lite/lib/index.css";

const mdParser = new MarkdownIt(/* Markdown-it options */);

function handleEditorChange({ html, text }: { html: string; text: string }) {
  console.log("handleEditorChange", html, text);
}

export function Editor() {
  return (
    <MdEditor
      // style={{ height: "500px" }}
      className="w-full"
      renderHTML={(text) => mdParser.render(text)}
      onChange={handleEditorChange}
    />
  );
}
