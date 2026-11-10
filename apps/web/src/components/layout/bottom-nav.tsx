"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { CalendarDays, House, Search, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Главная", icon: House },
  { href: "/my-events", label: "Мои события", icon: CalendarDays },
  { href: "/search", label: "Поиск", icon: Search },
  { href: "/cart", label: "Корзина", icon: ShoppingBag },
  { href: "/profile", label: "Профиль", icon: User },
] as const;

// usePathname на динамических маршрутах с cacheComponents требует Suspense;
// фоллбэк — та же панель без активной вкладки.
export function BottomNav() {
  return (
    <Suspense fallback={<Tabs pathname={null} />}>
      <ActiveTabs />
    </Suspense>
  );
}

function ActiveTabs() {
  return <Tabs pathname={usePathname()} />;
}

function Tabs({ pathname }: { pathname: string | null }) {
  return (
    <nav
      aria-label="Основная навигация"
      className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)]"
    >
      <ul className="flex rounded-2xl bg-card shadow-card">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : !!pathname?.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 py-3 text-[11px] text-muted-foreground transition-colors",
                  active && "text-primary",
                )}
              >
                <Icon className="size-5" aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
