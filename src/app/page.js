import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginButton from "@/components/LoginButton";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1db954]/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      
      <div className="max-w-3xl flex flex-col items-center bg-white/5 backdrop-blur-xl p-10 md:p-16 rounded-[3rem] shadow-2xl border border-white/10 ring-1 ring-inset ring-white/10">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-lg tracking-tight">
          Sort your Spotify!<br />
          Simplified with<br />
          Album<span className="text-[#1db954]">Sortify</span>
        </h1>
        
        <p className="text-lg md:text-2xl text-gray-400 mb-12 max-w-2xl font-light">
          Create custom lists and sort your favorite albums effortlessly.<br className="hidden md:block" />
          The ultimate sorting solution for albums.
        </p>
        
        <LoginButton />
      </div>
      
    </div>
  );
}
