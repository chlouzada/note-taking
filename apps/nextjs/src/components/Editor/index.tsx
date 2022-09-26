import { useEffect, useRef, useState } from "react";
import { trpc } from "../../utils/trpc";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { LoadingOverlay } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { useEditorStore } from "../../stores/editor";

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
  const { selectedNoteId } = useEditorStore();
  const { ref, height } = useElementSize();
  const debounced = useDebounce(text, 250);

  const { data, isLoading } = trpc.note.get.useQuery(selectedNoteId!, {
    enabled: !!selectedNoteId,
    cacheTime: 0,
  });
  const update = trpc.note.update.useMutation();

  const handleHTML = (text: string) => parser.render(text);

  useEffect(() => {
    if (!selectedNoteId) return;
    update.mutate({ id: selectedNoteId!, data: { content: debounced } });
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
