import { Toaster } from "@/components/ui/sonner";
import AppFooter from "./components/AppFooter";
import AppHeader from "./components/AppHeader";
import HeroSection from "./components/HeroSection";
import HistorySection from "./components/HistorySection";
import UpscalerTool from "./components/UpscalerTool";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1">
        <HeroSection />
        <UpscalerTool />
        <HistorySection />
      </main>
      <AppFooter />
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.15 0.015 265)",
            border: "1px solid oklch(0.72 0.18 200 / 0.3)",
            color: "oklch(0.94 0.01 260)",
          },
        }}
      />
    </div>
  );
}
