import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Game {
  id: string;
  name: string;
  entry_fee: number;
  total_rounds: number;
  current_round: number;
  start_time: string | null;
  prize_pool: number;
  is_locked: boolean;
  is_completed: boolean;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setGames(data || []);
      } catch (error: any) {
        console.error('Error fetching games:', error.message);
      } finally {
        setLoading(false);
      }
    };

    const checkAdminStatus = async () => {
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
        console.error('Error checking admin status:', error.message);
      }
    };

    fetchGames();
    checkAdminStatus();
  }, [user]);

  const GameCard: React.FC<{ game: Game }> = ({ game }) => {
    return (
      <Card
        className="bg-theSplit-navy/80 border-theSplit-teal/20 text-theSplit-white hover:scale-105 transition-transform cursor-pointer"
        onClick={() => navigate(`/game/${game.id}`)}
      >
        <CardHeader>
          <CardTitle className="text-xl text-gradient">{game.name}</CardTitle>
          <CardDescription className="text-theSplit-light/70">
            {game.is_completed
              ? 'This game is completed.'
              : game.is_locked
                ? 'This game is locked.'
                : `Round ${game.current_round} of ${game.total_rounds}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-theSplit-light">
            Entry Fee: ${game.entry_fee}
            <br />
            Prize Pool: ${game.prize_pool}
          </div>
        </CardContent>
        <CardFooter className="flex items-center">
          <Button onClick={(e) => {
            e.stopPropagation();
            navigate(`/game/${game.id}`);
          }}
            className="bg-theSplit-teal hover:bg-theSplit-aqua text-theSplit-navy"
          >
            View Game
          </Button>
          {isAdmin && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/game/${game.id}`);
              }}
              variant="outline"
              size="sm"
              className="ml-auto border-theSplit-teal/50 text-theSplit-aqua hover:bg-theSplit-teal/10"
            >
              Manage Game
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-theSplit-navy text-theSplit-white">
      <Header />
      <div className="container mx-auto pt-32 pb-20 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Welcome to The Split, {user?.email}!
          </h1>
          <p className="text-theSplit-light/70">
            Here are the active prediction games you can join.
          </p>
          {isAdmin && (
            <Button
              onClick={() => navigate('/admin/game/create')}
              className="mt-4 bg-theSplit-teal hover:bg-theSplit-aqua text-theSplit-navy"
            >
              Create New Game
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              <Skeleton className="w-full h-48" />
              <Skeleton className="w-full h-48" />
              <Skeleton className="w-full h-48" />
            </>
          ) : games.length > 0 ? (
            games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))
          ) : (
            <div className="text-center text-theSplit-light/70 col-span-full">
              No games available. Check back later!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
