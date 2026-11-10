import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
      <AppHeader />
      <main className="flex-1 px-5 pb-28">{children}</main>
      <BottomNav />
    </div>
  );
}
