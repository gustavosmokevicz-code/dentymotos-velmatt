import { createFileRoute } from "@tanstack/react-router";
import Hero from "@/components/Hero";
import ModelsShowcase, { PNEU_LARGO, URBANAS } from "@/components/ModelsShowcase";
import { MOTOS } from "@/components/models/motoCatalog";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Denty Motos + Velmatt — Move Different" }] }),
  component: HomePage,
});

function HomePage() {
  return (
    <main>
      <Hero />
      <ModelsShowcase config={PNEU_LARGO} />
      <ModelsShowcase config={URBANAS} />
      <ModelsShowcase config={MOTOS} />
    </main>
  );
}
