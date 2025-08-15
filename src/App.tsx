import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AlarmClock from "@/components/features/AlarmClock";
import Stopwatch from "@/components/features/Stopwatch";
import Timer from "@/components/features/Timer";
import Weather from "@/components/features/Weather";
import { Link } from "react-router-dom";
import Particles from "@/components/ui/Particles";

const queryClient = new QueryClient();

const navLinks = [
  { name: "Alarm", path: "/alarm" },
  { name: "Stopwatch", path: "/stopwatch" },
  { name: "Timer", path: "/timer" },
  { name: "Weather", path: "/weather" },
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="fixed inset-0 -z-10 w-full h-full bg-neutral-900">
          <Particles
            particleCount={400}
            particleSpread={12}
            speed={0.15}
            particleColors={["#c0c0c0", "#b0b0b0", "#d3d3d3"]}
            moveParticlesOnHover={true}
            particleHoverFactor={2}
            alphaParticles={true}
            particleBaseSize={120}
            sizeRandomness={1.2}
            cameraDistance={22}
            className="absolute w-full h-full"
          />
        </div>
        <div className="w-full flex justify-end items-center p-4 fixed top-0 right-0 z-50">
          <nav className="flex gap-4 bg-black/30 rounded-xl px-4 py-2 shadow-lg">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="text-white/80 hover:text-white font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
  <div className="min-h-0 h-screen w-full overflow-x-hidden overflow-y-auto flex flex-col pb-4 pt-24">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/alarm" element={<AlarmClock />} />
            <Route path="/stopwatch" element={<Stopwatch />} />
            <Route path="/timer" element={<Timer />} />
            <Route path="/weather" element={<Weather />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
