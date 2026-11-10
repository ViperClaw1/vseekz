"use client";

import { useListVenues, type VenueType } from "@vsee/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { VenueCard } from "./venue-card";

export function VenueList({ type }: { type: VenueType }) {
  const { data, isPending, isError } = useListVenues({ type });

  if (isPending) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-48 rounded-2xl" />
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
          <VenueCard venue={v} />
        </li>
      ))}
    </ul>
  );
}
