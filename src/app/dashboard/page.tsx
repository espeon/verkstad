import { cookies } from "next/headers";
import { redirect} from "next/navigation";

export default async function BucketDisplay() {
  const jwt = cookies().get("jwt")?.value;

  if (jwt === undefined) {
    // redirect to login, with a # to the current page

    redirect("/login#");
  }
  return (
    <main className="flex min-h-screen min-w-screen flex-col items-center justify-center px-24 text-slate-900 dark:text-white text-wrap">
      <div className="max-w-screen-2xl w-full flex-1 mt-6">
        yello
      </div>
    </main>
  );
}
