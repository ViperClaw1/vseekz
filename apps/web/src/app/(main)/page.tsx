import Link from "next/link";
import { Bike, ChevronRight, Clapperboard, PartyPopper, Search, ShoppingBag, Soup, Sparkle } from "lucide-react";
import { BannerCarousel } from "@/components/banner-carousel";
import { RecommendedVenues } from "@/features/venues/components/recommended-venues";
import { cn } from "@/lib/utils";

// ponytail: без href — разделов ещё нет, плитки неактивны; добавить href, когда появятся.
const categories = [
  { href: "/restaurants", label: "Рестораны", icon: Soup, color: "bg-orange-500" },
  { href: "/salons", label: "Услуги", icon: Sparkle, color: "bg-emerald-500" },
  { label: "Магазины", icon: ShoppingBag, color: "bg-amber-400" },
  { label: "Кино", icon: Clapperboard, color: "bg-red-600" },
  { label: "События", icon: PartyPopper, color: "bg-fuchsia-500" },
  { label: "Спорт", icon: Bike, color: "bg-blue-500" },
];

const tileClass = "flex flex-col items-start gap-2 rounded-xl bg-card p-3";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-5 pt-1">
      <BannerCarousel />

      <Link
        href="/search"
        className="flex items-center gap-2 rounded-xl bg-input px-3 py-2.5 text-muted-foreground"
      >
        <Search className="size-5" aria-hidden />
        Поиск
      </Link>

      <nav aria-label="Категории">
        <ul className="grid grid-cols-3 gap-2">
          {categories.map(({ href, label, icon: Icon, color }) => {
            const content = (
              <>
                <span className={cn("flex size-7 items-center justify-center rounded-full text-white", color)}>
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="text-base">{label}</span>
              </>
            );
            return (
              <li key={label}>
                {href ? (
                  <Link href={href} className={tileClass}>{content}</Link>
                ) : (
                  <span aria-disabled className={cn(tileClass, "cursor-default")} title="Скоро">
                    {content}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <section className="flex flex-col gap-3">
        <Link href="/search" className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Рекомендуемые</h2>
          <ChevronRight className="size-5 text-muted-foreground" aria-label="Все" />
        </Link>
        <RecommendedVenues />
      </section>
    </div>
  );
}
