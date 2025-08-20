import { Github, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t mt-20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-center space-x-6">
          <a
            href="https://github.com/reasonjun"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-4 w-4 mr-2" />
            GitHub
          </a>
          <a
            href="mailto:xmaseve96@naver.com"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="h-4 w-4 mr-2" />
            이메일
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
