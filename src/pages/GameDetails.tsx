import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { formatDistanceToNow, format, isPast } from 'date-fns';
import { Calendar, Users, TrendingUp, Award, Lock } from 'lucide-react';

const GameDetails: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchGameDetails = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('id', gameId)
          .single();

        if (error) throw error;
        
        // Check if start time has passed and update is_locked if needed
        if (data.start_time && !data.is_locked && isPast(new Date(data.start_time))) {
          // Set is_locked to true if the start time has passed
          const { error: updateError } = await supabase
            .from('games')
            .update({ is_locked: true })
            .eq('id', gameId);
          
          if (updateError) {
            console.error('Error updating game locked status:', updateError.message);
          } else {
            data.is_locked = true;
          }
        }
        
        setGame(data);

        // Check if user has already joined this game
        const { data: userGameData, error: userGameError } = await supabase
          .from('user_games')
          .select('id')
          .eq('user_id', user.id)
          .eq('game_id', gameId)
          .maybeSingle();

        if (userGameError && userGameError.code !== 'PGRST116') throw userGameError;
        setHasJoined(!!userGameData);
      } catch (error: any) {
        console.error('Error fetching game details:', error.message);
        toast.error('Failed to load game details');
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [gameId, user, navigate]);

  const handleJoinGame = async () => {
    if (!user || !game) return;

    try {
      setJoining(true);
      
      const { error } = await supabase
        .from('user_games')
        .insert({
          user_id: user.id,
          game_id: game.id,
          status: 'active'
        });
        
      if (error) throw error;
      
      toast.success('Successfully joined the game!');
      setHasJoined(true);
      
      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Error joining game:', error.message);
      toast.error('Failed to join game');
    } finally {
      setJoining(false);
    }
  };

  // Format prize pool and entry fee
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Check if start time has passed
  const isStartTimePassed = (startTime: string | null) => {
    if (!startTime) return false;
    return isPast(new Date(startTime));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-theSplit-navy text-theSplit-white">
        <Header />
        <div className="container mx-auto pt-32 pb-20 px-4">
          <div className="flex justify-center items-center min-h-[50vh]">
            <p className="text-theSplit-light/70">Loading game details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-theSplit-navy text-theSplit-white">
        <Header />
        <div className="container mx-auto pt-32 pb-20 px-4">
          <div className="flex flex-col justify-center items-center min-h-[50vh]">
            <p className="text-xl text-theSplit-light/70 mb-4">Game not found</p>
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="bg-theSplit-teal hover:bg-theSplit-aqua text-theSplit-navy"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theSplit-navy text-theSplit-white">
      <Header />
      <div className="container mx-auto pt-32 pb-20 px-4">
        <Button 
          onClick={() => navigate('/dashboard')} 
          variant="outline"
          className="mb-6 border-theSplit-teal/50 text-theSplit-aqua hover:bg-theSplit-teal/10"
        >
          ← Back to Dashboard
        </Button>

        <div className="max-w-2xl mx-auto">
          <div className="glass-card rounded-xl p-8 relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-theSplit-teal to-theSplit-aqua rounded-xl blur-sm opacity-30 -z-10"></div>
            
            <h1 className="text-3xl font-bold mb-2 text-gradient">{game.name}</h1>

            {game.description && (
              <p className="text-theSplit-light/80 mb-8">{game.description}</p>
            )}

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-theSplit-navy/70 border border-theSplit-teal/20 rounded-lg p-4 flex items-center">
                  <div className="bg-theSplit-teal/20 rounded-full p-3 mr-4">
                    <Calendar className="text-theSplit-aqua" />
                  </div>
                  <div>
                    <p className="text-sm text-theSplit-light/70">Start Time</p>
                    <p className="text-lg">
                      {game.start_time ? (
                        <>
                          {format(new Date(game.start_time), "PPP 'at' p")}
                          <span className="block text-sm text-theSplit-light/70">
                            {formatDistanceToNow(new Date(game.start_time), { addSuffix: true })}
                          </span>
                          {isStartTimePassed(game.start_time) && (
                            <span className="block text-xs text-red-400 mt-1">
                              Game has already started
                            </span>
                          )}
                        </>
                      ) : (
                        'Not scheduled'
                      )}
                    </p>
                  </div>
                </div>

                <div className="bg-theSplit-navy/70 border border-theSplit-teal/20 rounded-lg p-4 flex items-center">
                  <div className="bg-theSplit-teal/20 rounded-full p-3 mr-4">
                    <Users className="text-theSplit-aqua" />
                  </div>
                  <div>
                    <p className="text-sm text-theSplit-light/70">Entry Fee</p>
                    <p className="text-lg">{formatCurrency(game.entry_fee)}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-theSplit-navy/70 border border-theSplit-teal/20 rounded-lg p-4 flex items-center">
                  <div className="bg-theSplit-teal/20 rounded-full p-3 mr-4">
                    <TrendingUp className="text-theSplit-aqua" />
                  </div>
                  <div>
                    <p className="text-sm text-theSplit-light/70">Prize Pool</p>
                    <p className="text-lg">{formatCurrency(game.prize_pool)}</p>
                  </div>
                </div>

                <div className="bg-theSplit-navy/70 border border-theSplit-teal/20 rounded-lg p-4 flex items-center">
                  <div className="bg-theSplit-teal/20 rounded-full p-3 mr-4">
                    <Award className="text-theSplit-aqua" />
                  </div>
                  <div>
                    <p className="text-sm text-theSplit-light/70">Number of Rounds</p>
                    <p className="text-lg">{game.total_rounds}</p>
                  </div>
                </div>
              </div>

              <div className="bg-theSplit-navy/70 border border-theSplit-teal/20 rounded-lg p-6 mt-8">
                <h2 className="text-xl font-semibold mb-4">Ready to play?</h2>
                
                {game.is_locked || isStartTimePassed(game.start_time) ? (
                  <div className="flex items-center text-red-400 mb-4">
                    <Lock className="w-5 h-5 mr-2" />
                    <p>
                      {isStartTimePassed(game.start_time) ? 
                        'This game has already started and is no longer accepting new participants.' : 
                        'This game is currently locked and cannot be joined at this time.'}
                    </p>
                  </div>
                ) : (
                  <p className="text-theSplit-light/80 mb-4">
                    Join this game to compete with other players and win the prize pool!
                  </p>
                )}
                
                <Button 
                  onClick={handleJoinGame}
                  disabled={hasJoined || joining || game.is_locked || isStartTimePassed(game.start_time)}
                  className="w-full bg-theSplit-teal hover:bg-theSplit-aqua text-theSplit-navy disabled:opacity-50 mb-4"
                >
                  {hasJoined ? 'Already Joined' : 
                   joining ? 'Joining...' : 
                   game.is_locked || isStartTimePassed(game.start_time) ? 'Registration Closed' : 'Join Game'}
                </Button>
                
                {hasJoined && (
                  <>
                    <p className="text-center text-green-400 text-sm mb-4">
                      You have already joined this game
                    </p>
                    <Button 
                      onClick={() => navigate(`/game/${gameId}/question`)}
                      className="w-full bg-theSplit-aqua/30 hover:bg-theSplit-aqua/50 text-theSplit-white border border-theSplit-aqua/50"
                    >
                      Go to Current Question
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
