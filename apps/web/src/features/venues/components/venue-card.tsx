import Link from "next/link";
import { Star } from "lucide-react";
import type { VenueListItem, VenueType } from "@vsee/api-client";
import { cn } from "@/lib/utils";

const basePath: Record<VenueType, string> = { RESTAURANT: "/restaurants", SALON: "/salons" };

export function VenueCard({ venue, className }: { venue: VenueListItem; className?: string }) {
  return (
    <Link
      href={`${basePath[venue.type]}/${venue.slug}`}
      className={cn("block overflow-hidden rounded-2xl bg-card shadow-card", className)}
    >
      {/* ponytail: обложек в данных пока нет — плейсхолдер; next/image + remotePatterns, когда появится хранилище */}
      <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-primary/30 to-secondary">
        <span className="text-4xl font-bold text-foreground/40">{venue.name[0]}</span>
        {venue.promo && (
          <span className="absolute top-2 left-2 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
            Акция
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-semibold">{venue.name}</span>
          <span className="flex shrink-0 items-center gap-1 text-sm">
            <Star className="size-4 fill-primary text-primary" aria-hidden />
            {venue.rating.toFixed(1)}
          </span>
        </div>
        <p className="mt-1 truncate text-sm text-muted-foreground">{venue.address}</p>
        {venue.promo && <p className="mt-1 truncate text-sm text-primary">{venue.promo}</p>}
      </div>
    </Link>
  );
}
