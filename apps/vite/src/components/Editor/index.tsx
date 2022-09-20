import { useEffect, useRef, useState } from "react";
import MarkdownIt from "markdown-it";

import MdEditor, { Plugins } from "react-markdown-editor-lite";

import "react-markdown-editor-lite/lib/index.css";
import "./styles.css";

const mdParser = new MarkdownIt(/* Markdown-it options */);

function handleEditorChange({ html, text }: { html: string; text: string }) {
  console.log("handleEditorChange", html, text);
}

export function Editor() {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight((ref.current as any)?.clientHeight);
  }, []);

  const renderHTML = (text: string) => mdParser.render(text);

  return (
    <div ref={ref} className="col-start-3 col-end-8">
      <MdEditor
        syncScrollMode={["leftFollowRight", "rightFollowLeft"]}
        style={{ height }}
        renderHTML={renderHTML}
        onChange={handleEditorChange}
        // plugins={[Plugins.ListOrdered, Plugins.ListUnordered]}
      />
    </div>
  );
}
