import MobileNav from "@/components/mobile-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { SheetClose } from "@/components/ui/sheet";

const navItems = [
  { label: "소개", href: "#about" },
  { label: "기술", href: "#skills" },
  { label: "프로젝트", href: "#projects" },
  { label: "경력", href: "#experience" },
];

const NavLink = ({
  item,
  onClick,
}: {
  item: { label: string; href: string };
  onClick?: () => void;
}) => (
  <a
    href={item.href}
    onClick={onClick}
    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-accent"
  >
    {item.label}
  </a>
);

const DesktopNav = () => (
  <div className="hidden md:flex space-x-8">
    {navItems.map((item) => (
      <NavLink key={item.label} item={item} />
    ))}
  </div>
);

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
        <DesktopNav />
        <MobileNav>
          {navItems.map((item) => (
            <SheetClose key={item.label} asChild>
              <NavLink item={item} />
            </SheetClose>
          ))}
        </MobileNav>
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
