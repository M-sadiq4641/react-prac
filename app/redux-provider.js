"use client";

import { ClientContextProvider } from "@/services/walletServices";
import store from "../store/store";
// import { store } from "./store";
import { Provider } from "react-redux";
// import { ClientContextProvider } from "services/walletServices";

export function Providers({ children }) {
  return (
    <ClientContextProvider>
      <Provider store={store}>{children}</Provider>;
    </ClientContextProvider>
  );
}
