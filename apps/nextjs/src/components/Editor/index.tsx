import { useEffect, useRef, useState } from "react";
import { trpc } from "../../utils/trpc";
import { useSelection } from "../../pages/editor";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { LoadingOverlay } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";

import "react-markdown-editor-lite/lib/index.css";

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

const parser = new MarkdownIt({
  // breaks: true
});

export function Editor() {
  const [text, setText] = useState<string>();
  const { noteId } = useSelection();
  const debounced = useDebounce(text, 250);
  const { ref, height } = useElementSize();

  const { data, isLoading } = trpc.note.get.useQuery(noteId!, {
    enabled: !!noteId,
    cacheTime: 0,
  });
  const update = trpc.note.update.useMutation();

  const handleHTML = (text: string) => {
    const html = parser.render(text);
    return html.replace(/<[a-zA-Z]+(>|.*?[^?]>)/g, (match) => {
      return match.replace(">", ` class="md__${match.replace(/<|>/g, "")}">`);
    });
  };

  useEffect(() => {
    if (!noteId) return;
    update.mutate({ id: noteId!, data: { content: debounced } });
  }, [debounced]);

  return (
    <div ref={ref} className="col-start-3 col-end-9 relative">
      {data && (
        <MdEditor
          syncScrollMode={["leftFollowRight", "rightFollowLeft"]}
          style={{ height }}
          renderHTML={handleHTML}
          onChange={({ text }) => setText(text)}
          defaultValue={data.content}
          htmlClass="prose max-w-none"
        />
      )}
      <LoadingOverlay
        loaderProps={{ size: "sm", color: "indigo", variant: "dots" }}
        visible={isLoading}
      />
    </div>
  );
}
