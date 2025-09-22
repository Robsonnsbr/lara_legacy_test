import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fornecedores",
  description: "CRUD mínimo com Next.js + Laravel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased selection:bg-blue-100 selection:text-blue-900">
        <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-14 items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-7 w-7 rounded-xl bg-blue-600/90"
                  aria-hidden
                />
                <span className="text-base font-semibold tracking-tight">
                  Fornecedores
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>

        <footer className="border-t py-6 text-xs text-gray-500">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p>CRUD demo • Next.js + Laravel • Responsivo</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
