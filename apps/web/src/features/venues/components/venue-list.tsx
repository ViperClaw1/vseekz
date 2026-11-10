"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { useListVenues, type VenueType } from "@vsee/api-client";
import { Skeleton } from "@/components/ui/skeleton";

const basePath: Record<VenueType, string> = { RESTAURANT: "/restaurants", SALON: "/salons" };

export function VenueList({ type }: { type: VenueType }) {
  const { data, isPending, isError } = useListVenues({ type });

  if (isPending) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    );
  }
  if (isError) return <p className="text-error">Не удалось загрузить список</p>;
  if (data.length === 0) return <p className="text-muted-foreground">Здесь пока ничего нет</p>;

  return (
    <ul className="flex flex-col gap-3">
      {data.map((v) => (
        <li key={v.id}>
          <Link href={`${basePath[v.type]}/${v.slug}`} className="block rounded-2xl bg-card p-4 shadow-card">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold">{v.name}</span>
              <span className="flex items-center gap-1 text-sm">
                <Star className="size-4 fill-primary text-primary" aria-hidden />
                {v.rating.toFixed(1)}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{v.address}</p>
            {v.promo && <p className="mt-2 text-sm text-primary">{v.promo}</p>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
