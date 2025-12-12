import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-950 text-white">
      <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
        Asfalya
      </h1>
      <p className="text-xl mb-12 text-zinc-400">
        Insurance Notification & Insights Platform
      </p>

      <div className="flex gap-6">
        <Link href="/admin">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Admin Portal
          </Button>
        </Link>
        <Link href="/customer">
          <Button size="lg" variant="outline" className="text-white hover:text-black hover:bg-white border-zinc-700">
            Customer Portal
          </Button>
        </Link>
      </div>
    </main>
  );
}
