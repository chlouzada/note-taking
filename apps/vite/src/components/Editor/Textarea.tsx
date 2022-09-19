import classNames from "classnames";
import { useContext, useEffect, useRef } from "react";
import { useEditor } from ".";

export function Textarea() {
  const editor = useEditor();

  const cursor = useRef({ start: 0, end: 0, newLine: false });

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const { value, selectionStart, selectionEnd } = e.currentTarget;
    if (
      e.nativeEvent instanceof InputEvent &&
      e.nativeEvent.inputType === "insertLineBreak"
    ) {
      const before = value.slice(0, selectionStart);
      const linesBefore = before.split("\n");
      const previousLine = linesBefore[linesBefore.length - 2];

      const after = value.slice(selectionEnd);
      const nextLine = after.split("\n")[1];

      if (previousLine === "- ") {
        cursor.current = {
          start: selectionStart - 2,
          end: selectionStart - 2,
          newLine: true,
        };

        if (nextLine === "") {
          return editor.setText(
            value.slice(0, selectionStart - 3) + value.slice(selectionEnd)
          );
        }

        if (nextLine?.startsWith("- ")) {
          return editor.setText(
            value.slice(0, selectionStart - 3) +
              "\n" +
              value.slice(selectionEnd)
          );
        }

        return editor.setText(
          value.slice(0, selectionStart - 3) + value.slice(selectionEnd)
        );
      }

      if (previousLine?.startsWith("- ")) {
        cursor.current = {
          start: selectionStart + 2,
          end: selectionStart + 2,
          newLine: true,
        };
        return editor.setText(
          `${value.slice(0, selectionStart)}- ${value.slice(selectionEnd)}`
        );
      }
    }

    editor.setText(e.currentTarget.value);
  };

  useEffect(() => {
    if (cursor.current.newLine) {
      editor.ref.current?.setSelectionRange(
        cursor.current.start,
        cursor.current.end
      );
      cursor.current.newLine = false;
    }
  }, [editor.text]);

  return (
    <textarea
      ref={editor.ref}
      className={`outline-none resize-none ${classNames({
        grow: !editor.preview,
        "hidden md:block w-1/2": editor.preview,
      })}`}
      value={editor.text}
      onChange={handleInput}
    />
  );
}
