import Link from "next/link";
import MobileNav from "@/components/mobile-nav";
import { SheetClose } from "@/components/ui/sheet";

const navItems = [
  { label: "기술", href: "/#skills" },
  { label: "프로젝트", href: "/#case-studies" },
  { label: "경력", href: "/#experience" },
  { label: "연락", href: "/#contact" },
];

const NavLink = ({
  item,
  onClick,
}: {
  item: { label: string; href: string };
  onClick?: () => void;
}) => (
  <Link
    href={item.href}
    onClick={onClick}
    className="px-3 py-2 text-base font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
  >
    {item.label}
  </Link>
);

const DesktopNav = () => (
  <div className="hidden md:col-start-1 md:flex md:gap-2 md:-ml-3">
    {navItems.map((item) => (
      <NavLink key={item.label} item={item} />
    ))}
  </div>
);

const Navbar = () => {
  return (
    <nav
      aria-label="주 메뉴"
      className="sticky top-0 z-50 h-[var(--navbar-height)] bg-background"
    >
      <div className="mx-auto grid h-full max-w-5xl grid-cols-[1fr_auto_1fr] items-center px-6">
        <DesktopNav />
        <MobileNav>
          {navItems.map((item) => (
            <SheetClose key={item.label} asChild>
              <NavLink item={item} />
            </SheetClose>
          ))}
        </MobileNav>
      </div>
    </nav>
  );
};

export default Navbar;
