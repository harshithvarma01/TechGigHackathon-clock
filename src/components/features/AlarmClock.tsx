import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Plus, Minus } from 'lucide-react';

const AlarmClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarmTime, setAlarmTime] = useState<string>("");
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [alarmTriggered, setAlarmTriggered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isAlarmSet || !alarmTime) return;
    const checkAlarm = setInterval(() => {
      const now = new Date();
      const [alarmHour, alarmMinute] = alarmTime.split(":");
      if (
        now.getHours() === parseInt(alarmHour) &&
        now.getMinutes() === parseInt(alarmMinute) &&
        now.getSeconds() === 0
      ) {
        setAlarmTriggered(true);
        setIsAlarmSet(false);
        // Play sound
        const audio = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
        audio.play();
        // Notification
        if (window.Notification && Notification.permission === "granted") {
          new Notification("Alarm!", { body: `It's ${alarmTime}` });
        }
      }
    }, 1000);
    return () => clearInterval(checkAlarm);
  }, [isAlarmSet, alarmTime]);

  useEffect(() => {
    if (window.Notification && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-white">
      <div className="text-center animate-fade-in">
        {/* Current Time Display */}
        <div className="mb-8">
          <div className="time-display text-6xl md:text-8xl font-light mb-2 animate-pulse-glow">
            {formatTime(currentTime)}
          </div>
          <div className="text-lg text-white/70">
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Alarm Clock Icon */}
        <div className="mb-8">
          <Clock className="w-16 h-16 mx-auto text-white/60 animate-rotate-smooth" />
        </div>

        {/* App Title */}
        <div className="mb-4">
          <h1 className="text-2xl font-semibold mb-2">Alarm Clock</h1>
          <p className="text-white/70">Portrait Mode - Upright</p>
        </div>

        {/* Alarm Input & Controls */}
        <div className="mb-4 flex flex-col items-center gap-2">
          <input
            type="time"
            className="bg-black/30 text-white rounded px-3 py-2 outline-none border border-white/20"
            value={alarmTime}
            onChange={e => {
              setAlarmTime(e.target.value);
              setAlarmTriggered(false);
            }}
            disabled={isAlarmSet}
          />
          <div className="flex gap-2">
            <Button
              onClick={() => {
                if (alarmTime) {
                  setIsAlarmSet(true);
                  setAlarmTriggered(false);
                }
              }}
              disabled={isAlarmSet || !alarmTime}
              variant="default"
            >
              <Plus className="mr-2 h-4 w-4" /> Set Alarm
            </Button>
            <Button
              onClick={() => {
                setIsAlarmSet(false);
                setAlarmTriggered(false);
              }}
              disabled={!isAlarmSet}
              variant="destructive"
            >
              <Minus className="mr-2 h-4 w-4" /> Cancel
            </Button>
          </div>
        </div>

        {/* Quick Status */}
  <div className="glass rounded-2xl p-4 backdrop-blur-md bg-black/40 border border-yellow-400/30 shadow-lg transition-all duration-300 hover:bg-gradient-to-br hover:from-yellow-400/60 hover:via-pink-400/40 hover:to-black/60">
          {isAlarmSet ? (
            <div className="text-center">
              <p className="text-sm text-white/80">Alarm set for</p>
              <p className="text-xl font-medium">{alarmTime}</p>
            </div>
          ) : alarmTriggered ? (
            <div className="text-center">
              <p className="text-xl font-bold text-red-400">⏰ Alarm ringing!</p>
              <p className="text-white/80">It's {alarmTime}</p>
            </div>
          ) : (
            <p className="text-white/80">No alarm set</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlarmClock;