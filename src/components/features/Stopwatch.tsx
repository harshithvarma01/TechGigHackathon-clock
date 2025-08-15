import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

const Stopwatch = () => {
  const [time, setTime] = useState(0); // in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps(prev => [time, ...prev]);
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-md text-center animate-fade-in">
        {/* Title */}
        <div className="mb-6">
          <Timer className="w-12 h-12 mx-auto mb-2 text-white/60" />
          <h1 className="text-xl font-semibold mb-1">Stopwatch</h1>
          <p className="text-white/70 text-sm">Landscape Mode - Right Side Up</p>
        </div>

        {/* Time Display */}
        <div className="mb-8">
          <div className="time-display text-5xl md:text-6xl font-light mb-4 animate-pulse-glow">
            {formatTime(time)}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <Button
            onClick={handleStartPause}
            className="touch-button w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 border-white/30"
            variant="outline"
          >
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </Button>
          
          <Button
            onClick={handleReset}
            className="touch-button w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 border-white/30"
            variant="outline"
          >
            <RotateCcw className="w-6 h-6" />
          </Button>
          
          {isRunning && (
            <Button
              onClick={handleLap}
              className="touch-button w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 border-white/30"
              variant="outline"
            >
              LAP
            </Button>
          )}
        </div>

        {/* Lap Times */}
        {laps.length > 0 && (
          <div className="glass rounded-2xl p-4 max-h-32 overflow-y-auto backdrop-blur-md bg-black/40 border border-yellow-400/30 shadow-lg transition-all duration-300 hover:bg-gradient-to-br hover:from-yellow-400/60 hover:via-pink-400/40 hover:to-black/60">
            <h3 className="text-sm font-medium mb-2 text-white/80">Lap Times</h3>
            {laps.map((lapTime, index) => (
              <div key={index} className="flex justify-between text-sm py-1">
                <span>Lap {laps.length - index}</span>
                <span className="time-display">{formatTime(lapTime)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stopwatch;