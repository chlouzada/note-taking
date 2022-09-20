import { useEffect, useRef, useState } from "react";
import MarkdownIt from "markdown-it";

import MdEditor from "react-markdown-editor-lite";

import "react-markdown-editor-lite/lib/index.css";
import "./styles.css";
import { trpc } from "../../utils/trpc";
import { useSelection } from "../../App";

const mdParser = new MarkdownIt(/* Markdown-it options */);

export function Editor() {
  const [height, setHeight] = useState(0);
  const { noteId } = useSelection();
  const ref = useRef(null);
  let timeoutId: NodeJS.Timeout;

  const { data } = trpc.notebook.all.useQuery();
  const note = data?.flatMap((n) => n.notes).find((n) => n.id === noteId);

  const update = trpc.note.update.useMutation();

  const handleEditorChange = ({
    html,
    text,
  }: {
    html: string;
    text: string;
  }) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      const data = update.mutate({
        id: noteId!,
        data: {
          content: text,
        },
      });

      console.log(data);
      clearTimeout(timeoutId);
    }, 1000);
  };

  useEffect(() => {
    setHeight((ref.current as any)?.clientHeight);
  }, []);

  return (
    <div ref={ref} className="col-start-3 col-end-8">
      {note && (
        <MdEditor
          syncScrollMode={["leftFollowRight", "rightFollowLeft"]}
          style={{ height }}
          renderHTML={(text: string) => mdParser.render(text)}
          onChange={handleEditorChange}
          defaultValue={note.content || ""}
        />
      )}
    </div>
  );
}
