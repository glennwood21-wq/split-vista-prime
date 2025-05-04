
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { format } from 'date-fns';
import QuestionForm from '@/components/QuestionForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const AdminGameCreate: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState('details');
  const [createdGame, setCreatedGame] = useState<{ id: string, name: string, total_rounds: number } | null>(null);
  
  // Game form state
  const [gameName, setGameName] = useState('');
  const [entryFee, setEntryFee] = useState('0');
  const [totalRounds, setTotalRounds] = useState('3');
  const [startTime, setStartTime] = useState('');
  const [prizePool, setPrizePool] = useState('100');
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !isAdmin) return;
    
    try {
      setSubmitting(true);
      
      // Format the date-time for Postgres
      let formattedStartTime = null;
      if (startTime) {
        formattedStartTime = new Date(startTime).toISOString();
      }
      
      const { data, error } = await supabase
        .from('games')
        .insert({
          name: gameName,
          entry_fee: parseFloat(entryFee),
          total_rounds: parseInt(totalRounds),
          start_time: formattedStartTime,
          prize_pool: parseFloat(prizePool),
          created_by: user.id,
          is_locked: false,
          is_completed: false
        })
        .select();
        
      if (error) throw error;
      
      toast.success('Game created successfully!');
      
      if (data && data.length > 0) {
        setCreatedGame({
          id: data[0].id,
          name: data[0].name,
          total_rounds: data[0].total_rounds
        });
        setCurrentTab('questions');
      }
      
    } catch (error: any) {
      console.error('Error creating game:', error.message);
      toast.error('Failed to create game: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuestionAdded = () => {
    // Refresh game questions or update UI
  };
  
  // If user is not logged in, redirect to sign in page
  if (!user && !loading) {
    return <Navigate to="/signin" replace />;
  }
  
  // If user is not an admin and we've finished loading, redirect to dashboard
  if (!isAdmin && !loading) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Current date and time in the format expected by datetime-local input
  const now = new Date();
  const formattedNow = format(now.setMinutes(now.getMinutes() + 30), "yyyy-MM-dd'T'HH:mm");

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

        <Tabs 
          value={currentTab} 
          onValueChange={setCurrentTab}
          className="max-w-2xl mx-auto"
        >
          <TabsList className="grid w-full grid-cols-2 bg-theSplit-navy/90 border border-theSplit-teal/20">
            <TabsTrigger 
              value="details" 
              disabled={createdGame !== null}
              className="data-[state=active]:bg-theSplit-teal/20 data-[state=active]:text-theSplit-aqua"
            >
              Game Details
            </TabsTrigger>
            <TabsTrigger 
              value="questions" 
              disabled={createdGame === null}
              className="data-[state=active]:bg-theSplit-teal/20 data-[state=active]:text-theSplit-aqua"
            >
              Questions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card className="bg-theSplit-navy/80 border-theSplit-teal/20 text-theSplit-white">
              <CardHeader>
                <CardTitle className="text-2xl text-gradient">Create New Game</CardTitle>
                <CardDescription className="text-theSplit-light/70">
                  Set up a new prediction game for users to join
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="gameName">Game Name</Label>
                    <Input
                      id="gameName"
                      value={gameName}
                      onChange={(e) => setGameName(e.target.value)}
                      required
                      className="bg-theSplit-navy/50 border-theSplit-teal/30 text-theSplit-white"
                      placeholder="Enter game name"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="entryFee">Entry Fee ($)</Label>
                      <Input
                        id="entryFee"
                        type="number"
                        min="0"
                        step="0.01"
                        value={entryFee}
                        onChange={(e) => setEntryFee(e.target.value)}
                        required
                        className="bg-theSplit-navy/50 border-theSplit-teal/30 text-theSplit-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="prizePool">Prize Pool ($)</Label>
                      <Input
                        id="prizePool"
                        type="number"
                        min="0"
                        step="0.01"
                        value={prizePool}
                        onChange={(e) => setPrizePool(e.target.value)}
                        required
                        className="bg-theSplit-navy/50 border-theSplit-teal/30 text-theSplit-white"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="totalRounds">Total Rounds</Label>
                      <Input
                        id="totalRounds"
                        type="number"
                        min="1"
                        step="1"
                        value={totalRounds}
                        onChange={(e) => setTotalRounds(e.target.value)}
                        required
                        className="bg-theSplit-navy/50 border-theSplit-teal/30 text-theSplit-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="datetime-local"
                        value={startTime || formattedNow}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                        className="bg-theSplit-navy/50 border-theSplit-teal/30 text-theSplit-white"
                      />
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-theSplit-teal hover:bg-theSplit-aqua text-theSplit-navy"
                    disabled={submitting}
                  >
                    {submitting ? 'Creating...' : 'Create Game'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="questions">
            {createdGame && (
              <div className="space-y-6">
                <Card className="bg-theSplit-navy/80 border-theSplit-teal/20 text-theSplit-white">
                  <CardHeader>
                    <CardTitle className="text-2xl text-gradient">Add Questions</CardTitle>
                    <CardDescription className="text-theSplit-light/70">
                      Add questions for "{createdGame.name}" - {createdGame.total_rounds} rounds total
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <QuestionForm 
                      gameId={createdGame.id} 
                      totalRounds={createdGame.total_rounds}
                      onQuestionAdded={handleQuestionAdded}
                    />
                  </CardContent>
                </Card>
                
                <div className="flex justify-center">
                  <Button 
                    onClick={() => navigate('/dashboard')} 
                    className="bg-theSplit-teal hover:bg-theSplit-aqua text-theSplit-navy"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminGameCreate;
