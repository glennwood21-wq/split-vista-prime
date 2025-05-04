import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';

const Dashboard: React.FC = () => {
  const { user, signOut, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [games, setGames] = useState<any[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [activeGames, setActiveGames] = useState<any[]>([]);
  const [loadingActiveGames, setLoadingActiveGames] = useState(true);

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

  // Fetch available games (not locked and with future start times)
  useEffect(() => {
    const fetchGames = async () => {
      if (!user) return;
      
      try {
        setLoadingGames(true);
        const now = new Date().toISOString();
        
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('is_locked', false)
          .gt('start_time', now)
          .order('start_time', { ascending: true });
          
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

  // Fetch user's active games
  useEffect(() => {
    const fetchActiveGames = async () => {
      if (!user) return;
      
      try {
        setLoadingActiveGames(true);
        const { data, error } = await supabase
          .from('user_games')
          .select(`
            *,
            games:game_id(*)
          `)
          .eq('user_id', user.id);
          
        if (error) throw error;
        setActiveGames(data || []);
      } catch (error: any) {
        console.error('Error fetching active games:', error.message);
        toast.error('Failed to load your active games');
      } finally {
        setLoadingActiveGames(false);
      }
    };
    
    fetchActiveGames();
  }, [user]);

  // Handle game creation
  const handleCreateGame = async () => {
    try {
      // This will be replaced with a modal form in the future
      const { error } = await supabase
        .from('games')
        .insert({
          name: 'New Game ' + new Date().toLocaleDateString(),
          created_by: user!.id,
          entry_fee: 0,
          prize_pool: 100,
          is_locked: false,
          is_completed: false
        });
        
      if (error) throw error;
      
      toast.success('Game created successfully!');
      // Reload games list
      const { data: newGames, error: fetchError } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (fetchError) throw fetchError;
      setGames(newGames || []);
    } catch (error: any) {
      console.error('Error creating game:', error.message);
      toast.error('Failed to create game');
    }
  };

  // Handle joining a game
  const handleJoinGame = async (gameId: string) => {
    try {
      // Check if user is already in this game
      const { data: existingEntry, error: checkError } = await supabase
        .from('user_games')
        .select('id')
        .eq('user_id', user!.id)
        .eq('game_id', gameId)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      
      if (existingEntry) {
        toast.info('You have already joined this game');
        return;
      }
      
      const { error } = await supabase
        .from('user_games')
        .insert({
          user_id: user!.id,
          game_id: gameId,
          status: 'active'
        });
        
      if (error) throw error;
      
      toast.success('Successfully joined the game!');
      // Reload active games
      const { data: newActiveGames, error: fetchError } = await supabase
        .from('user_games')
        .select(`
          *,
          games:game_id(*)
        `)
        .eq('user_id', user!.id);
        
      if (fetchError) throw fetchError;
      setActiveGames(newActiveGames || []);
    } catch (error: any) {
      console.error('Error joining game:', error.message);
      toast.error('Failed to join game');
    }
  };

  // Format prize pool
  const formatPrize = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // If user is not logged in, redirect to sign in page
  if (!user && !isLoading) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="min-h-screen bg-theSplit-navy text-theSplit-white">
      <Header />
      <div className="container mx-auto pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gradient">Available Games</h2>
                {isAdmin && (
                  <Button 
                    onClick={handleCreateGame} 
                    className="bg-theSplit-teal hover:bg-theSplit-aqua text-theSplit-navy"
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
                        <TableHead className="text-theSplit-light">Game Name</TableHead>
                        <TableHead className="text-theSplit-light">Start Time</TableHead>
                        <TableHead className="text-theSplit-light">Entry Fee</TableHead>
                        <TableHead className="text-theSplit-light">Prize Pool</TableHead>
                        <TableHead className="text-theSplit-light">Status</TableHead>
                        <TableHead className="text-theSplit-light text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {games.map((game) => (
                        <TableRow key={game.id}>
                          <TableCell className="font-medium text-theSplit-white">{game.name}</TableCell>
                          <TableCell>
                            {game.start_time ? 
                              formatDistanceToNow(new Date(game.start_time), { addSuffix: true }) : 
                              'Not scheduled'}
                          </TableCell>
                          <TableCell>{formatPrize(game.entry_fee)}</TableCell>
                          <TableCell>{formatPrize(game.prize_pool)}</TableCell>
                          <TableCell>
                            <span className={`inline-block px-2 py-1 rounded text-xs ${
                              game.is_locked ? 'bg-yellow-500/20 text-yellow-400' : 
                              game.is_completed ? 'bg-gray-500/20 text-gray-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {game.is_completed ? 'Completed' : 
                               game.is_locked ? 'Locked' : 'Open'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={game.is_locked || game.is_completed}
                              className="border-theSplit-teal/50 text-theSplit-aqua hover:bg-theSplit-teal/10"
                              onClick={() => handleJoinGame(game.id)}
                            >
                              Join
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
                    {isAdmin ? 'No upcoming games available. Use the Create Game button to add one.' : 'No upcoming games available at the moment.'}
                  </p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-theSplit-navy/50 border border-theSplit-teal/20 text-theSplit-white">
                <CardHeader>
                  <CardTitle className="text-theSplit-white">Your Active Games</CardTitle>
                  <CardDescription className="text-theSplit-light/70">
                    Games you've joined and are currently participating in
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingActiveGames ? (
                    <p className="text-theSplit-light/70">Loading your games...</p>
                  ) : activeGames.length > 0 ? (
                    <div className="space-y-3">
                      {activeGames.map((entry) => (
                        <div 
                          key={entry.id} 
                          className="p-3 rounded-lg bg-theSplit-navy border border-theSplit-teal/20 hover:border-theSplit-teal/60 transition-all"
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">{entry.games?.name}</h3>
                            <span className={`inline-block px-2 py-1 rounded text-xs ${
                              entry.status === 'active' ? 'bg-green-500/20 text-green-400' :
                              entry.status === 'eliminated' ? 'bg-red-500/20 text-red-400' :
                              entry.status === 'winner' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {entry.status}
                            </span>
                          </div>
                          <div className="text-sm text-theSplit-light/70 mt-1">
                            Round {entry.games?.current_round || 1} of {entry.games?.total_rounds || 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-theSplit-light/70">
                      You haven't joined any games yet. Browse available games to get started.
                    </p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full border-theSplit-teal/30 text-theSplit-teal hover:bg-theSplit-teal/10">
                    View All Your Games
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-theSplit-navy/50 border border-theSplit-teal/20 text-theSplit-white">
                <CardHeader>
                  <CardTitle className="text-theSplit-white">Your Statistics</CardTitle>
                  <CardDescription className="text-theSplit-light/70">
                    Your performance in prediction games
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-theSplit-navy/70 border border-theSplit-teal/10 rounded-lg p-4 text-center">
                      <span className="text-2xl font-bold text-theSplit-aqua">0</span>
                      <p className="text-sm text-theSplit-light/70 mt-1">Games Won</p>
                    </div>
                    <div className="bg-theSplit-navy/70 border border-theSplit-teal/10 rounded-lg p-4 text-center">
                      <span className="text-2xl font-bold text-theSplit-aqua">0</span>
                      <p className="text-sm text-theSplit-light/70 mt-1">Games Participated</p>
                    </div>
                    <div className="bg-theSplit-navy/70 border border-theSplit-teal/10 rounded-lg p-4 text-center">
                      <span className="text-2xl font-bold text-theSplit-aqua">$0.00</span>
                      <p className="text-sm text-theSplit-light/70 mt-1">Total Winnings</p>
                    </div>
                    <div className="bg-theSplit-navy/70 border border-theSplit-teal/10 rounded-lg p-4 text-center">
                      <span className="text-2xl font-bold text-theSplit-aqua">0%</span>
                      <p className="text-sm text-theSplit-light/70 mt-1">Win Rate</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full border-theSplit-teal/30 text-theSplit-teal hover:bg-theSplit-teal/10">
                    View Detailed Stats
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
