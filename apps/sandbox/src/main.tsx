import { CadsProvider } from "@moshebari/cads-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RootLayout } from "./RootLayout";
import { SymbolFill } from "./SymbolFill";
import "@moshebari/cads-variables/variables.css";
import "@moshebari/cads-react/icons/fonts.css";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CadsProvider baseline={false}>
      <RootLayout>
        <SymbolFill />
      </RootLayout>
    </CadsProvider>
  </StrictMode>,
);
