"use client";
export default function Error({ error }: { error: Error }) {
  return (
    <main className="flex flex-col justify-center items-center min-h-fit">
      <div className="flex flex-col items-center justify-center space-y-6 mt-[12vh]">
        <h1 className="text-6xl font-bold">{error.message.includes("not found") ? "404" : "500"}</h1>
        <p className="text-lg">
          {error.message}
        </p>
        <p className="text-xs font-mono w-3/4 mt-2">
            {error.stack?.toString()}
        </p>
      </div>
    </main>
  );
}
