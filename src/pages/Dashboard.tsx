
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Dashboard: React.FC = () => {
  const { user, signOut, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [games, setGames] = useState<any[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);

  // Fetch user profile to check admin status
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        setIsAdmin(data?.is_admin || false);
      } catch (error: any) {
        console.error('Error fetching profile:', error.message);
      }
    };
    
    fetchProfile();
  }, [user]);

  // Fetch games
  useEffect(() => {
    const fetchGames = async () => {
      if (!user) return;
      
      try {
        setLoadingGames(true);
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setGames(data || []);
      } catch (error: any) {
        console.error('Error fetching games:', error.message);
        toast.error('Failed to load games');
      } finally {
        setLoadingGames(false);
      }
    };
    
    fetchGames();
  }, [user]);

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
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                {isAdmin && (
                  <span className="ml-2 bg-theSplit-teal/20 text-theSplit-aqua text-xs px-2 py-1 rounded">
                    Admin
                  </span>
                )}
              </div>
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
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gradient">Games</h2>
                {isAdmin && (
                  <Button 
                    onClick={() => toast.info('Game creation functionality coming soon!')} 
                    className="bg-theSplit-teal hover:bg-theSplit-aqua text-theSplit-white"
                  >
                    Create Game
                  </Button>
                )}
              </div>
              
              {loadingGames ? (
                <p className="text-theSplit-light/70">Loading games...</p>
              ) : games.length > 0 ? (
                <div className="bg-theSplit-navy/50 border border-theSplit-teal/20 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-theSplit-light">Title</TableHead>
                        <TableHead className="text-theSplit-light">Status</TableHead>
                        <TableHead className="text-theSplit-light text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {games.map((game) => (
                        <TableRow key={game.id}>
                          <TableCell className="font-medium text-theSplit-white">{game.title}</TableCell>
                          <TableCell>
                            <span className={`inline-block px-2 py-1 rounded text-xs ${
                              game.status === 'open' ? 'bg-green-500/20 text-green-400' : 
                              game.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {game.status.replace('_', ' ')}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-theSplit-teal/50 text-theSplit-aqua hover:bg-theSplit-teal/10"
                              onClick={() => toast.info('Game details coming soon!')}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="bg-theSplit-navy/50 border border-theSplit-teal/20 rounded-lg p-6">
                  <p className="text-theSplit-light/70 text-center">
                    {isAdmin ? 'No games created yet. Use the Create Game button to add one.' : 'No games available yet.'}
                  </p>
                </div>
              )}
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
