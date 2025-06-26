import Link from "next/link";
import { HireFlowLogo } from "@/components/icons";
import { cn } from "@/lib/utils";

export function MainNav() {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <HireFlowLogo className="h-6 w-6" />
        <span className="inline-block font-bold font-headline">HireFlow</span>
      </Link>
    </div>
  );
}
