import Link from "next/link";
import MobileNav from "@/components/mobile-nav";
import { SheetClose } from "@/components/ui/sheet";
import { PROFILE } from "@/data/profile";

const navItems = [
  { label: "기술", href: "/#skills" },
  { label: "프로젝트", href: "/#case-studies" },
  { label: "경력", href: "/#experience" },
];

const contactItem = { label: "연락하기", href: "/#contact" };

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
    className="px-3 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
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
          {[...navItems, contactItem].map((item) => (
            <SheetClose key={item.label} asChild>
              <NavLink item={item} />
            </SheetClose>
          ))}
        </MobileNav>
        <a
          href={`mailto:${PROFILE.email}`}
          className="col-start-3 justify-self-end bg-primary px-4 py-2.5 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {contactItem.label}
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
