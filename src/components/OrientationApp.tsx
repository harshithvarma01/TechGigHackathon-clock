import { useState, useEffect } from 'react';
import AlarmClock from './features/AlarmClock';
import Stopwatch from './features/Stopwatch';
import Timer from './features/Timer';
import Weather from './features/Weather';

type OrientationType = 'portrait-primary' | 'landscape-primary' | 'portrait-secondary' | 'landscape-secondary';

const OrientationApp = () => {
  const [orientation, setOrientation] = useState<OrientationType>('portrait-primary');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsTransitioning(true);
      
      // Use Screen Orientation API if available
      if (screen.orientation) {
        setOrientation(screen.orientation.type as OrientationType);
      } else {
        // Fallback: detect based on window dimensions
        const { innerWidth, innerHeight } = window;
        const isLandscape = innerWidth > innerHeight;
        
        if (isLandscape) {
          setOrientation('landscape-primary'); // Stopwatch
        } else {
          setOrientation('portrait-primary'); // Alarm Clock
        }
      }
      
      // Add transition delay
      setTimeout(() => setIsTransitioning(false), 300);
    };

    // Handle device orientation for upside-down detection
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma !== null && event.beta !== null) {
        const { innerWidth, innerHeight } = window;
        const isLandscape = innerWidth > innerHeight;
        
        if (isLandscape) {
          // In landscape: gamma determines left vs right
          // Positive gamma = right side up, negative = left side up
          if (event.gamma > 45) {
            setOrientation('landscape-secondary'); // Weather (left side up)
          } else {
            setOrientation('landscape-primary'); // Stopwatch (right side up)
          }
        } else {
          // In portrait: beta determines upright vs upside down
          // Normal range around 0-90, upside down around 180 or negative values
          if (Math.abs(event.beta) > 135 || event.beta < -90) {
            setOrientation('portrait-secondary'); // Timer (upside down)
          } else {
            setOrientation('portrait-primary'); // Alarm Clock (upright)
          }
        }
        
        setIsTransitioning(true);
        setTimeout(() => setIsTransitioning(false), 300);
      }
    };

    // Request permission for device orientation on mobile devices
    const requestOrientationPermission = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && 'requestPermission' in DeviceOrientationEvent) {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation);
          }
        } catch (error) {
          console.warn('Device orientation permission denied');
        }
      } else {
        // For non-iOS devices, just add the listener
        window.addEventListener('deviceorientation', handleDeviceOrientation);
      }
    };

    // Listen for orientation changes
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    
    // Initial orientation detection
    handleOrientationChange();
    
    // Request device orientation permission
    requestOrientationPermission();

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, []);

  const renderCurrentView = () => {
    switch (orientation) {
      case 'portrait-primary':
        return <AlarmClock />;
      case 'landscape-primary':
        return <Stopwatch />;
      case 'portrait-secondary':
        return <Timer />;
      case 'landscape-secondary':
        return <Weather />;
      default:
        return <AlarmClock />;
    }
  };

  const getBackgroundClass = () => {
    switch (orientation) {
      case 'portrait-primary':
        return 'bg-gradient-alarm';
      case 'landscape-primary':
        return 'bg-gradient-stopwatch';
      case 'portrait-secondary':
        return 'bg-gradient-timer';
      case 'landscape-secondary':
        return 'bg-gradient-weather';
      default:
        return 'bg-gradient-alarm';
    }
  };

  return (
    <div className={`min-h-screen w-full transition-all duration-500 ${getBackgroundClass()}`}>
      <div className={`h-screen w-full ${isTransitioning ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
        {renderCurrentView()}
      </div>
      
      {/* Orientation Indicator */}
      <div className="fixed top-4 left-4 glass rounded-full px-3 py-1 text-xs text-white/80 z-50">
        {orientation.replace('-', ' ')}
      </div>
      
      {/* Demo Controls for Testing (only visible on desktop) */}
      <div className="fixed bottom-4 right-4 hidden lg:flex flex-col gap-2 z-50">
        <button
          onClick={() => setOrientation('portrait-primary')}
          className="glass rounded px-2 py-1 text-xs text-white/80 hover:bg-white/20"
        >
          Alarm
        </button>
        <button
          onClick={() => setOrientation('landscape-primary')}
          className="glass rounded px-2 py-1 text-xs text-white/80 hover:bg-white/20"
        >
          Stopwatch
        </button>
        <button
          onClick={() => setOrientation('portrait-secondary')}
          className="glass rounded px-2 py-1 text-xs text-white/80 hover:bg-white/20"
        >
          Timer
        </button>
        <button
          onClick={() => setOrientation('landscape-secondary')}
          className="glass rounded px-2 py-1 text-xs text-white/80 hover:bg-white/20"
        >
          Weather
        </button>
      </div>
    </div>
  );
};

export default OrientationApp;