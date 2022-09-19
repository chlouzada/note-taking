import React, {
  createContext,
  createRef,
  RefObject,
  useContext,
  useState,
} from "react";
import { Preview } from "./Preview";
import { Textarea } from "./Textarea";
import { Toolbar } from "./Toolbar";

type EditorContextType = {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  preview: boolean;
  togglePreview: () => void;
  ref: RefObject<HTMLTextAreaElement>;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const EditorContext = createContext<EditorContextType>(null!);

export const useEditor = () => useContext(EditorContext);

export function Editor() {
  const editorRef = createRef<HTMLTextAreaElement>();
  const [text, setText] = useState("");
  const [preview, _setPreview] = useState(false);

  const togglePreview = () => _setPreview(!preview);

  const value = {
    text,
    setText,
    preview,
    togglePreview,
    ref: editorRef,
  };

  return (
    <div className="flex flex-col flex-grow w-full h-full">
      <EditorContext.Provider value={value}>
        <Toolbar />
        <div className="flex flex-grow w-full">
          <Textarea />
          <Preview />
        </div>
      </EditorContext.Provider>
    </div>
  );
}
