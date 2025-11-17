'use client'

import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getProblem } from "@/app/slices/problemSlice";
import { Monaco } from "@monaco-editor/react";
import { 
  Panel, 
  PanelGroup, 
  PanelResizeHandle 
} from "react-resizable-panels";
import Navbar from "./utils/Navbar";
import ProblemSection from "./utils/ProblemSection";
import CodeEditorSection from "./utils/CodeEditorSection";
import TestCasesSection from "./utils/TestCasesSection";
import ProblemFooter from "./utils/Footer";
import PremiumModal from "@/app/components/PremiumModal";
import { RootState, AppDispatch } from "@/app/store/store";
import { SubmissionResponse, TestCaseDetail , CodeEditorData, TestCase} from "./utils/types";
import { RazorpayOptions, RazorpayInstance } from "@/app/premium/PayButton";

// declare global {
//   interface Window {
//     submissionResult?: SubmissionResponse;
//     submissionTabName?: string;
//   }
// }

declare global {
  interface Window {
    testCasesData?: TestCase[];
    codeEditorData?: CodeEditorData;
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    testResults?: unknown[];
    runSummary?: {
      passedTests: number;
      totalTests: number;
    } | null;
    submissionResult?: SubmissionResponse;
    submissionTabName?: string;
    timerFunctions?: {
      reset: () => void;
      getTime: () => number;
      isRunning: boolean;
    };
    monaco: Monaco;
  }
}

export default function ProblemLayout({ children }: { children: React.ReactNode }) {
  const { slug } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  // State to handle submission overlay
  const [showSubmissionOverlay, setShowSubmissionOverlay] = useState(false);
  // State to handle premium modal
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumProblemTitle, setPremiumProblemTitle] = useState("");

  // Fixed: Use 'problem' instead of 'currentProblem'
  const { loading, fetchedSlug, error, problem } = useSelector((state: RootState) => state.problem);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!slug) return;

    // ✅ fetch only if user is logged in and not already fetched
    if (isAuthenticated && slug !== fetchedSlug) {
      if (typeof slug === "string") {
        dispatch(getProblem(slug));
      }
    }
  }, [dispatch, slug, isAuthenticated, fetchedSlug]);

  // Handle premium error and other errors
  useEffect(() => {
    if (error) {
      // Check if it's a premium problem error - comprehensive check
      const lowerCaseError = error.toLowerCase();
      const isPremiumError = 
        lowerCaseError.includes('premium') ||
        lowerCaseError.includes('subscribe') ||
        lowerCaseError.includes('unlock') ||
        lowerCaseError.includes('subscription') ||
        lowerCaseError.includes('please subscribe');

      if (isPremiumError) {
        setPremiumProblemTitle(problem?.title || "This Problem");
        setShowPremiumModal(true);
      }
    }
  }, [error, problem]);

  // Also check if the problem itself is marked as premium
  useEffect(() => {
    if (problem?.isPremium) {
      setPremiumProblemTitle(problem.title || "This Problem");
      setShowPremiumModal(true);
    }
  }, [problem]);

  // Listen for submission overlay events
  useEffect(() => {
    const handleCreateSubmissionTab = () => {
      setShowSubmissionOverlay(true);
    };

    const handleCloseSubmissionOverlay = () => {
      setShowSubmissionOverlay(false);
    };

    window.addEventListener('createSubmissionTab', handleCreateSubmissionTab);
    window.addEventListener('closeSubmissionOverlay', handleCloseSubmissionOverlay);

    return () => {
      window.removeEventListener('createSubmissionTab', handleCreateSubmissionTab);
      window.removeEventListener('closeSubmissionOverlay', handleCloseSubmissionOverlay);
    };
  }, []);

  const handleClosePremiumModal = () => {
    setShowPremiumModal(false);
    // Optionally redirect to problems list
    router.push('/problems');
  };

  if (loading) return (
    <div 
      className="h-screen flex items-center justify-center"
      style={{ 
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}
    >
      <p className="text-lg">Loading problem...</p>
    </div>
  );

  return (
    <div 
      className="h-screen flex flex-col relative"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Premium Modal */}
      <PremiumModal 
        isOpen={showPremiumModal}
        onClose={handleClosePremiumModal}
        problemTitle={premiumProblemTitle}
      />
      
      {/* Top Navigation */}
      <Navbar />
      
      {/* Main Content Area - LeetCode style resizable layout */}
      <div className="flex-1 overflow-hidden relative">
        <PanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - Problem Description */}
          <Panel 
            defaultSize={45} 
            minSize={25} 
            maxSize={70}
            className="relative flex flex-col"
            style={{ backgroundColor: 'var(--bg-primary)' }}
          >
            {/* Problem Section - fixed height */}
            <div className="flex-shrink-0">
              <ProblemSection />
            </div>
            
            {/* Content Area with Overlay Support - takes remaining space */}
            <div className="flex-1 overflow-auto relative">
              {/* Show premium message if we have premium error but modal is not showing */}
              {error && error.toLowerCase().includes('premium') && !showPremiumModal && (
                <div className="p-8 text-center">
                  <div 
                    className="rounded-lg p-6 max-w-md mx-auto border"
                    style={{ 
                      backgroundColor: 'var(--warning-50)',
                      borderColor: 'var(--warning-500)'
                    }}
                  >
                    <h3 
                      className="text-lg font-semibold mb-2"
                      style={{ color: 'var(--warning-600)' }}
                    >
                      Premium Problem
                    </h3>
                    <p 
                      className="mb-4"
                      style={{ color: 'var(--warning-600)' }}
                    >
                      This problem requires a subscription to access.
                    </p>
                    <button
                      onClick={() => {
                        setPremiumProblemTitle(problem?.title || "This Problem");
                        setShowPremiumModal(true);
                      }}
                      className="btn-primary"
                    >
                      View Subscription Options
                    </button>
                  </div>
                </div>
              )}
              
              {/* Original Content */}
              <div className={showSubmissionOverlay ? 'hidden' : 'h-full'}>
                {children}
              </div>
              
              {/* Submission Overlay Content */}
              {showSubmissionOverlay && (
                <div 
                  className="absolute inset-0 z-10 overflow-auto animate-fade-in"
                  style={{ backgroundColor: 'var(--bg-primary)' }}
                >
                  <div className="p-4">
                    {/* Close button */}
                    <div className="flex justify-between items-center mb-4">
                      <h2 
                        className="text-xl font-semibold"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {window.submissionTabName || 'Submission Result'}
                      </h2>
                      <button
                        onClick={() => {
                          setShowSubmissionOverlay(false);
                          const closeEvent = new CustomEvent('closeSubmissionOverlay');
                          window.dispatchEvent(closeEvent);
                        }}
                        className="p-1 rounded-md transition-colors hover:bg-secondary"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Submission Result Content */}
                    <SubmissionResultContent />
                  </div>
                </div>
              )}
            </div>

            {/* Footer - Always at bottom */}
            <div className="flex-shrink-0">
              <ProblemFooter />
            </div>
          </Panel>
          
          {/* Horizontal Resize Handle */}
          <PanelResizeHandle 
            className="w-2 transition-colors duration-200 relative group"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <div 
              className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 transition-colors duration-200 rounded-full"
              style={{ backgroundColor: 'var(--border-secondary)' }}
            ></div>
            
            {/* Drag indicator dots */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex flex-col justify-center space-y-1">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-1 h-1 rounded-full transition-all duration-200"
                  style={{ backgroundColor: 'var(--text-muted)' }}
                />
              ))}
            </div>
          </PanelResizeHandle>
          
          {/* Right Panel - Code Editor and Test Cases */}
          <Panel 
            defaultSize={55} 
            minSize={30}
            style={{ backgroundColor: 'var(--bg-primary)' }}
          >
            <PanelGroup direction="vertical" className="h-full">
              {/* Code Editor Panel */}
              <Panel 
                defaultSize={65} 
                minSize={30}
                style={{ backgroundColor: 'var(--bg-primary)' }}
              >
                <CodeEditorSection />
              </Panel>
              
              {/* Vertical Resize Handle */}
              <PanelResizeHandle 
                className="h-2 transition-colors duration-200 relative group"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <div 
                  className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 transition-colors duration-200 rounded-full"
                  style={{ backgroundColor: 'var(--border-secondary)' }}
                ></div>
                
                {/* Drag indicator dots */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1 h-1 rounded-full transition-all duration-200"
                      style={{ backgroundColor: 'var(--text-muted)' }}
                    />
                  ))}
                </div>
              </PanelResizeHandle>
              
              {/* Test Cases Panel */}
              <Panel 
                defaultSize={35} 
                minSize={15}
                className="border-t"
                style={{ 
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-primary)'
                }}
              >
                <TestCasesSection />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

// Submission Result Content Component
const SubmissionResultContent = () => {
  const [submissionData, setSubmissionData] = useState<SubmissionResponse | null>(null);

  useEffect(() => {
    const data = window.submissionResult;
    if (data) {
      setSubmissionData(data);
    }
  }, []);

  if (!submissionData) {
    return (
      <div className="animate-pulse">
        <div 
          className="skeleton h-4 rounded w-1/4 mb-4"
        ></div>
        <div 
          className="skeleton h-4 rounded w-1/2"
        ></div>
      </div>
    );
  }

  const { submission, results, success, error, message } = submissionData;

  // Handle error cases
  if (!success || error) {
    return (
      <div 
        className="rounded-lg p-4 border"
        style={{ 
          backgroundColor: 'var(--error-50)',
          borderColor: 'var(--error-500)'
        }}
      >
        <div className="flex items-center mb-2">
          <svg 
            className="w-5 h-5 mr-2" 
            style={{ color: 'var(--error-500)' }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 
            className="text-lg font-semibold"
            style={{ color: 'var(--error-600)' }}
          >
            {error || 'Submission Failed'}
          </h3>
        </div>
        <p style={{ color: 'var(--error-600)' }}>
          {message || 'An error occurred during submission.'}
        </p>
      </div>
    );
  }

  const isAccepted = submission?.status === 'accepted';

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <div 
        className="border rounded-lg p-4"
        style={{ 
          backgroundColor: isAccepted ? 'var(--success-50)' : 'var(--error-50)',
          borderColor: isAccepted ? 'var(--success-500)' : 'var(--error-500)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
              style={{ 
                backgroundColor: isAccepted ? 'var(--success-500)' : 'var(--error-500)'
              }}
            >
              {isAccepted ? (
                <svg 
                  className="w-5 h-5" 
                  style={{ color: 'var(--text-inverse)' }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg 
                  className="w-5 h-5" 
                  style={{ color: 'var(--text-inverse)' }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div>
              <h3 
                className="text-xl font-bold"
                style={{ 
                  color: isAccepted ? 'var(--success-600)' : 'var(--error-600)'
                }}
              >
                {isAccepted ? 'Accepted' : 'Wrong Answer'}
              </h3>
              <p 
                className="text-sm"
                style={{ 
                  color: isAccepted ? 'var(--success-600)' : 'var(--error-600)'
                }}
              >
                {submission?.testCasesPassed || 0} / {submission?.totalTestCases || 0} test cases passed
              </p>
            </div>
          </div>
          
          <div 
            className="text-right text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            <div className="font-medium">Runtime: {submission?.executionTime || 0} ms</div>
            <div className="font-medium">Memory: {submission?.memoryUsage || 0} KB</div>
            {submission?.notes?.timeTaken && (
              <div className="font-medium">
                Time Taken: {Math.floor(submission.notes.timeTaken / 60)}:{(submission.notes.timeTaken % 60).toString().padStart(2, '0')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Test Cases Results */}
      {results?.testDetails && results.testDetails.length > 0 && (
        <div>
          <h4 
            className="text-lg font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Test Cases
          </h4>
          <div className="space-y-3">
            {results.testDetails.map((testCase: TestCaseDetail, index: number) => (
              <div 
                key={index} 
                className="border rounded-lg overflow-hidden"
                style={{ borderColor: 'var(--border-primary)' }}
              >
                <div 
                  className="px-4 py-3 flex justify-between items-center border-b"
                  style={{ 
                    backgroundColor: testCase.passed ? 'var(--success-50)' : 'var(--error-50)',
                    borderColor: testCase.passed ? 'var(--success-500)' : 'var(--error-500)'
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <span 
                      className="font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Test Case {index + 1}
                    </span>
                    {testCase.isVisible && (
                      <span 
                        className="text-xs px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: 'var(--primary-100)',
                          color: 'var(--primary-600)'
                        }}
                      >
                        Visible
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: testCase.passed ? 'var(--success-100)' : 'var(--error-100)',
                        color: testCase.passed ? 'var(--success-600)' : 'var(--error-600)'
                      }}
                    >
                      {testCase.status}
                    </span>
                    <span 
                      className="text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {testCase.executionTime}ms • {testCase.memoryUsage}KB
                    </span>
                  </div>
                </div>
                
                {testCase.isVisible && (
                  <div className="p-4 space-y-4">
                    <div>
                      <label 
                        className="block text-sm font-semibold mb-2"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Input:
                      </label>
                      <pre 
                        className="border p-3 rounded-md text-sm overflow-x-auto font-mono"
                        style={{ 
                          backgroundColor: 'var(--bg-secondary)',
                          borderColor: 'var(--border-primary)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        {testCase.input}
                      </pre>
                    </div>
                    
                    <div>
                      <label 
                        className="block text-sm font-semibold mb-2"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Expected Output:
                      </label>
                      <pre 
                        className="border p-3 rounded-md text-sm overflow-x-auto font-mono"
                        style={{ 
                          backgroundColor: 'var(--bg-secondary)',
                          borderColor: 'var(--border-primary)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        {testCase.expectedOutput}
                      </pre>
                    </div>
                    
                    <div>
                      <label 
                        className="block text-sm font-semibold mb-2"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Your Output:
                      </label>
                      <pre 
                        className="border p-3 rounded-md text-sm overflow-x-auto font-mono"
                        style={{ 
                          backgroundColor: testCase.passed ? 'var(--success-50)' : 'var(--error-50)',
                          borderColor: testCase.passed ? 'var(--success-500)' : 'var(--error-500)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        {testCase.actualOutput}
                      </pre>
                    </div>
                    
                    {testCase.errorMessage && (
                      <div>
                        <label 
                          className="block text-sm font-semibold mb-2"
                          style={{ color: 'var(--error-600)' }}
                        >
                          Error:
                        </label>
                        <pre 
                          className="border p-3 rounded-md text-sm overflow-x-auto font-mono"
                          style={{ 
                            backgroundColor: 'var(--error-50)',
                            borderColor: 'var(--error-500)',
                            color: 'var(--error-600)'
                          }}
                        >
                          {testCase.errorMessage}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overall Error Message */}
      {results?.errorMessage && (
        <div 
          className="rounded-lg p-4 border"
          style={{ 
            backgroundColor: 'var(--error-50)',
            borderColor: 'var(--error-500)'
          }}
        >
          <h4 
            className="text-lg font-semibold mb-3"
            style={{ color: 'var(--error-600)' }}
          >
            Runtime Error
          </h4>
          <pre 
            className="text-sm overflow-x-auto font-mono p-3 rounded"
            style={{ 
              backgroundColor: 'var(--error-100)',
              color: 'var(--error-600)'
            }}
          >
            {results.errorMessage}
          </pre>
        </div>
      )}
    </div>
  );
};
