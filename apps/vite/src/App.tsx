import { Editor } from "./components/Editor";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { TRPCProvider } from "./utils/trpc";

function App() {
  return (
    <>
      <Header />
      <main className="flex flex-row grow overflow-auto" >
        <Navigation />
        <Editor />
      </main>
      <Footer />
    </>
  );
}

const WithTRPC = () => (
  <TRPCProvider>
    <App />
  </TRPCProvider>
);

export default WithTRPC;
