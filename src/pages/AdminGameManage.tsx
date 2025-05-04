
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import AdminAnswerUpdate from '@/components/AdminAnswerUpdate';
import QuestionForm from '@/components/QuestionForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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

const AdminGameManage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<Game | null>(null);
  const [currentTab, setCurrentTab] = useState('answers');
  
  // Check if user is an admin
  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [user]);

  // Fetch game data
  useEffect(() => {
    if (!gameId) return;
    
    const fetchGame = async () => {
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('id', gameId)
          .single();
          
        if (error) throw error;
        setGame(data);
      } catch (error: any) {
        console.error('Error fetching game:', error.message);
        toast.error('Failed to load game data');
      }
    };
    
    fetchGame();
  }, [gameId]);

  const handleRefresh = () => {
    // Refresh game data
    if (gameId) {
      const fetchGame = async () => {
        try {
          const { data, error } = await supabase
            .from('games')
            .select('*')
            .eq('id', gameId)
            .single();
            
          if (error) throw error;
          setGame(data);
        } catch (error: any) {
          console.error('Error fetching game:', error.message);
        }
      };
      
      fetchGame();
    }
  };
  
  // If user is not logged in, redirect to sign in page
  if (!user && !loading) {
    return <Navigate to="/signin" replace />;
  }
  
  // If user is not an admin and we've finished loading, redirect to dashboard
  if (!isAdmin && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  // If game is not found
  if (!loading && !game) {
    return (
      <div className="min-h-screen bg-theSplit-navy text-theSplit-white">
        <Header />
        <div className="container mx-auto pt-32 pb-20 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4 text-theSplit-aqua">Game not found</h1>
          <Button 
            onClick={() => navigate('/dashboard')} 
            className="bg-theSplit-teal hover:bg-theSplit-aqua text-theSplit-navy"
          >
            Back to Dashboard
          </Button>
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

        {game && (
          <>
            <div className="max-w-3xl mx-auto mb-8">
              <h1 className="text-3xl font-bold mb-2 text-gradient">{game.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-theSplit-light">
                <div>Rounds: {game.current_round}/{game.total_rounds}</div>
                <div>Entry Fee: ${game.entry_fee}</div>
                <div>Prize Pool: ${game.prize_pool}</div>
                <div>Status: {game.is_completed ? 'Completed' : game.is_locked ? 'Locked' : 'Active'}</div>
              </div>
            </div>

            <Tabs 
              value={currentTab} 
              onValueChange={setCurrentTab}
              className="max-w-3xl mx-auto"
            >
              <TabsList className="grid w-full grid-cols-2 bg-theSplit-navy/90 border border-theSplit-teal/20">
                <TabsTrigger 
                  value="answers" 
                  className="data-[state=active]:bg-theSplit-teal/20 data-[state=active]:text-theSplit-aqua"
                >
                  Update Answers
                </TabsTrigger>
                <TabsTrigger 
                  value="questions" 
                  className="data-[state=active]:bg-theSplit-teal/20 data-[state=active]:text-theSplit-aqua"
                >
                  Manage Questions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="answers" className="space-y-6">
                <AdminAnswerUpdate 
                  gameId={game.id}
                  currentRound={game.current_round}
                  totalRounds={game.total_rounds}
                  onAnswerUpdated={handleRefresh}
                />
              </TabsContent>

              <TabsContent value="questions" className="space-y-6">
                <Card className="bg-theSplit-navy/80 border-theSplit-teal/20">
                  <CardHeader>
                    <CardTitle className="text-xl text-gradient">Add Questions</CardTitle>
                    <CardDescription className="text-theSplit-light/70">
                      Add or import questions for this game
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <QuestionForm 
                      gameId={game.id} 
                      totalRounds={game.total_rounds}
                      onQuestionAdded={handleRefresh}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminGameManage;
