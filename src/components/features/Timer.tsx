import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, TimerIcon, Plus, Minus } from 'lucide-react';

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(300000); // 5 minutes default in ms
  const [initialTime, setInitialTime] = useState(300000);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1000) {
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);
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
  }, [isRunning, timeLeft]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    if (isFinished) {
      setIsFinished(false);
      setTimeLeft(initialTime);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(initialTime);
  };

  const adjustTime = (delta: number) => {
    if (!isRunning) {
      const newTime = Math.max(60000, initialTime + delta); // Min 1 minute
      setInitialTime(newTime);
      setTimeLeft(newTime);
    }
  };

  const getProgress = () => {
    return ((initialTime - timeLeft) / initialTime) * 100;
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-white">
      <div className="text-center animate-fade-in">
        {/* Title */}
        <div className="mb-6">
          <TimerIcon className="w-12 h-12 mx-auto mb-2 text-white/60" />
          <h1 className="text-2xl font-semibold mb-1">Timer</h1>
          <p className="text-white/70">Portrait Mode - Upside Down</p>
        </div>

        {/* Timer Display */}
        <div className="mb-8">
          <div className={`time-display text-6xl md:text-7xl font-light mb-4 ${isFinished ? 'animate-pulse text-red-400' : 'animate-pulse-glow'}`}>
            {formatTime(timeLeft)}
          </div>
          
          {/* Progress Ring */}
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
                className="transition-all duration-1000 text-white"
              />
            </svg>
          </div>
        </div>

        {/* Time Adjustment (when not running) */}
        {!isRunning && !isFinished && (
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              onClick={() => adjustTime(-60000)}
              className="touch-button w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 border-white/30"
              variant="outline"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-sm text-white/70 min-w-[80px]">
              {Math.floor(initialTime / 60000)} min
            </span>
            <Button
              onClick={() => adjustTime(60000)}
              className="touch-button w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 border-white/30"
              variant="outline"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleStartPause}
            className={`touch-button w-16 h-16 rounded-full border-white/30 ${
              isFinished 
                ? 'bg-green-500/20 hover:bg-green-500/30' 
                : 'bg-white/20 hover:bg-white/30'
            }`}
            variant="outline"
          >
            {isFinished ? <RotateCcw className="w-6 h-6" /> : 
             isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </Button>
          
          <Button
            onClick={handleReset}
            className="touch-button w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 border-white/30"
            variant="outline"
          >
            <RotateCcw className="w-6 h-6" />
          </Button>
        </div>

        {/* Status Message */}
        {isFinished && (
          <div className="mt-6 glass rounded-2xl p-4 animate-pulse backdrop-blur-md bg-black/40 border border-yellow-400/30 shadow-lg transition-all duration-300 hover:bg-gradient-to-br hover:from-yellow-400/60 hover:via-pink-400/40 hover:to-black/60">
            <p className="text-xl font-semibold text-red-400">Time's Up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;