"use client";

import React from "react";
import { usePathname } from "next/navigation";
import "./globals.css";
import Navbar from "@/components/Navbar";
import StoreProvider from "./storeProvider";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <StoreProvider>
        <body>
          <div style={{ display: "flex", height: "100vh" }}>
            {pathname !== "/login" && <Navbar />}
            <main
              style={{
                flexGrow: 1,
                paddingTop: "55px",
                marginLeft: pathname !== "/login" ? "70px" : "0",
              }}
            >
              {children}
            </main>
          </div>
        </body>
      </StoreProvider>
    </html>
  );
}
