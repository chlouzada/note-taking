import { Editor } from "./components/Editor";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";

function App() {
  return (
    <>
      <Header />
      <div className="flex flex-row h-full">
        <Navigation />
        <Editor />
      </div>
    </>
  );
}

export default App;
