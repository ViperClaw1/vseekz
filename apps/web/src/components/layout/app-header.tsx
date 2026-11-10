import Link from "next/link";
import { Bell, ChevronDown, MapPin } from "lucide-react";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-background/95 px-5 py-3 backdrop-blur">
      <Link href="/" className="text-2xl font-bold tracking-tight">
        <span className="text-primary">V</span>SEE
      </Link>

      {/* ponytail: город захардкожен, выбор города — когда появится второй город */}
      <span className="flex items-center gap-1 font-semibold">
        <MapPin className="size-5 text-primary" aria-hidden />
        Bishkek
        <ChevronDown className="size-4" aria-hidden />
      </span>

      <Link href="/notifications" aria-label="Уведомления" className="text-muted-foreground">
        <Bell className="size-6" />
      </Link>
    </header>
  );
}
