import { useState, useEffect, useRef } from 'react';
import Alarm from '../assets/alarm.wav';
import { FaClock } from 'react-icons/fa';

export default function PomodoroTimer() {
  const WORK = 'Work';
  const SHORT_BREAK = 'Short Break';
  const LONG_BREAK = 'Long Break';

  const [activeTab, setActiveTab] = useState(WORK);
  const [task, setTask] = useState('');
  const [savedTask, setSavedTask] = useState('');

  const defaultDurations = {
    [WORK]: 25 * 60,
    [SHORT_BREAK]: 5 * 60,
    [LONG_BREAK]: 15 * 60,
  };

  const [durations] = useState(defaultDurations);
  const [secondsLeft, setSecondsLeft] = useState(durations[activeTab]);
  const [isRunning, setIsRunning] = useState(false);

  const timerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    setSecondsLeft(durations[activeTab]);
    setIsRunning(false);
  }, [activeTab, durations]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            audioRef.current?.play();
            setSavedTask('');
            setTask('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(durations[activeTab]);
    setSavedTask('');
    setTask('');
  };

  const saveTask = () => {
    if (task.trim()) {
      setSavedTask(task.trim());
    }
  };

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className=" w-full max-w-2xl rounded-2xl shadow-2xl p-6 md:p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-center gap-3">
          <FaClock className="text-4xl text-blue-800" />
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800">
            Pomodoro Timer
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex justify-center flex-wrap gap-3 md:gap-6">
          {[WORK, SHORT_BREAK, LONG_BREAK].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm md:text-base font-medium transition
                ${activeTab === tab
                  ? 'bg-blue-800 text-white shadow-lg'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Task Input or Display */}
        {!savedTask ? (
          <div className="space-y-3">
            <textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="What are you working on?"
              rows={2}
              className="w-full rounded-lg border border-gray-300 p-3 md:p-4 text-blue-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex flex-col md:flex-row md:justify-end md:space-x-4 space-y-2 md:space-y-0">
              <button
                onClick={saveTask}
                className="bg-blue-800 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm md:text-base font-semibold transition"
              >
                Save Task
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-300 text-blue-900 rounded-lg px-5 py-4 text-base md:text-lg shadow-inner">
            <strong className="block text-blue-800 mb-1">Current Task:</strong> 
            {savedTask}
          </div>
        )}

        {/* Timer */}
        <div className="text-6xl md:text-7xl font-mono text-center text-blue-900">
          {formatTime(secondsLeft)}
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6">
          {!isRunning ? (
            <button
              onClick={start}
              className="bg-blue-800 hover:bg-blue-700 text-white px-10 py-3 rounded-full text-lg font-semibold transition w-full md:w-auto"
            >
              Start
            </button>
          ) : (
            <button
              onClick={pause}
              className="bg-yellow-500 hover:bg-yellow-400 text-white px-10 py-3 rounded-full text-lg font-semibold transition w-full md:w-auto"
            >
              Pause
            </button>
          )}
          <button
            onClick={reset}
            className="text-sm md:text-base text-blue-500 hover:text-blue-700 underline"
          >
            Reset
          </button>
        </div>

        {/* Audio */}
        <audio ref={audioRef} src={Alarm} preload="auto" />
      </div>
    </div>
  );
}
