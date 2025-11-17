// app/profile/[username]/utils/HeatmapCard.tsx
'use client';

import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { axiosClient } from '@/app/utils/axiosClient';
import { AxiosError } from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

interface HeatmapData {
  date: string;
  count: number;
}

interface HeatmapCardProps {
  username: string;
}

interface TooltipData {
  date: string;
  count: number;
  x: number;
  y: number;
}

export default function HeatmapCard({ username }: HeatmapCardProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // Available years (current year and last 2 years)
  const availableYears = [currentYear, currentYear - 1, currentYear - 2];

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        setLoading(true);
        const params = selectedYear === currentYear ? '' : `?year=${selectedYear}`;
        const response = await axiosClient.get(
          `/api/${username}/heatmap${params}`
        );

        if (response.data.success) {
          setHeatmapData(response.data.data || []);
        } else {
          setError(response.data.message || 'Failed to load heatmap');
        }
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        setError(
          err.response?.data?.message || err.message || 'An error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchHeatmapData();
    }
  }, [username, selectedYear]);

  // Generate all dates for the year
  const generateYearDates = (): Date[] => {
    const dates: Date[] = [];
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = selectedYear === currentYear ? new Date() : new Date(selectedYear, 11, 31);

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  // Create a map for quick lookup
  const dataMap = new Map(
    heatmapData.map(item => [item.date, item.count])
  );

  // Get color intensity based on count (GitHub-style green gradient)
  const getColorStyle = (count: number): React.CSSProperties => {
    if (count === 0) {
      return {
        backgroundColor: 'var(--bg-tertiary)',
        border: '1px solid var(--border-primary)'
      };
    }
    if (count <= 2) {
      return {
        backgroundColor: '#0E4429', // Dark mode: dark green
        border: '1px solid var(--border-primary)'
      };
    }
    if (count <= 5) {
      return {
        backgroundColor: '#006D32', // Dark mode: medium-dark green
        border: '1px solid var(--border-primary)'
      };
    }
    if (count <= 10) {
      return {
        backgroundColor: '#26A641', // Dark mode: medium green
        border: '1px solid var(--border-primary)'
      };
    }
    return {
      backgroundColor: '#39D353', // Dark mode: bright green
      border: '1px solid var(--border-primary)'
    };
  };

  // Get light mode color (for the legend and cells in light theme)
  const getColorStyleLight = (count: number): React.CSSProperties => {
    if (count === 0) {
      return {
        backgroundColor: 'var(--bg-tertiary)',
        border: '1px solid var(--border-primary)'
      };
    }
    if (count <= 2) {
      return {
        backgroundColor: '#9BE9A8', // Light mode: light green
        border: '1px solid var(--border-primary)'
      };
    }
    if (count <= 5) {
      return {
        backgroundColor: '#40C463', // Light mode: medium-light green
        border: '1px solid var(--border-primary)'
      };
    }
    if (count <= 10) {
      return {
        backgroundColor: '#30A14E', // Light mode: medium-dark green
        border: '1px solid var(--border-primary)'
      };
    }
    return {
      backgroundColor: '#216E39', // Light mode: dark green
      border: '1px solid var(--border-primary)'
    };
  };

  // Format date to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Get readable date format
  const getReadableDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Group dates by weeks
  const groupByWeeks = (): Date[][] => {
    const allDates = generateYearDates();
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    // Pad the beginning with empty dates to align with Sunday
    const firstDate = allDates[0];
    const firstDayOfWeek = firstDate.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(new Date(0)); // Placeholder date
    }

    allDates.forEach(date => {
      currentWeek.push(date);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    // Add remaining days
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(new Date(0)); // Placeholder
      }
      weeks.push(currentWeek);
    }

    return weeks;
  };

  // Calculate total submissions
  const totalSubmissions = heatmapData.reduce((sum, item) => sum + item.count, 0);

  // Handle year navigation
  const handlePreviousYear = () => {
    if (selectedYear > availableYears[availableYears.length - 1]) {
      setSelectedYear(selectedYear - 1);
    }
  };

  const handleNextYear = () => {
    if (selectedYear < currentYear) {
      setSelectedYear(selectedYear + 1);
    }
  };

  if (loading) {
    return (
      <div 
        className="rounded-lg p-6 animate-pulse"
        style={{ backgroundColor: 'var(--bg-elevated)' }}
      >
        <div 
          className="h-6 rounded mb-6"
          style={{ backgroundColor: 'var(--bg-secondary)', width: '33%' }}
        />
        <div 
          className="h-40 rounded"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="rounded-lg p-6"
        style={{ backgroundColor: 'var(--bg-elevated)' }}
      >
        <h2 
          className="text-xl font-bold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Activity Heatmap
        </h2>
        <p style={{ color: 'var(--error-500)' }}>{error}</p>
      </div>
    );
  }

  const weeks = groupByWeeks();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <motion.div 
      className="rounded-lg p-6 shadow-lg"
      style={{ backgroundColor: 'var(--bg-elevated)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with Year Selection */}
      <div className="flex items-center justify-between mb-6">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 
            className="text-xl font-bold mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Activity Heatmap
          </h2>
          <p 
            className="text-sm"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {totalSubmissions} submissions in {selectedYear}
          </p>
        </motion.div>

        {/* Year Navigation */}
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.button
            onClick={handlePreviousYear}
            disabled={selectedYear <= availableYears[availableYears.length - 1]}
            className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              color: 'var(--text-secondary)',
              backgroundColor: 'transparent'
            }}
            whileHover={{ 
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              scale: 1.1
            }}
            whileTap={{ scale: 0.95 }}
          >
            <FiChevronLeft size={20} />
          </motion.button>

          <span 
            className="text-lg font-semibold min-w-[80px] text-center"
            style={{ color: 'var(--text-primary)' }}
          >
            {selectedYear}
          </span>

          <motion.button
            onClick={handleNextYear}
            disabled={selectedYear >= currentYear}
            className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              color: 'var(--text-secondary)',
              backgroundColor: 'transparent'
            }}
            whileHover={{ 
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              scale: 1.1
            }}
            whileTap={{ scale: 0.95 }}
          >
            <FiChevronRight size={20} />
          </motion.button>
        </motion.div>
      </div>

      {/* Heatmap Grid */}
      <motion.div 
        className="overflow-x-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="inline-block min-w-full">
          {/* Month Labels */}
          <div className="flex gap-1 mb-2 ml-8">
            {months.map((month, idx) => (
              <div
                key={idx}
                className="text-xs"
                style={{ 
                  width: `${(weeks.length / 12) * 14}px`,
                  color: 'var(--text-tertiary)'
                }}
              >
                {month}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="flex gap-1">
            {/* Weekday Labels */}
            <div className="flex flex-col gap-1 pr-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                <div
                  key={idx}
                  className="text-xs h-3 flex items-center"
                  style={{ 
                    visibility: idx % 2 === 0 ? 'visible' : 'hidden',
                    color: 'var(--text-tertiary)'
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Heatmap Cells */}
            <div className="flex gap-1">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1">
                  {week.map((date, dayIdx) => {
                    const dateString = formatDate(date);
                    const count = dataMap.get(dateString) || 0;
                    const isPlaceholder = date.getTime() === 0;

                    return (
                      <motion.div
                        key={dayIdx}
                        className="w-3 h-3 rounded-sm transition-all cursor-pointer dark-mode-cell"
                        style={isPlaceholder ? { backgroundColor: 'transparent' } : getColorStyle(count)}
                        onMouseEnter={(e) => {
                          if (!isPlaceholder) {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltip({
                              date: dateString,
                              count,
                              x: rect.left + rect.width / 2,
                              y: rect.top,
                            });
                          }
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        whileHover={!isPlaceholder ? { 
                          scale: 1.3,
                          boxShadow: '0 0 0 2px var(--primary-500)'
                        } : {}}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          delay: (weekIdx * 7 + dayIdx) * 0.002,
                          duration: 0.2
                        }}
                        title={!isPlaceholder ? `${getReadableDate(dateString)}: ${count} submissions` : ''}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div 
        className="flex items-center justify-between mt-6 pt-4 border-t"
        style={{ borderColor: 'var(--border-primary)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          Less
        </span>
        <div className="flex gap-1">
          {/* Empty cell */}
          <div 
            className="w-3 h-3 rounded-sm"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)'
            }}
          />
          {/* 1-2 contributions */}
          <div 
            className="w-3 h-3 rounded-sm"
            style={{
              backgroundColor: '#0E4429',
              border: '1px solid var(--border-primary)'
            }}
          />
          {/* 3-5 contributions */}
          <div 
            className="w-3 h-3 rounded-sm"
            style={{
              backgroundColor: '#006D32',
              border: '1px solid var(--border-primary)'
            }}
          />
          {/* 6-10 contributions */}
          <div 
            className="w-3 h-3 rounded-sm"
            style={{
              backgroundColor: '#26A641',
              border: '1px solid var(--border-primary)'
            }}
          />
          {/* 10+ contributions */}
          <div 
            className="w-3 h-3 rounded-sm"
            style={{
              backgroundColor: '#39D353',
              border: '1px solid var(--border-primary)'
            }}
          />
        </div>
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          More
        </span>
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            className="fixed z-50 text-xs px-3 py-2 rounded-lg shadow-xl pointer-events-none"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y - 40}px`,
              transform: 'translateX(-50%)',
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-secondary)'
            }}
            initial={{ opacity: 0, scale: 0.8, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 5 }}
            transition={{ duration: 0.15 }}
          >
            <p className="font-semibold">{getReadableDate(tooltip.date)}</p>
            <p style={{ color: 'var(--text-secondary)' }}>
              {tooltip.count} {tooltip.count === 1 ? 'submission' : 'submissions'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for light mode override */}
      <style jsx>{`
        @media (prefers-color-scheme: light), .light {
          .dark-mode-cell[style*="backgroundColor: #0E4429"] {
            background-color: #9BE9A8 !important;
          }
          .dark-mode-cell[style*="backgroundColor: #006D32"] {
            background-color: #40C463 !important;
          }
          .dark-mode-cell[style*="backgroundColor: #26A641"] {
            background-color: #30A14E !important;
          }
          .dark-mode-cell[style*="backgroundColor: #39D353"] {
            background-color: #216E39 !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
