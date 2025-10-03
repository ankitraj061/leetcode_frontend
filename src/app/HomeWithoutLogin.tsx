import Link from 'next/link';
import { ThemeToggle } from '@/app/components/themeToggle';

export default function HomeWithoutLogin() {
  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="bg-elevated border-b border-primary sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TC</span>
              </div>
              <span className="text-xl font-bold text-primary">TrueCode</span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a 
                href="#explore" 
                className="text-secondary hover:text-brand transition-colors cursor-pointer"
              >
                Explore
              </a>
              <a 
                href="#features" 
                className="text-secondary hover:text-brand transition-colors cursor-pointer"
              >
                Features
              </a>
              <a 
                href="#developers" 
                className="text-secondary hover:text-brand transition-colors cursor-pointer"
              >
                Developers
              </a>
            </nav>
            
            {/* Auth & Theme */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/accounts/login" className="btn-secondary">
                Login
              </Link>
              <Link href="/accounts/signup" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight">
              Master Coding with{' '}
              <span className="text-brand">TrueCode</span>
            </h1>
            <p className="text-xl md:text-2xl text-secondary mb-8 max-w-4xl mx-auto leading-relaxed">
              The ultimate platform to enhance your programming skills, prepare for technical interviews, 
              and solve challenging problems with a community of developers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/accounts/signup" className="btn-primary px-8 py-4 text-lg font-semibold">
                Start Coding Free
              </Link>
              <Link href="/accounts/login" className="btn-secondary px-8 py-4 text-lg font-semibold">
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-brand mb-2">1000+</div>
                <div className="text-secondary">Coding Problems</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brand mb-2">50K+</div>
                <div className="text-secondary">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brand mb-2">95%</div>
                <div className="text-secondary">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Section */}
      <section id="explore" className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Explore Our Platform</h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Discover a world of coding challenges, from beginner-friendly problems to advanced algorithms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Problem Categories */}
            <div className="card interactive">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-primary mb-3">Problem Categories</h3>
              <p className="text-secondary mb-4">
                Array, String, Dynamic Programming, Graph, Tree, and more specialized topics
              </p>
              <Link href="/accounts/signup" className="text-brand hover:text-brand-hover font-medium">
                Start Solving →
              </Link>
            </div>

            {/* Difficulty Levels */}
            <div className="card interactive">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-primary mb-3">Difficulty Levels</h3>
              <p className="text-secondary mb-4">
                Easy, Medium, and Hard problems with detailed explanations and multiple solutions
              </p>
              <Link href="/accounts/signup" className="text-brand hover:text-brand-hover font-medium">
                View Problems →
              </Link>
            </div>

            {/* Contests */}
            <div className="card interactive">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-primary mb-3">Weekly Contests</h3>
              <p className="text-secondary mb-4">
                Participate in weekly coding contests and compete with developers worldwide
              </p>
              <Link href="/accounts/signup" className="text-brand hover:text-brand-hover font-medium">
                Join Contest →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Powerful Features</h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Everything you need to become a better programmer, all in one place
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Feature 1 */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-brand rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">💻</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">Online Code Editor</h3>
                  <p className="text-secondary">
                    Write, run, and debug code in multiple programming languages with our powerful online IDE
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">📈</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">Progress Tracking</h3>
                  <p className="text-secondary">
                    Track your progress with detailed analytics and performance insights
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">💡</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">Hints & Solutions</h3>
                  <p className="text-secondary">
                    Get hints when stuck and explore multiple solution approaches with explanations
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Visual */}
            <div className="bg-elevated rounded-xl p-8 shadow-lg">
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
                  <span className="text-brand">const</span> complement = target - nums[i];
                </div>
                <div className="text-primary ml-8">
                  <span className="text-brand">if</span> (map.has(complement)) {"{"}
                </div>
                <div className="text-primary ml-12">
                  <span className="text-brand">return</span> [map.get(complement), i];
                </div>
                <div className="text-primary ml-8">{"}"}</div>
                <div className="text-primary ml-8">map.set(nums[i], i);</div>
                <div className="text-primary ml-4">{"}"}</div>
                <div className="text-primary">{"}"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developers Section */}
      <section id="developers" className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">For Developers, By Developers</h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Built with modern technologies and designed for the developer community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Fast & Reliable</h3>
              <p className="text-secondary">
                Lightning-fast code execution with 99.9% uptime guarantee
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Secure</h3>
              <p className="text-secondary">
                Enterprise-grade security with encrypted data and secure code execution
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-success rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Global Community</h3>
              <p className="text-secondary">
                Connect with developers worldwide and learn from each other
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-elevated rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-semibold text-primary text-center mb-8">Built With Modern Tech</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl mb-2">⚛️</div>
                <span className="text-secondary">React</span>
              </div>
              <div>
                <div className="text-3xl mb-2">🟢</div>
                <span className="text-secondary">Node.js</span>
              </div>
              <div>
                <div className="text-3xl mb-2">🍃</div>
                <span className="text-secondary">MongoDB</span>
              </div>
              <div>
                <div className="text-3xl mb-2">🔗</div>
                <span className="text-secondary">GraphQL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-primary mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-secondary mb-8">
            Join thousands of developers who are already improving their skills with TrueCode
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/accounts/signup" className="btn-primary px-8 py-4 text-lg font-semibold">
              Create Free Account
            </Link>
            <Link href="/accounts/login" className="btn-secondary px-8 py-4 text-lg font-semibold">
              Sign In
            </Link>
          </div>

          <p className="text-tertiary text-sm">
            No credit card required • Free forever • Start coding in seconds
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-elevated border-t border-primary py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TC</span>
                </div>
                <span className="text-xl font-bold text-primary">TrueCode</span>
              </div>
              <p className="text-secondary mb-4 max-w-md">
                Empowering developers worldwide with the best coding practice platform. 
                Master algorithms, ace interviews, and grow your career.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-primary mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#explore" className="text-secondary hover:text-brand">Problems</a></li>
                <li><a href="#features" className="text-secondary hover:text-brand">Contests</a></li>
                <li><a href="#developers" className="text-secondary hover:text-brand">Discuss</a></li>
                <li><Link href="/accounts/signup" className="text-secondary hover:text-brand">Get Started</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-primary mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#developers" className="text-secondary hover:text-brand">About</a></li>
                <li><a href="#" className="text-secondary hover:text-brand">Careers</a></li>
                <li><a href="#" className="text-secondary hover:text-brand">Privacy</a></li>
                <li><a href="#" className="text-secondary hover:text-brand">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary mt-8 pt-8 text-center">
            <p className="text-tertiary text-sm">
              © 2025 TrueCode. Built with modern design system and love for developers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
