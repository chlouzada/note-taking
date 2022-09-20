import { useEffect, useRef, useState } from "react";
import { trpc } from "../../utils/trpc";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";

import "react-markdown-editor-lite/lib/index.css";
import "./styles.module.css";
import { useSelection } from "../../layouts/AppLayout";

const mdParser = new MarkdownIt(/* Markdown-it options */);

export function Editor() {
  const [height, setHeight] = useState(0);
  const { noteId } = useSelection();
  const ref = useRef<HTMLDivElement>(null);
  let timeoutId: NodeJS.Timeout;

  const { data: note } = trpc.note.get.useQuery(noteId!, { enabled: !!noteId });

  const update = trpc.note.update.useMutation();

  const handleEditorChange = ({
    html,
    text,
  }: {
    html: string;
    text: string;
  }) => {
    if (!note) return;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      const data = update.mutate({
        id: note.id,
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
          defaultValue={note.content}
        />
      )}
    </div>
  );
}