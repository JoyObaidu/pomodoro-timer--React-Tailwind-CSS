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

  // When tab changes: reset time only (keep saved task)
  useEffect(() => {
    setSecondsLeft(durations[activeTab]);
    setIsRunning(false);
  }, [activeTab, durations]);

  // Timer countdown
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            audioRef.current?.play();
            setSavedTask('');  // Clear task at end
            setTask('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  // Handlers
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-center gap-3">
          <FaClock className="text-3xl text-blue-800" />
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">
            Pomodoro Timer
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 sm:gap-4">
          {[WORK, SHORT_BREAK, LONG_BREAK].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition
                ${activeTab === tab
                  ? 'bg-blue-800 text-white shadow'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Task Input or Display */}
        {!savedTask ? (
          <div className="space-y-2">
            <textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="What are you working on?"
              rows={2}
              className="w-full rounded-lg border border-gray-300 p-3 text-blue-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <button
              onClick={saveTask}
              className="bg-blue-800 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-semibold"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="bg-blue-100 border border-blue-300 text-blue-800 rounded-md px-4 py-3 text-sm">
            <strong>Current Task:</strong> {savedTask}
          </div>
        )}

        {/* Timer */}
        <div className="text-6xl sm:text-7xl font-mono text-center text-blue-900">
          {formatTime(secondsLeft)}
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-3">
          {!isRunning ? (
            <button
              onClick={start}
              className="bg-blue-800 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition"
            >
              Start
            </button>
          ) : (
            <button
              onClick={pause}
              className="bg-yellow-500 hover:bg-yellow-400 text-white px-8 py-3 rounded-full text-lg font-semibold transition"
            >
              Pause
            </button>
          )}
          <button
            onClick={reset}
            className="text-sm text-blue-500 hover:text-blue-700 underline"
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
