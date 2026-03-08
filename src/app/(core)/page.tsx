import Feed from "./_components/feed";
import Hero from "./_components/hero";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <Hero />
        <Feed />
      </main>
    </div>
  );
}
