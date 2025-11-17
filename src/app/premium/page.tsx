"use client";
import PayButton from "./PayButton";
import { useSelector } from "react-redux";
import { RootState } from "../problems/utils/types";
import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import Footer from "../components/Footer";

export default function PremiumPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const animationFrameRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);

  // Continuous side cannons confetti effect
  useEffect(() => {
    if (user?.subscriptionType === 'premium') {
      const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
      
      const frame = () => {
        // Reset end time every 3 seconds to keep it continuous
        if (!endTimeRef.current || Date.now() > endTimeRef.current) {
          endTimeRef.current = Date.now() + 3000; // 3 seconds
        }

        // Fire confetti from both sides
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          startVelocity: 60,
          origin: { x: 0, y: 0.5 },
          colors: colors,
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          startVelocity: 60,
          origin: { x: 1, y: 0.5 },
          colors: colors,
        });

        // Continue the animation
        animationFrameRef.current = requestAnimationFrame(frame);
      };

      // Start the animation
      frame();

      // Cleanup function to stop animation when component unmounts
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [user?.subscriptionType]);

  if (user?.subscriptionType === 'premium') {
    return (
      <div className="min-h-screen bg-primary relative overflow-hidden">
        <section className="bg-elevated border-b border-primary">
          <div className="max-w-7xl mx-auto px-6 py-24 text-center relative">
            <div className="animate-fade-in animate-scale-up">
              <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
                🎉 You are already a <span className="text-brand">TrueCode Premium</span> user!
              </h1>
              <p className="text-xl text-secondary max-w-3xl mx-auto animate-bounce-slow mb-8">
                Unlock unlimited access to premium problems, and advanced features to accelerate your coding journey.
              </p>

              {/* Premium Features List */}
              <ul className="max-w-3xl mx-auto text-left space-y-4 text-primary text-lg animate-fade-in">
                <li className="flex items-center space-x-3">
                  <span className="text-success text-2xl">✓</span>
                  <span>Able to access all Premium Problems</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-success text-2xl">✓</span>
                  <span>Able to access Problem Editorial sections</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-success text-2xl">✓</span>
                  <span>Can add up to 20 discussions per hour for a problem</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-success text-2xl">✓</span>
                  <span>Filter and view problems by company</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <Footer></Footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header Section */}
      <section className="bg-elevated border-b border-primary">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
              Upgrade to <span className="text-brand">TrueCode Premium</span>
            </h1>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Unlock unlimited access to premium problems, detailed solutions, and advanced features to accelerate your coding journey.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Monthly Plan */}
          <div className="card relative animate-slide-up hover:transform hover:scale-105 transition-all duration-300">
            <div className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-primary mb-2">Monthly Plan</h3>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-4xl font-bold text-brand">₹1</span>
                  <span className="text-secondary ml-2">/month</span>
                </div>
                <p className="text-secondary">Perfect for getting started</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <span className="text-success text-xl">✓</span>
                  <span className="text-primary">Access to premium problems</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-success text-xl">✓</span>
                  <span className="text-primary">Detailed solution explanations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-success text-xl">✓</span>
                  <span className="text-primary">Priority support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-success text-xl">✓</span>
                  <span className="text-primary">Ad-free experience</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-success text-xl">✓</span>
                  <span className="text-primary">Progress tracking</span>
                </div>
              </div>

              <PayButton plan="monthly" />
            </div>
          </div>

          {/* Yearly Plan - Popular */}
          <div className="card relative animate-slide-up hover:transform hover:scale-105 transition-all duration-300 border-2 border-brand">
            {/* Popular Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-brand text-inverse px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-primary mb-2">Yearly Plan</h3>
                <div className="flex items-center justify-center mb-2">
                  <span className="text-4xl font-bold text-brand">₹6</span>
                  <span className="text-secondary ml-2">/year</span>
                </div>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-sm text-tertiary line-through mr-2">₹12</span>
                  <span className="bg-success text-white px-2 py-1 rounded text-xs font-medium">
                    Save 50%
                  </span>
                </div>
                <p className="text-secondary">Best value for serious learners</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <span className="text-success text-xl">✓</span>
                  <span className="text-primary">Everything in Monthly</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-success text-xl">✓</span>
                  <span className="text-primary">Interview preparation kit</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-success text-xl">✓</span>
                  <span className="text-primary">Company-specific problems</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-success text-xl">✓</span>
                  <span className="text-primary">Mock interview sessions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-success text-xl">✓</span>
                  <span className="text-primary">Premium community access</span>
                </div>
              </div>

              <PayButton plan="yearly" />
            </div>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="mt-16 animate-fade-in">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">
            Why Choose Premium?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-brand text-inverse w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Accelerated Learning</h3>
              <p className="text-secondary">
                Access to premium problems and detailed solutions to fast-track your coding skills.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-brand text-inverse w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💼</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Interview Ready</h3>
              <p className="text-secondary">
                Company-specific problems and mock interviews to prepare you for top tech companies.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-brand text-inverse w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Track Progress</h3>
              <p className="text-secondary">
                Detailed analytics and progress tracking to monitor your improvement over time.
              </p>
            </div>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-16 text-center animate-fade-in">
          <div className="card bg-elevated max-w-2xl mx-auto p-8">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-3">🛡️</span>
              <h3 className="text-2xl font-bold text-primary">30-Day Money Back Guarantee</h3>
            </div>
            <p className="text-secondary">
              Try TrueCode Premium risk-free. If you&apos;re not satisfied within 30 days, 
              we&apos;ll refund your money, no questions asked.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
