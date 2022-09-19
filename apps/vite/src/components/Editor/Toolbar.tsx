import { RefObject, useContext } from "react";
import { useEditor } from ".";

const bold = (ref?: RefObject<HTMLTextAreaElement>) => {
  if (!ref || !ref.current) return "****";

  const selection = ref.current.value.substring(
    ref.current.selectionStart,
    ref.current.selectionEnd
  );

  console.log(selection);

  if (!selection) {
    return `${ref.current.value.substring(
      0,
      ref.current.selectionStart
    )}**${ref.current.value.substring(
      ref.current.selectionStart,
      ref.current.selectionEnd
    )}**${ref.current.value.substring(ref.current.selectionEnd)}`;
  }

  return `${ref.current.value.substring(
    0,
    ref.current.selectionStart
  )}**${selection}**${ref.current.value.substring(
    ref.current.selectionEnd,
    ref.current.value.length
  )}`;
};

export function Toolbar() {
  const editor = useEditor();

  return (
    <div className="flex justify-between">
      <div>
        <button
          className="btn"
          onClick={() => editor.setText(bold(editor.ref))}
        >
          Bold
        </button>
      </div>
      <div>
        <button className="btn" onClick={() => editor.togglePreview()}>
          {editor.preview ? "Show Preview" : "Hide Preview"}
        </button>
      </div>
    </div>
  );
}
