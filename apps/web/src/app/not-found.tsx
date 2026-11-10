import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-4 px-5 text-center">
      <h1 className="text-xl font-semibold">Страница не найдена</h1>
      <Button asChild>
        <Link href="/">На главную</Link>
      </Button>
    </main>
  );
}
