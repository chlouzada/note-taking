import React from "react";
import { Editor } from "../components/Editor";
import { Navigation } from "../components/Navigation";
import AppLayout from "../layouts/AppLayout";

export default function EditorPage() {
  return (
    <AppLayout>
      <div className="h-full">
        <div className="grid grid-cols-7 min-h-full overflow-auto">
          <Navigation />
          <Editor />
        </div>
      </div>
    </AppLayout>
  );
}
