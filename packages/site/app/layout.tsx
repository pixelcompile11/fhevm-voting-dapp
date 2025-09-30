import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Ballon d'Or Voting dApp | Zama FHEVM",
  description: "Ballon d'Or Voting dApp",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`text-foreground antialiased`}>
        <div className="fixed inset-0 w-full h-full z-[-20] min-w-[850px]"></div>
        <main className="h-full w-full max-w-full flex flex-col mx-auto min-w-[850px] m-0">
          <nav className="zama-bg flex w-full px-3 md:px-0 h-fit justify-between items-center !h-[105px] !pl-[40px]">
            <Image
              src="/zama-logo.svg"
              alt="Zama Logo"
              width={120}
              height={120}
            />
          </nav>
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
