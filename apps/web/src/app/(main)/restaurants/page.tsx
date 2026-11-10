import { VenueList } from "@/features/venues/components/venue-list";

export default function Page() {
  return (
    <>
      <h1 className="py-4 text-xl font-semibold">Еда</h1>
      <VenueList type="RESTAURANT" />
    </>
  );
}
