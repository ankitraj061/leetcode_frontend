'use client'
import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';

export default function ContestsPage() {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(68);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 95 ? 68 : prev + 0.5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <section className="bg-elevated border-b border-primary">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className={`text-center space-y-6 max-w-4xl mx-auto ${mounted ? 'animate-fade-in' : ''}`}>
            
            {/* Construction Icons */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <span 
                className="text-6xl inline-block"
                style={{ 
                  animation: 'spin 4s linear infinite',
                  filter: 'drop-shadow(0 4px 12px var(--primary-500))'
                }}
              >
                ⚙️
              </span>
              <span 
                className="text-6xl inline-block"
                style={{ 
                  animation: 'hammer 1.5s ease-in-out infinite',
                  filter: 'drop-shadow(0 4px 12px var(--primary-400))'
                }}
              >
                🔨
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl lg:text-6xl font-bold text-primary leading-tight">
              Contests Coming Soon
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-secondary leading-relaxed max-w-2xl mx-auto">
              We&apos;re building the ultimate competitive programming experience. 
              Get ready for real-time contests, leaderboards, and time challenges.
            </p>

            {/* Status Badge */}
            <div className="flex justify-center my-8">
              <div className="inline-flex items-center bg-success-light border border-success px-4 py-2 rounded-full">
                <div 
                  className="w-2.5 h-2.5 bg-success rounded-full mr-3"
                  style={{ 
                    boxShadow: '0 0 10px var(--success-500)',
                    animation: 'pulse 2s infinite'
                  }}
                />
                <span className="text-success text-sm font-semibold tracking-wide">
                  IN DEVELOPMENT
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Progress Section */}
        <section className="card mb-12 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary">Development Progress</h2>
            <span className="text-2xl font-bold text-brand font-mono">
              {progress.toFixed(0)}%
            </span>
          </div>
          
          <div className="relative w-full h-3 bg-secondary rounded-full overflow-hidden border border-primary mb-4">
            <div 
              className="h-full bg-brand rounded-full transition-all duration-500"
              style={{ 
                width: `${progress}%`,
                boxShadow: '0 0 10px var(--primary-500)'
              }}
            >
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  animation: 'shimmer 2s ease-in-out infinite'
                }}
              />
            </div>
          </div>
          
          <p className="text-sm text-tertiary text-center italic">
            Building the ultimate competitive programming experience
          </p>
        </section>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { 
              icon: '🏆', 
              title: 'Live Contests', 
              desc: 'Participate in real-time competitive programming challenges with developers worldwide',
              color: 'var(--primary-500)'
            },
            { 
              icon: '📊', 
              title: 'Global Leaderboards', 
              desc: 'Track your ranking, compare with peers, and climb to the top of the leaderboard',
              color: 'var(--primary-500)'
            },
            { 
              icon: '⏱️', 
              title: 'Time Challenges', 
              desc: 'Test your speed and accuracy with time-bound problems and instant feedback',
              color: 'var(--primary-500)'
            }
          ].map((feature, idx) => (
            <div 
              key={idx}
              className="card interactive bg-elevated hover:shadow-lg transition-all"
              style={{
                animationDelay: `${idx * 100}ms`
              }}
            >
              <div className="text-center">
                <div 
                  className="text-5xl mb-4"
                  style={{
                    filter: `drop-shadow(0 4px 8px ${feature.color})`
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-secondary leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* What to Expect Section */}
        <section className="card mb-12 animate-fade-in">
          <h2 className="text-2xl font-bold text-primary mb-6">What to Expect</h2>
          
          <div className="space-y-4">
            {[
              { 
                label: 'Weekly Contests', 
                desc: 'Compete every week with problems ranging from easy to hard difficulty' 
              },
              { 
                label: 'Rating System', 
                desc: 'Earn rating points based on your performance and problem-solving speed' 
              },
              { 
                label: 'Virtual Contests', 
                desc: 'Practice with past contests at your own pace and timing' 
              },
              { 
                label: 'Editorial Solutions', 
                desc: 'Learn from detailed explanations and optimal approaches after each contest' 
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="flex items-start space-x-4 p-4 bg-secondary rounded-lg hover:bg-tertiary transition-colors"
              >
                <div className="w-2 h-2 bg-brand rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-primary mb-1">{item.label}</h3>
                  <p className="text-sm text-secondary">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

    
        {/* <section className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-primary">
            Want to be notified when contests launch?
          </h2>
          <p className="text-secondary max-w-2xl mx-auto">
            Join our mailing list to get early access to contests, exclusive problems, 
            and be the first to know when we go live.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="btn-primary px-8 py-3 text-lg">
              Get Early Access
            </button>
            <button className="btn-secondary px-8 py-3 text-lg">
              View Roadmap
            </button>
          </div>
          <div className="pt-8">
            <p className="text-sm text-tertiary mb-4">Join 10,000+ developers waiting for launch</p>
            <div className="flex justify-center items-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-white font-semibold shadow-md"
                  style={{
                    marginLeft: i > 0 ? '-8px' : '0',
                    zIndex: 5 - i
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              <span className="text-sm text-secondary ml-4">+9,995 more</span>
            </div>
          </div>
        </section> */}
      </div>

      {/* Footer */}
      <Footer />

      {/* Animations */}
      <style jsx>{`
        @keyframes hammer {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(-25deg) scale(1.05); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.6;
            transform: scale(0.9);
          }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
