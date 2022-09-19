import { Editor } from "./components/Editor";
import { Header } from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <main className="flex flex-col min-h-full">
        <Editor />
      </main>
    </>
  );
}

export default App;
