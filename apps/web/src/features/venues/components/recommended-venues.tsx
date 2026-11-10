"use client";

import { useListVenues } from "@vsee/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { VenueCard } from "./venue-card";

// API уже сортирует по рейтингу — берём верх списка.
const LIMIT = 8;

export function RecommendedVenues() {
  const { data, isPending, isError, refetch } = useListVenues();

  if (isError) {
    return (
      <p className="text-sm text-error">
        Не удалось загрузить.{" "}
        <button type="button" onClick={() => refetch()} className="underline">
          Повторить
        </button>
      </p>
    );
  }

  return (
    <ul className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
      {isPending
        ? Array.from({ length: 3 }, (_, i) => (
            <li key={i} className="shrink-0">
              <Skeleton className="h-36 w-48 rounded-xl" />
            </li>
          ))
        : data.slice(0, LIMIT).map((v) => (
            <li key={v.id} className="shrink-0 snap-start">
              <VenueCard venue={v} className="w-48" />
            </li>
          ))}
    </ul>
  );
}
