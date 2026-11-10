"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-4 px-5 text-center">
      <h1 className="text-xl font-semibold">Что-то пошло не так</h1>
      <Button onClick={reset}>Повторить</Button>
    </main>
  );
}
