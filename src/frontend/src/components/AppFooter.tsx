import { Heart, Zap } from "lucide-react";

export default function AppFooter() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="border-t border-border/40 py-8 mt-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[oklch(0.72_0.18_200)] to-[oklch(0.62_0.25_290)] flex items-center justify-center">
              <Zap
                className="w-3 h-3 text-[oklch(0.08_0.01_260)]"
                fill="currentColor"
              />
            </div>
            <span className="text-sm font-display font-semibold">
              <span className="text-gradient-cyan">UpScale</span>
              <span className="text-foreground/60"> AI</span>
            </span>
          </div>

          {/* Attribution */}
          <p className="text-xs text-muted-foreground/60 flex items-center gap-1.5">
            © {year}. Built with{" "}
            <Heart className="w-3 h-3 text-neon-cyan fill-neon-cyan inline" />{" "}
            using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-cyan/70 hover:text-neon-cyan transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>

          {/* Privacy note */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/50">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan/50 animate-pulse-neon" />
            Files never leave your device
          </div>
        </div>
      </div>
    </footer>
  );
}
