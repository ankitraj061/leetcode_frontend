import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Problem } from './types';
import { problemsAPI } from './globalAPI';
import PremiumModal from '../../components/PremiumModal';
import { RootState } from './types';

interface ProblemItemProps {
  problem: Problem;
  onSaveToggle: (problemId: string, isSaved: boolean) => void;
}

const ProblemItem: React.FC<ProblemItemProps> = ({ problem, onSaveToggle }) => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check if user has premium access
  const hasPremiumAccess = user?.subscriptionType === 'premium';

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return {
          color: 'text-success',
          bg: 'bg-success/10',
          border: 'border-success/20',
          glow: 'shadow-success/25',
          icon: '🌱'
        };
      case 'medium':
        return {
          color: 'text-warning',
          bg: 'bg-warning/10',
          border: 'border-warning/20',
          glow: 'shadow-warning/25',
          icon: '⚡'
        };
      case 'hard':
        return {
          color: 'text-error',
          bg: 'bg-error/10',
          border: 'border-error/20',
          glow: 'shadow-error/25',
          icon: '🔥'
        };
      default:
        return {
          color: 'text-tertiary',
          bg: 'bg-tertiary',
          border: 'border-primary',
          glow: 'shadow-sm',
          icon: '❓'
        };
    }
  };

  const difficultyConfig = getDifficultyConfig(problem.difficulty);

  const handleProblemClick = () => {
    // If it's a premium problem and user doesn't have premium access, show modal
    if (problem.isPremiumProblem && !hasPremiumAccess) {
      setShowPremiumModal(true);
      return;
    }
    
    // If user has access or it's a free problem, navigate to problem page
    router.push(`/problems/${problem.slug}`);
  };

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const response = await problemsAPI.toggleSaveProblem(problem._id);
      onSaveToggle(problem._id, response.isSaved);
    } catch (error) {
      console.error('Error toggling save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ NEW: Function to render status icon based on problem state
  const renderStatusIcon = () => {
    if (problem.isSolvedByUser) {
      // Solved - Green checkmark
      return (
        <div className="relative">
          <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center border-2 border-success animate-pulse">
            <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        </div>
      );
    } else if (problem.isAttemptedByUser) {
      // Attempted but not solved - Orange/Yellow warning icon
      return (
        <div className="relative">
          <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center border-2 border-warning">
            <svg className="w-6 h-6 text-warning" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          {/* Pulsing border to indicate work in progress */}
          <div className="absolute inset-0 rounded-full border-2 border-warning/30 animate-pulse"></div>
        </div>
      );
    } else if (problem.isPremiumProblem) {
      // Premium problem - Lock or star icon based on access
      return (
        <div className="relative">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 glass ${
            hasPremiumAccess 
              ? 'bg-brand/20 border-brand text-brand' 
              : 'bg-warning/20 border-warning text-warning'
          }`}>
            {hasPremiumAccess ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
            )}
          </div>
          {!hasPremiumAccess && (
            <div className="absolute inset-0 rounded-full border-2 border-warning/50 animate-spin"></div>
          )}
        </div>
      );
    } else {
      // Not attempted - Default arrow icon
      return (
        <div className="w-10 h-10 bg-tertiary/20 rounded-full flex items-center justify-center border-2 border-dashed border-tertiary group-hover:border-brand/50 transition-all duration-300">
          <svg className="w-5 h-5 text-tertiary group-hover:text-brand transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      );
    }
  };

  // ✅ NEW: Function to get status text for accessibility/tooltips
  const getStatusText = () => {
    if (problem.isSolvedByUser) return "Solved";
    if (problem.isAttemptedByUser) return "Attempted";
    if (problem.isPremiumProblem && !hasPremiumAccess) return "Premium - Locked";
    if (problem.isPremiumProblem && hasPremiumAccess) return "Premium - Unlocked";
    return "Not Attempted";
  };

  return (
    <>
      <div 
        className={`group bg-elevated hover:bg-primary border border-primary transition-all duration-300 cursor-pointer animate-fade-in hover:-translate-y-1 interactive ${
          problem.isPremiumProblem && !hasPremiumAccess
            ? 'hover:border-warning/50 hover:shadow-warning/10'
            : 'hover:border-brand/30 hover:shadow-lg'
        }`}
        onClick={handleProblemClick}
      >
        <div className="flex items-center p-6 gap-6">
          {/* ✅ UPDATED: Status Icon with attempted state */}
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
            <div title={getStatusText()} className="relative">
              {renderStatusIcon()}
            </div>
          </div>

          {/* Problem Title */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className={`text-lg font-semibold transition-colors duration-300 truncate ${
                problem.isPremiumProblem && !hasPremiumAccess
                  ? 'text-primary group-hover:text-warning'
                  : 'text-primary group-hover:text-brand'
              }`}>
                {problem.title}
              </h3>
              {problem.isPremiumProblem && (
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full border ${
                  hasPremiumAccess
                    ? 'bg-gradient-to-r from-brand/20 to-brand/10 border-brand/30 text-brand'
                    : 'bg-gradient-to-r from-warning/20 to-accent/20 border-warning/30 text-warning'
                }`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span className="text-xs font-medium">
                    {hasPremiumAccess ? 'Premium Unlocked' : 'Premium'}
                  </span>
                </div>
              )}
            </div>
            
            {/* ✅ NEW: Status indicator text */}
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${
                problem.isSolvedByUser 
                  ? 'bg-success animate-pulse' 
                  : problem.isAttemptedByUser 
                    ? 'bg-warning animate-pulse'
                    : problem.isPremiumProblem 
                      ? (hasPremiumAccess ? 'bg-success animate-pulse' : 'bg-warning animate-pulse')
                      : 'bg-tertiary'
              }`}></div>
              <span className={`text-xs font-medium ${
                problem.isSolvedByUser 
                  ? 'text-success' 
                  : problem.isAttemptedByUser 
                    ? 'text-warning'
                    : problem.isPremiumProblem 
                      ? (hasPremiumAccess ? 'text-success' : 'text-warning')
                      : 'text-tertiary'
              }`}>
                {problem.isSolvedByUser 
                  ? 'Solved Successfully' 
                  : problem.isAttemptedByUser 
                    ? 'Work in Progress'
                    : problem.isPremiumProblem 
                      ? (hasPremiumAccess ? 'Full Access Available' : 'Requires Premium')
                      : 'Ready to Start'
                }
              </span>
            </div>
          </div>

          {/* Acceptance Rate */}
          <div className="flex-shrink-0 text-center min-w-[100px]">
            <div className={`bg-tertiary/50 rounded-lg p-3 transition-all duration-300 ${
              problem.isPremiumProblem && !hasPremiumAccess
                ? 'group-hover:bg-warning/10'
                : 'group-hover:bg-brand/10'
            }`}>
              <div className={`text-sm font-medium transition-colors duration-300 ${
                problem.isPremiumProblem && !hasPremiumAccess
                  ? 'text-secondary group-hover:text-warning'
                  : 'text-secondary group-hover:text-brand'
              }`}>
                {problem.acceptanceRate.toFixed(1)}%
              </div>
              <div className="text-xs text-muted">Accepted</div>
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex-shrink-0 min-w-[120px] text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl border ${difficultyConfig.bg} ${difficultyConfig.border} ${difficultyConfig.color} shadow-sm hover:${difficultyConfig.glow} transition-all duration-300`}>
              <span className="text-base">{difficultyConfig.icon}</span>
              <span className="font-semibold capitalize text-sm">
                {problem.difficulty}
              </span>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex-shrink-0">
            <button
              onClick={handleSaveToggle}
              disabled={isSaving}
              className={`relative w-12 h-12 rounded-xl border-2 transition-all duration-300 hover:scale-110 active:scale-95 ${
                problem.isSavedProblem
                  ? 'bg-accent/20 border-accent text-accent hover:bg-accent/30 shadow-accent/25'
                  : 'bg-tertiary/20 border-tertiary/50 text-tertiary hover:bg-accent/10 hover:border-accent/50 hover:text-accent'
              } ${isSaving ? 'opacity-50 cursor-not-allowed animate-pulse' : 'hover:shadow-lg'}`}
            >
              {isSaving ? (
                <div className="w-5 h-5 mx-auto border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : problem.isSavedProblem ? (
                <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              ) : (
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Premium Modal - Only show if user doesn't have premium access */}
      {!hasPremiumAccess && (
        <PremiumModal
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          problemTitle={problem.title}
        />
      )}
    </>
  );
};

export default ProblemItem;
