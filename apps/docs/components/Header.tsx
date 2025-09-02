import Link from "next/link";
import MainRepoIcon from "./MainRepoIcon";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

const Header = ({ as = "span" }: { as?: "span" | "a" }) => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-around gap-2 border-b px-4 min-[768px]:hidden text-center">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      {as === "a" ? (
        <Link href={"/"} className="text-xl font-bold inline">
          tiptap-extension-twemoji
        </Link>
      ) : (
        <span className="text-xl font-bold inline">
          tiptap-extension-twemoji
        </span>
      )}
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <MainRepoIcon className="size-5" />
    </header>
  );
};

export default Header;
