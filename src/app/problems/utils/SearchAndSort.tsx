import React, { useState, useEffect } from 'react';
import { ProblemsFilters } from './types';

interface SearchAndSortProps {
  filters: ProblemsFilters;
  onFilterChange: (key: keyof ProblemsFilters, value: any) => void;
  totalProblems: number;
}

const SearchAndSort: React.FC<SearchAndSortProps> = ({
  filters,
  onFilterChange,
  totalProblems
}) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange('search', searchInput);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput, onFilterChange]);

  const handleSortChange = (sortBy: string) => {
    onFilterChange('sortBy', sortBy);
  };

  const handleOrderChange = () => {
    const newOrder = filters.order === 'asc' ? 'desc' : 'asc';
    onFilterChange('order', newOrder);
  };

  const clearSearch = () => {
    setSearchInput('');
    onFilterChange('search', '');
  };

  return (
    <div className="bg-elevated border-b border-primary">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          {/* Search Input */}
          <div className="flex-1 max-w-2xl animate-fade-in">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search problems by title or tags..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="input pl-12 pr-12 py-4 text-base shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-300 group-hover:border-focus/50"
              />
             
              {searchInput && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-tertiary hover:text-error transition-all duration-200 hover:scale-110"
                  title="Clear search"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {/* Results Count */}
            <div className="flex items-center gap-2 bg-tertiary px-4 py-2 rounded-full">
              <svg className="h-4 w-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-medium text-secondary whitespace-nowrap">
                {totalProblems.toLocaleString()} problem{totalProblems !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Sort By Dropdown */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-secondary whitespace-nowrap">
                Sort by:
              </label>
              <div className="relative">
                <select
                  value={filters.sortBy || 'title'}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="input py-2 px-4 pr-10 text-sm appearance-none cursor-pointer hover:border-focus transition-all duration-200 bg-primary"
                >
                  <option value="title">📝 Title</option>
                  <option value="difficulty">⚡ Difficulty</option>
                  <option value="acceptance">📊 Acceptance Rate</option>
                  <option value="created">📅 Date Created</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-4 w-4 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Sort Order Toggle */}
            <button
              onClick={handleOrderChange}
              className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-tertiary border border-primary hover:border-focus rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group"
              title={`Sort ${filters.order === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {filters.order === 'asc' ? (
                <svg className="h-4 w-4 text-secondary group-hover:text-brand transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-secondary group-hover:text-brand transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                </svg>
              )}
              <span className="text-sm font-medium text-secondary group-hover:text-primary transition-colors duration-200">
                {filters.order === 'asc' ? 'A→Z' : 'Z→A'}
              </span>
            </button>
          </div>
        </div>

        {/* Active Search Indicator */}
        {filters.search && (
          <div className="mt-4 pt-4 border-t border-primary animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-brand/10 border border-brand/20 px-3 py-2 rounded-full">
                <svg className="h-4 w-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm text-brand">
                  Search results for:
                </span>
                <span className="text-sm font-semibold text-brand">
                  "{filters.search}"
                </span>
                <button
                  onClick={clearSearch}
                  className="ml-2 text-brand hover:text-brand-hover hover:bg-brand/10 rounded-full w-5 h-5 flex items-center justify-center transition-all duration-200 hover:scale-110"
                  title="Clear search"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAndSort;
