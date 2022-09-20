import { TRPCProvider } from "./utils/trpc";
import { MantineProvider } from "@mantine/core";

import AppLayout from "./layouts/AppLayout";

import { Editor } from "./components/Editor";
import { Navigation } from "./components/Navigation";

function App() {
  return (
    <AppLayout>
      <main className="h-full">
        <div className="grid grid-cols-7 min-h-full overflow-auto">
          <Navigation />
          <Editor />
        </div>
      </main>
    </AppLayout>
  );
}

const WithProviders = () => (
  <TRPCProvider>
    <MantineProvider >
      <App />
    </MantineProvider>
  </TRPCProvider>
);

export default WithProviders;
