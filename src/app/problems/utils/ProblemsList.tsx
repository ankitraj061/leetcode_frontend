import React from 'react';
import { Problem, PaginationInfo } from './types';
import ProblemItem from './ProblemItem';

interface ProblemsListProps {
  problems: Problem[];
  pagination: PaginationInfo;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onSaveToggle: (problemId: string, isSaved: boolean) => void;
}

const ProblemsList: React.FC<ProblemsListProps> = ({
  problems,
  pagination,
  isLoading,
  onPageChange,
  onSaveToggle
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Header Skeleton */}
        <div className="bg-elevated rounded-2xl p-6 border border-primary">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 skeleton rounded-xl"></div>
              <div className="flex-1">
                <div className="w-32 h-5 skeleton rounded mb-2"></div>
                <div className="w-24 h-4 skeleton rounded"></div>
              </div>
              <div className="w-20 h-8 skeleton rounded-lg"></div>
              <div className="w-24 h-8 skeleton rounded-lg"></div>
              <div className="w-12 h-12 skeleton rounded-xl"></div>
            </div>
          </div>
        </div>

        {/* Loading Skeletons */}
        <div className="space-y-3">
          {[...Array(8)].map((_, index) => (
            <div 
              key={index} 
              className="bg-elevated rounded-2xl p-6 border border-primary animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 skeleton rounded-xl"></div>
                <div className="flex-1">
                  <div className="w-48 h-6 skeleton rounded mb-2"></div>
                  <div className="w-32 h-4 skeleton rounded"></div>
                </div>
                <div className="w-24 h-16 skeleton rounded-lg"></div>
                <div className="w-32 h-12 skeleton rounded-xl"></div>
                <div className="w-12 h-12 skeleton rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="bg-elevated rounded-2xl p-12 text-center border border-primary shadow-lg animate-fade-in">
        <div className="relative mb-6">
          <div className="w-24 h-24 mx-auto bg-tertiary/20 rounded-3xl flex items-center justify-center">
            <svg className="w-12 h-12 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand/20 rounded-full animate-ping"></div>
        </div>
        <h3 className="text-2xl font-bold text-primary mb-3">No Problems Found</h3>
        <p className="text-secondary text-lg mb-6">
          Try adjusting your filters or search criteria to discover problems.
        </p>
        <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-6 py-3 rounded-full border border-brand/20">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">Pro Tip: Clear all filters to see more problems</span>
        </div>
      </div>
    );
  }

  const renderPaginationButton = (page: number | string, isCurrent = false, isDisabled = false) => {
    if (typeof page === 'string') {
      return (
        <div
          key={page}
          className="px-3 py-2 text-tertiary cursor-default"
        >
          {page}
        </div>
      );
    }

    return (
      <button
        key={page}
        onClick={() => !isCurrent && !isDisabled && onPageChange(page)}
        disabled={isDisabled || isCurrent}
        className={`relative overflow-hidden px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
          isCurrent
            ? 'bg-brand text-inverse shadow-lg shadow-brand/25 scale-105'
            : isDisabled
            ? 'text-muted cursor-not-allowed'
            : 'text-secondary hover:text-brand hover:bg-brand/10 hover:scale-105 hover:shadow-md active:scale-95'
        }`}
      >
        {isCurrent && (
          <div className="absolute inset-0 bg-gradient-to-r from-brand to-brand-hover opacity-90"></div>
        )}
        <span className="relative">{page}</span>
      </button>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-elevated rounded-2xl border border-primary shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-primary">
          <div className="flex items-center gap-6 flex-1">
            <div className="w-12 text-center">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-secondary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Status
              </div>
            </div>
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-secondary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Problem
              </div>
            </div>
            <div className="w-24 text-center">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-secondary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Accept%
              </div>
            </div>
            <div className="w-32 text-center">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-secondary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Difficulty
              </div>
            </div>
            <div className="w-12 text-center">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-secondary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problems List */}
      <div className="space-y-3">
        {problems.map((problem, index) => (
          <div
            key={problem._id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <ProblemItem
              problem={problem}
              onSaveToggle={onSaveToggle}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-elevated rounded-2xl border border-primary shadow-sm p-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Pagination Info */}
            <div className="flex items-center gap-2 text-sm text-secondary">
              <div className="inline-flex items-center gap-2 bg-tertiary px-3 py-2 rounded-lg">
                <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-medium">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
              </div>
              <div className="text-tertiary">
                ({pagination.totalProblems.toLocaleString()} total problems)
              </div>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  pagination.hasPrev
                    ? 'text-secondary hover:text-brand hover:bg-brand/10 hover:scale-105 hover:shadow-md active:scale-95'
                    : 'text-muted cursor-not-allowed opacity-50'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Previous</span>
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {(() => {
                  const pages = [];
                  const current = pagination.currentPage;
                  const total = pagination.totalPages;
                  
                  // Show first page
                  if (current > 3) {
                    pages.push(renderPaginationButton(1));
                    if (current > 4) pages.push('...');
                  }
                  
                  // Show current page and neighbors
                  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
                    pages.push(renderPaginationButton(i, i === current));
                  }
                  
                  // Show last page
                  if (current < total - 2) {
                    if (current < total - 3) pages.push('...');
                    pages.push(renderPaginationButton(total));
                  }
                  
                  return pages;
                })()}
              </div>
              
              {/* Next Button */}
              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  pagination.hasNext
                    ? 'text-secondary hover:text-brand hover:bg-brand/10 hover:scale-105 hover:shadow-md active:scale-95'
                    : 'text-muted cursor-not-allowed opacity-50'
                }`}
              >
                <span>Next</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemsList;
