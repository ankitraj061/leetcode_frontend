"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { axiosClient } from "@/app/utils/axiosClient";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store/store";
import PremiumModal from "../../../components/PremiumModal";

interface Problem {
  _id: string;
  title: string;
  slug: string;
  difficulty: string;
  createdAt: string;
  isPremiumProblem: boolean;
  isSavedProblem: boolean;
  isSolvedByUser: boolean;
  isAttemptedByUser: boolean;
  acceptanceRate: number;
}

interface ProblemListSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onProblemSelect: (slug: string) => void;
}

export default function ProblemListSidebar({ isOpen, onClose, onProblemSelect }: ProblemListSidebarProps) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedPremiumProblem, setSelectedPremiumProblem] = useState<string>("");
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const hasPremium = user?.subscriptionType === 'premium';

  useEffect(() => {
    if (isOpen && problems.length === 0) {
      fetchProblems();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest('.problem-sidebar') && !target.closest('.problem-list-toggle')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/api/user/problem/all?page=1&limit=100&sortBy=title&order=asc');
      if (response.data.success) {
        setProblems(response.data.problems);
      }
    } catch (error) {
      console.error('Failed to fetch problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === "all" || problem.difficulty === difficultyFilter;
    
    let matchesStatus = true;
    if (statusFilter === "solved") {
      matchesStatus = problem.isSolvedByUser;
    } else if (statusFilter === "attempted") {
      matchesStatus = problem.isAttemptedByUser && !problem.isSolvedByUser;
    } else if (statusFilter === "todo") {
      matchesStatus = !problem.isSolvedByUser && !problem.isAttemptedByUser;
    }

    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  const handleProblemClick = (problem: Problem) => {
    if (problem.isPremiumProblem && !hasPremium) {
      setSelectedPremiumProblem(problem.title);
      setShowPremiumModal(true);
      return;
    }

    onProblemSelect(problem.slug);
    router.push(`/problems/${problem.slug}/description`);
  };

  const handlePremiumModalClose = () => {
    setShowPremiumModal(false);
    setSelectedPremiumProblem("");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-success';
      case 'medium': return 'text-warning';
      case 'hard': return 'text-error';
      default: return 'text-tertiary';
    }
  };

  const getDifficultyBgColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-success-light border-success-500';
      case 'medium': return 'bg-warning-light border-warning-500';
      case 'hard': return 'bg-error-light border-error-500';
      default: return 'bg-tertiary border-secondary';
    }
  };

  const PremiumLockIcon = ({ hasAccess }: { hasAccess: boolean }) => {
    if (hasAccess) {
      return (
        <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <title>Premium Unlocked</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a3 3 0 00-6 0v4h6V7z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <title>Premium Required</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      );
    }
  };

  return (
    <>
      <div className={`
        problem-sidebar
        fixed top-0 left-0 h-full w-96 bg-primary shadow-xl z-50 
        transform transition-transform duration-300 ease-in-out border-r border-primary
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary bg-secondary">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <h2 className="text-lg font-semibold text-primary">Problems</h2>
            {hasPremium && (
              <span className="text-xs bg-accent text-inverse px-2 py-1 rounded-full font-medium">
                PREMIUM
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-tertiary hover:text-secondary hover:bg-tertiary transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-4 space-y-3 border-b border-primary bg-secondary">
          {/* Search */}
          <div className="relative">
            {/* <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg> */}
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 text-sm"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-2">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="input text-sm"
            >
              <option value="all">All Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input text-sm"
            >
              <option value="all">All Status</option>
              <option value="solved">Solved</option>
              <option value="attempted">Attempted</option>
              <option value="todo">To Do</option>
            </select>
          </div>

          {/* Stats */}
          <div className="flex justify-between text-xs text-secondary pt-2">
            <span>Total: {problems.length}</span>
            <span>Solved: {problems.filter(p => p.isSolvedByUser).length}</span>
            <span>Premium: {problems.filter(p => p.isPremiumProblem).length}</span>
          </div>
        </div>

        {/* Problems List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="skeleton w-8 h-8 rounded-full"></div>
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-tertiary">
              <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">No problems found</p>
            </div>
          ) : (
            <div className="py-2">
              {filteredProblems.map((problem, index) => (
                <button
                  key={problem._id}
                  onClick={() => handleProblemClick(problem)}
                  className={`w-full px-4 py-3 text-left transition-all duration-200 border-l-4 interactive ${
                    problem.slug === slug 
                      ? 'bg-brand text-inverse border-l-brand' 
                      : 'border-l-transparent hover:border-l-secondary'
                  } ${
                    problem.isPremiumProblem && !hasPremium
                      ? 'opacity-60 cursor-not-allowed hover:bg-tertiary'
                      : 'hover:bg-secondary cursor-pointer'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm text-tertiary font-mono w-8">
                          {index + 1}.
                        </span>
                        <h3 className={`text-sm font-medium truncate ${
                          problem.slug === slug 
                            ? 'text-inverse' 
                            : problem.isPremiumProblem && !hasPremium
                            ? 'text-muted'
                            : 'text-primary'
                        }`}>
                          {problem.title}
                        </h3>
                        {problem.isPremiumProblem && (
                          <PremiumLockIcon hasAccess={hasPremium} />
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyBgColor(problem.difficulty)} ${getDifficultyColor(problem.difficulty)} font-medium ${
                          problem.isPremiumProblem && !hasPremium ? 'opacity-60' : ''
                        }`}>
                          {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                        </span>
                        <span className={`text-xs ${
                          problem.isPremiumProblem && !hasPremium 
                            ? 'text-muted' 
                            : 'text-tertiary'
                        }`}>
                          {problem.acceptanceRate.toFixed(1)}%
                        </span>
                        {problem.isPremiumProblem && !hasPremium && (
                          <span className="text-xs text-muted font-medium">PREMIUM</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-1 ml-2 flex-shrink-0">
                      {problem.isSolvedByUser && (
                        <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center shadow-sm" title="Solved">
                          <svg className="w-3 h-3 text-inverse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      {problem.isAttemptedByUser && !problem.isSolvedByUser && (
                        <div className="w-5 h-5 bg-warning rounded-full shadow-sm" title="Attempted"></div>
                      )}
                      {problem.isSavedProblem && (
                        <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24">
                          <title>Saved</title>
                          <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-primary bg-secondary">
          <div className="flex items-center justify-between text-xs text-secondary">
            <span>Progress: {problems.filter(p => p.isSolvedByUser).length}/{problems.length}</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-success rounded-full shadow-xs" title="Solved"></div>
              <div className="w-3 h-3 bg-warning rounded-full shadow-xs" title="Attempted"></div>
              <div className="w-3 h-3 bg-tertiary rounded-full shadow-xs" title="Not Started"></div>
            </div>
          </div>
        </div>
      </div>

      {showPremiumModal && (
        <PremiumModal
          isOpen={showPremiumModal}
          onClose={handlePremiumModalClose}
          problemTitle={selectedPremiumProblem}
        />
      )}
    </>
  );
}
