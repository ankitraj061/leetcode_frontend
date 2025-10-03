import React from 'react';
import { Topic } from './types';

interface TopicsBarProps {
  topics: Topic[];
  selectedTopic: string;
  onTopicSelect: (topic: string) => void;
  isLoading: boolean;
}

const TopicsBar: React.FC<TopicsBarProps> = ({
  topics,
  selectedTopic,
  onTopicSelect,
  isLoading
}) => {
  const getTopicIcon = (topic: string) => {
    const iconMap: { [key: string]: string } = {
      'Array': '🔢',
      'String': '📝',
      'Linked List': '🔗',
      'Binary Tree': '🌳',
      'Binary Search Tree': '🌲',
      'Graph': '🕸️',
      'Dynamic Programming': '⚡',
      'Greedy': '🎯',
      'Backtracking': '🔄',
      'Divide and Conquer': '⚔️',
      'Hash Table': '🗂️',
      'Stack': '📚',
      'Queue': '🚶',
      'Heap': '⛰️',
      'Trie': '🌐',
      'Bit Manipulation': '🔢',
      'Math': '🧮',
      'Two Pointers': '👉',
      'Sliding Window': '🪟',
      'Binary Search': '🔍',
      'Sorting': '📊',
      'Union Find': '🤝',
      'Topological Sort': '📈',
      'Recursion': '🔁',
      'Tree': '🎄',
      'Design': '🎨',
      'Database': '💾',
      'System Design': '🏗️'
    };
    return iconMap[topic] || '💡';
  };

  if (isLoading) {
    return (
      <div className="bg-elevated border-b border-primary">
        <div className="p-6">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="flex-shrink-0 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-14 w-32 skeleton rounded-2xl flex-shrink-0"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalProblems = topics.reduce((sum, topic) => sum + topic.count, 0);

  return (
    <div className="bg-elevated border-b border-primary shadow-sm">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary">Problem Topics</h2>
              <p className="text-sm text-secondary">{topics.length} categories • {totalProblems.toLocaleString()} problems</p>
            </div>
          </div>
        </div>

        {/* Topics List */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {/* All Topics Button */}
          <button
            onClick={() => onTopicSelect('')}
            className={`group flex-shrink-0 relative overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 ${
              selectedTopic === ''
                ? 'bg-gradient-to-r from-brand to-brand-hover text-inverse shadow-xl shadow-brand/25'
                : 'bg-tertiary/20 hover:bg-brand/10 border border-tertiary/30 hover:border-brand/30 text-secondary hover:text-brand'
            } px-6 py-4 rounded-2xl font-semibold text-sm whitespace-nowrap animate-fade-in`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg ${
                selectedTopic === '' 
                  ? 'bg-inverse/20' 
                  : 'bg-brand/20 group-hover:bg-brand/30'
              }`}>
                🌟
              </div>
              <div className="text-left">
                <div className="font-bold">All Topics</div>
                <div className={`text-xs ${selectedTopic === '' ? 'text-inverse/80' : 'text-tertiary group-hover:text-brand/70'}`}>
                  {totalProblems} problems
                </div>
              </div>
            </div>
            {selectedTopic === '' && (
              <div className="absolute inset-0 bg-gradient-to-r from-brand-hover/20 to-transparent animate-pulse"></div>
            )}
          </button>

          {/* Individual Topic Buttons */}
          {topics.map((topic, index) => (
            <button
              key={topic.topic}
              onClick={() => onTopicSelect(topic.topic)}
              className={`group flex-shrink-0 relative overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 animate-fade-in ${
                selectedTopic === topic.topic
                  ? 'bg-gradient-to-r from-brand to-brand-hover text-inverse shadow-xl shadow-brand/25'
                  : 'bg-tertiary/20 hover:bg-brand/10 border border-tertiary/30 hover:border-brand/30 text-secondary hover:text-brand'
              } px-6 py-4 rounded-2xl font-semibold text-sm whitespace-nowrap`}
              style={{ animationDelay: `${(index + 1) * 0.05}s` }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg ${
                  selectedTopic === topic.topic 
                    ? 'bg-inverse/20' 
                    : 'bg-brand/20 group-hover:bg-brand/30'
                }`}>
                  {getTopicIcon(topic.topic)}
                </div>
                <div className="text-left">
                  <div className="font-bold truncate max-w-[120px]">
                    {topic.topic}
                  </div>
                  <div className={`text-xs ${
                    selectedTopic === topic.topic 
                      ? 'text-inverse/80' 
                      : 'text-tertiary group-hover:text-brand/70'
                  }`}>
                    {topic.count} problem{topic.count !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              
              {/* Selection Indicator */}
              {selectedTopic === topic.topic && (
                <>
                  <div className="absolute top-2 right-2 w-3 h-3 bg-inverse rounded-full animate-ping"></div>
                  <div className="absolute top-2 right-2 w-3 h-3 bg-inverse rounded-full"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-hover/20 to-transparent animate-pulse"></div>
                </>
              )}

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand/0 via-brand/5 to-brand/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          ))}
        </div>

        {/* Selected Topic Info */}
        {selectedTopic && (
          <div className="mt-6 pt-6 border-t border-primary animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">{getTopicIcon(selectedTopic)}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-secondary">Currently viewing:</span>
                    <div className="w-2 h-2 bg-brand rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="text-xl font-bold text-brand">{selectedTopic}</h3>
                  <p className="text-sm text-tertiary">
                    {topics.find(t => t.topic === selectedTopic)?.count || 0} problems available
                  </p>
                </div>
              </div>
              <button
                onClick={() => onTopicSelect('')}
                className="group flex items-center gap-2 bg-tertiary/20 hover:bg-error/10 border border-tertiary/30 hover:border-error/30 text-tertiary hover:text-error px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-sm font-medium">Clear</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default TopicsBar;
