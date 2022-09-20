import { useEffect, useRef, useState } from "react";
import { trpc } from "../../utils/trpc";
import { useSelection } from "../../layouts/AppLayout";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";

import "react-markdown-editor-lite/lib/index.css";
import "./styles.module.css";

const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    if (value === undefined) return;
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const parser = new MarkdownIt(/* Markdown-it options */);

export function Editor() {
  const [text, setText] = useState<string>();
  const [height, setHeight] = useState(0);
  const { noteId } = useSelection();
  const ref = useRef<HTMLDivElement>(null);
  const debounced = useDebounce(text, 500);

  const { data: note } = trpc.note.get.useQuery(noteId!, { enabled: !!noteId });
  const update = trpc.note.update.useMutation();

  useEffect(() => {
    setHeight((ref.current as any)?.clientHeight);
  }, []);

  useEffect(() => {
    update.mutate({ id: noteId!, data: { content: debounced } });
  }, [debounced]);

  return (
    <div ref={ref} className="col-start-3 col-end-8">
      {note && (
        <MdEditor
          syncScrollMode={["leftFollowRight", "rightFollowLeft"]}
          style={{ height }}
          renderHTML={(text: string) => parser.render(text)}
          onChange={({ text }) => setText(text)}
          defaultValue={note.content}
        />
      )}
    </div>
  );
}
