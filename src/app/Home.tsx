// app/page.tsx or wherever your home component is
'use client';

import { useSelector } from 'react-redux';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);
  console.log("Authentication Check in Home Component:", isAuthenticated);

  const problems = [
    { id: 1, title: "Two Sum", difficulty: "Easy", acceptance: "54.2%", tags: ["Array", "Hash Table"] },
    { id: 2, title: "Add Two Numbers", difficulty: "Medium", acceptance: "38.9%", tags: ["Linked List", "Math"] },
    { id: 3, title: "Longest Substring", difficulty: "Medium", acceptance: "35.1%", tags: ["String", "Sliding Window"] },
    { id: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", acceptance: "37.4%", tags: ["Array", "Binary Search"] },
    { id: 5, title: "Longest Palindromic Substring", difficulty: "Medium", acceptance: "32.8%", tags: ["String", "Dynamic Programming"] },
  ];

  const stats = [
    { label: "Problems Solved", value: "247", change: "+12 this week" },
    { label: "Contest Rating", value: "1,842", change: "+45 this month" },
    { label: "Acceptance Rate", value: "68.3%", change: "+2.1% this week" },
  ];

  const recentSubmissions = [
    { problem: "Binary Tree Inorder Traversal", status: "Accepted", time: "2 hours ago", language: "JavaScript" },
    { problem: "Valid Parentheses", status: "Accepted", time: "1 day ago", language: "Python" },
    { problem: "Merge Two Sorted Lists", status: "Time Limit Exceeded", time: "2 days ago", language: "Java" },
  ];

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <section className="bg-elevated">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl lg:text-5xl font-bold text-primary leading-tight">
                {isAuthenticated && user ? (
                  <>Welcome back, {user.firstName}!</>
                ) : (
                  <>A New Way to Learn</>
                )}
              </h1>
              <p className="text-xl text-secondary leading-relaxed">
                {isAuthenticated && user ? (
                  <>Ready to solve some problems? Let's continue your coding journey.</>
                ) : (
                  <>TrueCode is the best platform to help you enhance your skills, expand your knowledge and prepare for technical interviews.</>
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary px-8 py-3 text-lg">
                  {isAuthenticated ? 'Continue Coding' : 'Start Coding Now'}
                </button>
                <button className="btn-secondary px-8 py-3 text-lg">
                  View Problems
                </button>
              </div>
            </div>
            
            <div className="relative animate-slide-up">
              <div className="card p-8 glass">
                <h3 className="text-lg font-semibold text-primary mb-4">💻 Code Challenge</h3>
                <div className="bg-secondary rounded-lg p-4 font-mono text-sm">
                  <div className="text-success mb-2">// Example: Two Sum Problem</div>
                  <div className="text-primary">
                    <span className="text-brand">function</span> twoSum(nums, target) {"{"}
                  </div>
                  <div className="text-primary ml-4">
                    <span className="text-brand">const</span> map = <span className="text-brand">new</span> Map();
                  </div>
                  <div className="text-primary ml-4">
                    <span className="text-brand">for</span> (<span className="text-brand">let</span> i = 0; i {"<"} nums.length; i++) {"{"}
                  </div>
                  <div className="text-primary ml-8">
                    <span className="text-brand">return</span> [map.get(complement), i];
                  </div>
                  <div className="text-primary ml-4">{"}"}</div>
                  <div className="text-primary">{"}"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Problems Section */}
          <section className="card animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary">Trending Problems</h2>
              <button className="text-brand hover:text-brand-hover transition-colors">View All →</button>
            </div>
            
            <div className="space-y-4">
              {problems.map((problem, index) => (
                <div key={problem.id} className="interactive bg-secondary rounded-lg p-4 hover:bg-tertiary transition-all border border-primary">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-tertiary font-medium text-sm w-8">{problem.id}.</span>
                      <div>
                        <h3 className="font-semibold text-primary hover:text-brand cursor-pointer">
                          {problem.title}
                        </h3>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            problem.difficulty === 'Easy' ? 'bg-success text-white' :
                            problem.difficulty === 'Medium' ? 'bg-warning text-white' :
                            'bg-error text-white'
                          }`}>
                            {problem.difficulty}
                          </span>
                          <span className="text-tertiary text-sm">{problem.acceptance}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {problem.tags.map(tag => (
                        <span key={tag} className="bg-primary border border-primary px-2 py-1 rounded text-xs text-secondary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section className="card animate-fade-in">
            <h2 className="text-2xl font-bold text-primary mb-6">Recent Submissions</h2>
            <div className="space-y-3">
              {recentSubmissions.map((submission, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      submission.status === 'Accepted' ? 'bg-success' : 'bg-error'
                    }`}></div>
                    <div>
                      <p className="font-medium text-primary">{submission.problem}</p>
                      <p className="text-sm text-tertiary">{submission.language} • {submission.time}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    submission.status === 'Accepted' ? 'bg-success-light text-success' : 'bg-error-light text-error'
                  }`}>
                    {submission.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          
          {/* User Stats */}
          <section className="card animate-slide-up">
            <h3 className="text-lg font-semibold text-primary mb-4">
              {isAuthenticated && user ? 'Your Progress' : 'Sample Progress'}
            </h3>
            <div className="space-y-4">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-secondary text-sm">{stat.label}</span>
                    <span className="text-success text-xs">{stat.change}</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Links */}
          <section className="card animate-slide-up">
            <h3 className="text-lg font-semibold text-primary mb-4">Quick Access</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-secondary hover:bg-tertiary rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <p className="font-medium text-primary">Daily Challenge</p>
                    <p className="text-sm text-secondary">Solve today's problem</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left p-3 bg-secondary hover:bg-tertiary rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <p className="font-medium text-primary">Study Plan</p>
                    <p className="text-sm text-secondary">Algorithm fundamentals</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left p-3 bg-secondary hover:bg-tertiary rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="font-medium text-primary">Contests</p>
                    <p className="text-sm text-secondary">Weekly Contest 420</p>
                  </div>
                </div>
              </button>
            </div>
          </section>

          {/* Premium Upgrade */}
          <section className="card bg-brand text-inverse animate-slide-up">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Upgrade to Premium</h3>
              <p className="text-sm opacity-90 mb-4">
                Access premium features, detailed solutions, and interview preparation tools.
              </p>
              <button className="w-full bg-white text-brand py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Start Free Trial
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-secondary border-t border-primary mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold text-primary mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-secondary hover:text-brand">About</a></li>
                <li><a href="#" className="text-secondary hover:text-brand">Careers</a></li>
                <li><a href="#" className="text-secondary hover:text-brand">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-3">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-secondary hover:text-brand">Blog</a></li>
                <li><a href="#" className="text-secondary hover:text-brand">Help Center</a></li>
                <li><a href="#" className="text-secondary hover:text-brand">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-3">Community</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-secondary hover:text-brand">Discord</a></li>
                <li><a href="#" className="text-secondary hover:text-brand">Reddit</a></li>
                <li><a href="#" className="text-secondary hover:text-brand">Twitter</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-secondary hover:text-brand">Privacy</a></li>
                <li><a href="#" className="text-secondary hover:text-brand">Terms</a></li>
                <li><a href="#" className="text-secondary hover:text-brand">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary mt-8 pt-8 text-center">
            <p className="text-secondary text-sm">
              © 2025 TrueCode Clone. Built with modern design system.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
