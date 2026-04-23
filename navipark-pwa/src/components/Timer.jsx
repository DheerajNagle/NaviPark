import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Clock } from 'lucide-react';

const Timer = () => {
  const { secondsElapsed, carLocation } = useContext(AppContext);

  if (!carLocation) return null;

  const h = Math.floor(secondsElapsed / 3600).toString().padStart(2, '0');
  const m = Math.floor((secondsElapsed % 3600) / 60).toString().padStart(2, '0');
  const s = (secondsElapsed % 60).toString().padStart(2, '0');

  return (
    <div className="card bg-gradient-to-br from-sky-500/10 to-transparent dark:from-sky-400/10 border-sky-500/20 dark:border-sky-400/20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-sky-500/20 dark:bg-sky-400/20 rounded-xl text-sky-500 dark:text-sky-400">
          <Clock size={24} />
        </div>
        <div>
          <h3 className="font-semibold">Duration</h3>
          <p className="text-xs text-slate-500">Since parked</p>
        </div>
      </div>
      <div className="text-3xl font-bold font-mono tracking-wider text-sky-500 dark:text-sky-400">
        {h}:{m}:{s}
      </div>
    </div>
  );
};

export default Timer;
