
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Split expenses <span className="text-gradient">effortlessly</span> with friends
            </h1>
            <p className="text-xl text-theSplit-light max-w-lg">
              The simplest way to track shared expenses and settle debts with friends, roommates, and partners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="bg-theSplit-teal hover:bg-theSplit-aqua text-theSplit-white h-12 px-8 button-glow">
                Get Started Free
              </Button>
              <Button variant="outline" className="border-theSplit-teal text-theSplit-aqua hover:bg-theSplit-teal/10 h-12 px-8">
                How it Works <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="pt-8 text-theSplit-light/80 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(idx => (
                  <div 
                    key={idx} 
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-theSplit-teal to-theSplit-aqua border-2 border-theSplit-navy flex items-center justify-center text-xs font-medium"
                  >
                    {idx}
                  </div>
                ))}
              </div>
              <span>Trusted by 10,000+ friends & roommates</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-theSplit-teal to-theSplit-aqua rounded-2xl blur-sm opacity-50"></div>
            <div className="glass-card rounded-2xl p-1 relative">
              <div className="overflow-hidden rounded-xl">
                <div className="bg-theSplit-navy rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-theSplit-white font-medium">House Expenses</h3>
                    <span className="text-theSplit-aqua font-semibold">May 2025</span>
                  </div>
                  
                  {/* Expense Items */}
                  {[
                    { name: "Grocery Shopping", amount: "$87.50", payer: "You", date: "May 2" },
                    { name: "Internet Bill", amount: "$65.00", payer: "Alex", date: "May 5" },
                    { name: "Utilities", amount: "$130.75", payer: "Taylor", date: "May 8" }
                  ].map((expense, idx) => (
                    <div 
                      key={idx} 
                      className={`p-4 rounded-lg ${idx % 2 === 0 ? 'bg-theSplit-teal/10' : 'bg-theSplit-teal/5'} flex justify-between items-center`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-theSplit-white">{expense.name}</span>
                        <span className="text-sm text-theSplit-light/70">
                          Paid by {expense.payer} • {expense.date}
                        </span>
                      </div>
                      <span className="font-semibold text-theSplit-aqua">{expense.amount}</span>
                    </div>
                  ))}
                  
                  <div className="pt-4">
                    <Button className="w-full bg-theSplit-teal hover:bg-theSplit-aqua text-theSplit-white">
                      Add Expense
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
