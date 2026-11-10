import Link from "next/link";
import { Scissors, Search, UtensilsCrossed } from "lucide-react";
import { RecommendedVenues } from "@/features/venues/components/recommended-venues";

// ponytail: из 8 категорий макета только 2 в плане (Еда, Услуги); остальные — когда дойдут их разделы.
const categories = [
  { href: "/restaurants", label: "Еда", icon: UtensilsCrossed },
  { href: "/salons", label: "Услуги", icon: Scissors },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <Link
        href="/search"
        className="flex items-center gap-2 rounded-xl bg-input px-4 py-3 text-muted-foreground"
      >
        <Search className="size-5" aria-hidden />
        Поиск
      </Link>

      <nav aria-label="Категории" className="grid grid-cols-4 gap-2">
        {categories.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex aspect-square flex-col justify-between rounded-xl bg-card p-2 shadow-card"
          >
            <span className="text-sm font-medium">{label}</span>
            <Icon className="size-7 self-end text-primary" aria-hidden />
          </Link>
        ))}
      </nav>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Рекомендуемые</h2>
        <RecommendedVenues />
      </section>
    </div>
  );
}
