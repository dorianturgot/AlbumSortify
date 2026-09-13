import "./globals.css";
import { Providers } from "@/components/Providers";
import { Libre_Franklin } from "next/font/google";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import CurrentlyPlaying from "@/components/CurrentlyPlaying";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const libre = Libre_Franklin({ subsets: ["latin"] });

export const metadata = {
  title: "AlbumSortify",
  description: "Sort and manage your favorite Spotify albums",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${libre.className} bg-gradient-to-br from-[#121212] to-[#1a1a1a] text-white min-h-screen flex flex-col`} suppressHydrationWarning>
        <Providers>
          <header className="bg-black/40 backdrop-blur-md sticky top-0 z-50 border-b border-white/10 shadow-lg">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold tracking-tight">
                Album<span className="text-[#1db954]">Sortify</span>
              </Link>
              {session && (
                <div className="flex items-center gap-6">
                  <CurrentlyPlaying />
                  <div className="flex items-center gap-3">
                    <img 
                      src={session.user.image} 
                      alt={session.user.name} 
                      className="w-10 h-10 rounded-full border-2 border-white/10 shadow-sm"
                    />
                    <span className="font-medium hidden md:inline">{session.user.name}</span>
                    <LogoutButton />
                  </div>
                </div>
              )}
            </div>
          </header>
          <main className="container mx-auto px-4 pt-8 pb-12">
            {children}
          </main>
          
          <footer className="mt-16 py-8 text-center text-white/50 text-sm">
            © 2026 Copyright: <a href="https://github.com/dorianturgot" target="_blank" rel="noreferrer" className="hover:text-[#1db954] transition-colors">Dorian TURGOT</a>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
