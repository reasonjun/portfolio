import { ModeToggle } from "@/components/mode-toggle";

const navItems = [
  { label: "소개", href: "#about" },
  { label: "기술", href: "#skills" },
  { label: "프로젝트", href: "#projects" },
  { label: "경력", href: "#experience" },
];

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-accent"
            >
              {item.label}
            </a>
          ))}
        </div>
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
