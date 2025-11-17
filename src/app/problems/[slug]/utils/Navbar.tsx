"use client";

import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { RootState } from "@/app/store/store";
import { useState, useEffect, useRef } from "react";
import { useRunCode } from "@/app/problems/[slug]/utils/useRunCode";
import { axiosClient } from "@/app/utils/axiosClient";
import { ThemeToggle } from "@/app/components/themeToggle";
import ProblemListSidebar from "./ProblemListSidebar";
import type { 
  Problem, 
  TestCase, 
  SubmissionResponse,
  CodeEditorData,
  TestResultsDetail,
  WindowWithCustomProperties,
  TimerProps,
  RunCodeResult,
  ApiError
} from "./types";





export default function Navbar({ onTimerUpdate, onTimerReset }: TimerProps = {}) {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { problem } = useSelector((state: RootState) => state.problem);
  const router = useRouter();
  const { slug } = useParams();

  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  // Timer states
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Combined loading state - prevents both run and submit simultaneously
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResponse | null>(null);


  // Problem navigation states
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(-1);
  const [showProblemList, setShowProblemList] = useState(false);

  // Run code hook
  const { runCode, testResults, runSummary, clearResults } = useRunCode();

  // Combined loading state - true if either running or submitting
  const isLoading = isRunning || isSubmitting;

  // Fetch problems list on mount for navigation buttons
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axiosClient.get('/api/user/problem/all?page=1&limit=100&sortBy=title&order=asc');
        if (response.data.success) {
          setProblems(response.data.problems);
          
          // Find current problem index
          if (slug && typeof slug === 'string') {
            const index = response.data.problems.findIndex((p: Problem) => p.slug === slug);
            setCurrentProblemIndex(index);
          }
        }
      } catch (error) {
        console.error('Failed to fetch problems:', error);
      }
    };

    if (isAuthenticated) {
      fetchProblems();
    }
  }, [isAuthenticated, slug]);

  // Navigation functions
  const navigateToProblem = (problemSlug: string) => {
    router.push(`/problems/${problemSlug}/description`);
  };

  const navigateToPrevious = () => {
    if (currentProblemIndex > 0) {
      const prevProblem = problems[currentProblemIndex - 1];
      navigateToProblem(prevProblem.slug);
    }
  };

  const navigateToNext = () => {
    if (currentProblemIndex < problems.length - 1) {
      const nextProblem = problems[currentProblemIndex + 1];
      navigateToProblem(nextProblem.slug);
    }
  };

  // Sidebar handlers
  const toggleProblemList = () => {
    setShowProblemList(!showProblemList);
  };

  const closeProblemList = () => {
    setShowProblemList(false);
  };

  const handleProblemSelect = (problemSlug: string) => {
    navigateToProblem(problemSlug);
    closeProblemList();
  };

  // Theme effects
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  // Timer effects
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          const newTime = prev + 1;
          onTimerUpdate?.(newTime);
          return newTime;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerRunning, onTimerUpdate]);

  useEffect(() => {
    if (testResults.length > 0) {
      window.testResults = testResults;
      window.runSummary = runSummary;
      
      const event = new CustomEvent('testResultsUpdated', { 
        detail: { testResults, runSummary } as TestResultsDetail
      });
      window.dispatchEvent(event);
    }
  }, [testResults, runSummary]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const handleProfileClick = () => {
    if (user?.username) {
      router.push(`/${user.username}`);
    }
  };

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
    onTimerReset?.();
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTestCasesFromTestSection = (): Array<{input: string; expectedOutput: string}> => {
    const testCasesData = window.testCasesData;
    if (!testCasesData || !Array.isArray(testCasesData)) {
      return [];
    }

    return testCasesData
      .filter((testCase: TestCase) => testCase.isCustom)
      .map((testCase: TestCase) => ({
        input: testCase.input || '',
        expectedOutput: testCase.expectedOutput || ''
      }));
  };

  const handleRunCode = async () => {
    // Prevent running if already running or submitting
    if (isLoading) return;

    try {
      clearResults();
      setIsRunning(true);

      const codeData = window.codeEditorData;
      if (!codeData || !codeData.code || !codeData.language) {
        alert('Please write some code before running!');
        return;
      }

      const customTestCases = getTestCasesFromTestSection();

      const switchToResultsEvent = new CustomEvent('switchToResults');
      window.dispatchEvent(switchToResultsEvent);

      try {
        const result: RunCodeResult = await runCode(customTestCases);
        
        if (result.success) {
          console.log('Code executed successfully');
          console.log(`Results: ${result.summary.passedTests}/${result.summary.totalTests} test cases passed`);
        }
      } catch (runError) {
        const error = runError as ApiError;
        console.error('Run code error:', error);
        
        if (error.response?.data) {
          const errorData = error.response.data;
          
          if (errorData.error === "Compilation Error" || errorData.compilationError) {
            const errorEvent = new CustomEvent('testResultsUpdated', {
              detail: {
                error: {
                  success: false,
                  error: "Compilation Error",
                  compilationError: errorData.compilationError || "Code compilation failed"
                }
              } as TestResultsDetail
            });
            window.dispatchEvent(errorEvent);
            return;
          } else {
            const errorEvent = new CustomEvent('testResultsUpdated', {
              detail: {
                error: {
                  success: false,
                  error: errorData.message || errorData.error || "Execution failed",
                  message: errorData.message || errorData.error || "An error occurred during execution"
                }
              } as TestResultsDetail
            });
            window.dispatchEvent(errorEvent);
            return;
          }
        }
        
        const errorEvent = new CustomEvent('testResultsUpdated', {
          detail: {
            error: {
              success: false,
              error: "Network Error",
              message: error.message || "Failed to connect to server. Please try again."
            }
          } as TestResultsDetail
        });
        window.dispatchEvent(errorEvent);
      }

    } catch (error) {
      const err = error as Error;
      console.error('Error in handleRunCode:', err);
      
      const errorEvent = new CustomEvent('testResultsUpdated', {
        detail: {
          error: {
            success: false,
            error: "Unexpected Error",
            message: "An unexpected error occurred. Please try again."
          }
        } as TestResultsDetail
      });
      window.dispatchEvent(errorEvent);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    // Prevent submitting if already running or submitting
    if (isLoading) return;

    if (!problem?._id) {
      alert('Problem not loaded!');
      return;
    }

    const codeData = window.codeEditorData;
    if (!codeData || !codeData.code || !codeData.language) {
      alert('Please write some code before submitting!');
      return;
    }

    stopTimer();
    setIsSubmitting(true);

    try {
      const submitPayload = {
        code: codeData.code,
        language: codeData.language,
        notes: {
          timeTaken: timerSeconds,
          text: ''
        }
      };

      const response = await axiosClient.post(`/api/submit/${problem._id}`, submitPayload);

      if (response.data.success) {
        const submissionData: SubmissionResponse = response.data;

        setSubmissionResult(submissionData);
        
        const status = submissionData.submission?.status || 'error';
        let tabName = 'Wrong Answer';
        
        if (status === 'accepted') {
          tabName = 'Accepted';
        } else if (submissionData.results?.errorMessage || 
                   submissionData.error === 'Compilation Error') {
          tabName = 'Compilation Error';
        }

        window.submissionResult = submissionData;
        window.submissionTabName = tabName;
        
        const tabEvent = new CustomEvent('createSubmissionTab', {
          detail: { 
            tabName, 
            submissionData
          }
        });
        window.dispatchEvent(tabEvent);

        console.log('Submission successful:', submissionData);
      }

    } catch (error) {
      const err = error as ApiError;
      console.error('Submit error:', err);
      
      let errorMessage = 'Submission failed. Please try again.';
      let tabName = 'Submission Error';
      
      if (err.response?.data) {
        const errorData = err.response.data;
        if (errorData.error === 'Compilation Error') {
          tabName = 'Compilation Error';
          errorMessage = errorData.compilationError || 'Code compilation failed';
        } else {
          errorMessage = errorData.message || errorData.error || errorMessage;
        }
      }

      const errorResult: SubmissionResponse = {
        success: false,
        error: tabName,
        message: errorMessage,
        submission: undefined,
        results: undefined
      };

      setSubmissionResult(errorResult);
      
      window.submissionResult = errorResult;
      window.submissionTabName = tabName;
      
      const errorTabEvent = new CustomEvent('createSubmissionTab', {
        detail: { 
          tabName, 
          submissionData: errorResult
        }
      });
      window.dispatchEvent(errorTabEvent);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    window.timerFunctions = {
      reset: resetTimer,
      getTime: () => timerSeconds,
      isRunning: isTimerRunning
    };
  }, [timerSeconds, isTimerRunning]);

  return (
    <>
      <nav 
        className="w-full shadow-sm border-b px-6 py-3 flex items-center justify-between"
        style={{ 
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border-primary)'
        }}
      >
        {/* Left: Brand + Problem List Button */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2 interactive">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent-500)' }}
            >
              <span 
                className="font-bold text-sm"
                style={{ color: 'var(--text-inverse)' }}
              >
                TC
              </span>
            </div>
            <span 
              className="text-xl font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              TrueCode
            </span>
          </Link>

          {/* Problem List Toggle + Navigation */}
          {problem && (
            <div className="flex items-center space-x-2">
              {/* Problem List Toggle Button */}
              <button
                onClick={toggleProblemList}
                className="problem-list-toggle flex items-center space-x-2 px-3 py-2 rounded-md transition-colors hover:bg-secondary"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <svg 
                  className="w-4 h-4" 
                  style={{ color: 'var(--text-secondary)' }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span 
                  className="text-sm font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Problem List
                </span>
              </button>

              {/* Previous/Next Navigation */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={navigateToPrevious}
                  disabled={currentProblemIndex <= 0}
                  className={`p-2 rounded-md transition-colors ${
                    currentProblemIndex <= 0 
                      ? 'cursor-not-allowed opacity-30'
                      : 'hover:bg-secondary'
                  }`}
                  style={{ 
                    color: currentProblemIndex <= 0 ? 'var(--text-muted)' : 'var(--text-secondary)'
                  }}
                  title="Previous Problem"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={navigateToNext}
                  disabled={currentProblemIndex >= problems.length - 1}
                  className={`p-2 rounded-md transition-colors ${
                    currentProblemIndex >= problems.length - 1
                      ? 'cursor-not-allowed opacity-30'
                      : 'hover:bg-secondary'
                  }`}
                  style={{ 
                    color: currentProblemIndex >= problems.length - 1 ? 'var(--text-muted)' : 'var(--text-secondary)'
                  }}
                  title="Next Problem"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Center: Actions */}
        <div className="flex space-x-3">
          <button 
            onClick={handleRunCode}
            disabled={isLoading}
            className={`btn-secondary text-sm font-medium flex items-center space-x-2 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'interactive'
            }`}
          >
            {isRunning && (
              <div 
                className="animate-spin rounded-full h-4 w-4 border-b-2"
                style={{ borderColor: 'var(--text-primary)' }}
              ></div>
            )}
            <span>{isRunning ? 'Running...' : 'Run'}</span>
          </button>
          
          <button 
            onClick={handleSubmitCode}
            disabled={isLoading}
            className={`text-sm font-medium flex items-center space-x-2 ${
              isLoading 
                ? 'btn-secondary opacity-50 cursor-not-allowed'
                : 'btn-primary interactive'
            }`}
          >
            {isSubmitting && (
              <div 
                className="animate-spin rounded-full h-4 w-4 border-b-2"
                style={{ borderColor: 'var(--text-inverse)' }}
              ></div>
            )}
            <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
          </button>
        </div>

        {/* Right: Timer + Theme + Profile */}
        <div className="flex items-center space-x-4">
          {/* Timer Section */}
          <div 
            className="flex items-center space-x-2 px-3 py-2 rounded-lg border"
            style={{ 
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}
          >
            <div className="flex items-center space-x-2">
              <svg 
                className={`w-4 h-4 ${isTimerRunning ? 'animate-pulse' : ''}`}
                style={{ 
                  color: isTimerRunning ? 'var(--success-500)' : 'var(--text-muted)'
                }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <span 
                className="text-sm font-mono"
                style={{ 
                  color: isTimerRunning ? 'var(--success-500)' : 'var(--text-secondary)'
                }}
              >
                {formatTime(timerSeconds)}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              {!isTimerRunning ? (
                <button
                  onClick={startTimer}
                  className="p-1 rounded transition-colors hover:bg-success-light"
                  style={{ color: 'var(--success-500)' }}
                  title="Start Timer"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              ) : (
                <button
                  onClick={stopTimer}
                  className="p-1 rounded transition-colors hover:bg-error-light"
                  style={{ color: 'var(--error-500)' }}
                  title="Stop Timer"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h4v12H6zm8 0h4v12h-4z"/>
                  </svg>
                </button>
              )}
              
              {timerSeconds > 0 && (
                <button
                  onClick={resetTimer}
                  className="p-1 rounded transition-colors hover:bg-secondary"
                  style={{ color: 'var(--text-secondary)' }}
                  title="Reset Timer"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <ThemeToggle />

          {/* Profile */}
          {user?.profilePicture ? (
            <div
              onClick={handleProfileClick}
              className="relative w-8 h-8 rounded-full overflow-hidden cursor-pointer interactive"
            >
              <Image
                src={user.profilePicture}
                alt="Profile"
                fill
                style={{ objectFit: "cover" }}
              />
              {user.subscriptionType === "premium" && (
                <span className="absolute -top-1 -right-1 text-yellow-400 text-xs">
                  👑
                </span>
              )}
            </div>
          ) : user?.firstName && user?.lastName ? (
            <div
              onClick={handleProfileClick}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold relative cursor-pointer interactive ${
                user.subscriptionType === "premium"
                  ? "bg-brand border-2 animate-pulse"
                  : ""
              }`}
              style={{ 
                backgroundColor: user.subscriptionType === "premium" ? 'var(--accent-500)' : 'var(--text-secondary)',
                borderColor: user.subscriptionType === "premium" ? 'var(--accent-400)' : 'transparent',
                color: 'var(--text-inverse)'
              }}
            >
              {`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
              {user.subscriptionType === "premium" && (
                <span className="absolute -top-1 -right-1 text-yellow-400 text-xs">
                  👑
                </span>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="btn-secondary text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Problem List Sidebar Component */}
      <ProblemListSidebar
        isOpen={showProblemList}
        onClose={closeProblemList}
        onProblemSelect={handleProblemSelect}
      />
    </>
  );
}
