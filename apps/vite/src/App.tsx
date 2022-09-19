import { Editor } from "./components/Editor";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { TRPCProvider } from "./utils/trpc";

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

const WithTRPC = () => (
  <TRPCProvider>
    <App />
  </TRPCProvider>
);

export default WithTRPC;
