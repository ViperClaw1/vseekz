import Link from "next/link";
import { Star } from "lucide-react";
import type { VenueListItem, VenueType } from "@vsee/api-client";
import { cn } from "@/lib/utils";

const basePath: Record<VenueType, string> = { RESTAURANT: "/restaurants", SALON: "/salons" };

export function VenueCard({ venue, className }: { venue: VenueListItem; className?: string }) {
  return (
    <Link
      href={`${basePath[venue.type]}/${venue.slug}`}
      className={cn("block overflow-hidden rounded-xl bg-card", className)}
    >
      {/* ponytail: обложек в данных пока нет — плейсхолдер; next/image + remotePatterns, когда появится хранилище */}
      <div className="relative flex h-24 items-center justify-center bg-gradient-to-br from-primary/30 to-secondary">
        <span className="text-3xl font-bold text-foreground/40">{venue.name[0]}</span>
        {venue.promo && (
          <span className="absolute top-2 left-2 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
            Акция
          </span>
        )}
      </div>
      <div className="px-2.5 py-2">
        <span className="block truncate text-sm font-medium">{venue.name}</span>
        <div className="mt-0.5 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="truncate">{venue.promo ?? venue.address}</span>
          <span className="flex shrink-0 items-center gap-0.5" aria-label={`Рейтинг ${venue.rating.toFixed(1)}`}>
            <Star className="size-3 fill-current" aria-hidden />
            {venue.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}
