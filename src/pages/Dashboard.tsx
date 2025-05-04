
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  const { user, signOut, isLoading } = useAuth();

  // If user is not logged in, redirect to sign in page
  if (!user && !isLoading) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="min-h-screen bg-theSplit-navy text-theSplit-white">
      <Header />
      <div className="container mx-auto pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-xl p-8 relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-theSplit-teal to-theSplit-aqua rounded-xl blur-sm opacity-30 -z-10"></div>
            
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <Button 
                onClick={() => signOut()} 
                variant="outline" 
                className="border-theSplit-teal text-theSplit-aqua hover:bg-theSplit-teal/10"
              >
                Sign Out
              </Button>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gradient">Welcome!</h2>
              <p className="text-theSplit-light">
                This is your personal dashboard where you can track your predictions, view active games, and manage your account.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-theSplit-navy/50 border border-theSplit-teal/20 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-3">Your Active Games</h3>
                <p className="text-theSplit-light/70 text-sm">
                  You haven't joined any games yet. Browse available games to get started.
                </p>
              </div>
              
              <div className="bg-theSplit-navy/50 border border-theSplit-teal/20 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-3">Your Statistics</h3>
                <p className="text-theSplit-light/70 text-sm">
                  Join your first game to start building your prediction statistics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
