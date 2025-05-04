
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeatureCard from '@/components/FeatureCard';
import Footer from '@/components/Footer';
import { ArrowRight, CheckCircle, Trophy, Users, Target, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index: React.FC = () => {
  const features = [
    {
      icon: Target,
      title: "Make Predictions",
      description: "Predict winners of various sports events and competitions to advance in the tournament."
    },
    {
      icon: Users,
      title: "Compete With Friends",
      description: "Create private leagues to battle against friends and colleagues for ultimate bragging rights."
    },
    {
      icon: Trophy,
      title: "Win Prizes",
      description: "Top players earn real prizes and rewards based on their prediction accuracy and strategy."
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your account and information are protected with industry-standard encryption and security."
    }
  ];

  return (
    <div className="min-h-screen bg-theSplit-navy text-theSplit-white">
      <Header />
      <main>
        {/* Hero Section */}
        <HeroSection />
        
        {/* Features Section */}
        <section id="features" className="py-20 bg-theSplit-navy/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How <span className="text-gradient">The Split</span> works
              </h2>
              <p className="text-theSplit-light/80 max-w-2xl mx-auto">
                Join thousands of players making predictions and competing for prizes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => (
                <FeatureCard 
                  key={idx}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Three steps to <span className="text-gradient">victory</span>
              </h2>
              <p className="text-theSplit-light/80 max-w-2xl mx-auto">
                Simple to play, challenging to master. Start your journey to the top.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {[
                {
                  step: "01",
                  title: "Sign up & join a game",
                  description: "Create your account, browse available tournaments, and join the competitions that interest you most."
                },
                {
                  step: "02",
                  title: "Make your predictions",
                  description: "For each round, predict the winners based on your knowledge and strategy before the deadline."
                },
                {
                  step: "03",
                  title: "Survive and win",
                  description: "Advance through rounds with correct predictions and outlast other players to claim the prize."
                }
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="glass-card rounded-xl p-6 relative h-full flex flex-col">
                    <div className="text-4xl font-bold text-gradient mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-theSplit-white">
                      {item.title}
                    </h3>
                    <p className="text-theSplit-light/80 flex-grow">
                      {item.description}
                    </p>
                  </div>
                  
                  {idx < 2 && (
                    <div className="hidden lg:block absolute top-1/2 -right-5 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-theSplit-teal/50" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-theSplit-navy/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What our <span className="text-gradient">players</span> say
              </h2>
              <p className="text-theSplit-light/80 max-w-2xl mx-auto">
                Join thousands of satisfied players on The Split.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  quote: "The Split makes watching sports so much more exciting. I've won twice and the prizes were delivered quickly!",
                  author: "Alex Johnson",
                  role: "Premier League Fan"
                },
                {
                  quote: "I love competing with my friends. The interface is clean and the predictions are easy to make.",
                  author: "Sarah Williams",
                  role: "NBA Enthusiast"
                },
                {
                  quote: "As a sports analyst, I appreciate the depth of the competition. It really tests your knowledge.",
                  author: "Michael Chen",
                  role: "Sports Analyst"
                }
              ].map((testimonial, idx) => (
                <div key={idx} className="glass-card rounded-xl p-6 h-full">
                  <div className="mb-4 text-theSplit-aqua">
                    {"★".repeat(5)}
                  </div>
                  <p className="text-theSplit-light italic mb-6">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-theSplit-teal to-theSplit-aqua flex items-center justify-center">
                      <span className="text-theSplit-white font-bold">
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-theSplit-white">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-theSplit-light/70">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-theSplit-teal to-theSplit-aqua rounded-2xl blur-md opacity-30"></div>
              <div className="glass-card rounded-2xl p-12 text-center relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to test your <span className="text-gradient">prediction skills</span>?
                </h2>
                <p className="text-theSplit-light/80 max-w-2xl mx-auto mb-8">
                  Join thousands of players competing for prizes and bragging rights in prediction tournaments.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/signup">
                    <Button className="bg-theSplit-teal hover:bg-theSplit-aqua text-theSplit-white h-12 px-8 button-glow">
                      Sign Up to Play
                    </Button>
                  </Link>
                  <Link to="/games">
                    <Button variant="outline" className="border-theSplit-teal text-theSplit-aqua hover:bg-theSplit-teal/10 h-12 px-8">
                      Browse Games
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-8 flex items-center justify-center gap-3 text-theSplit-light/80">
                  <CheckCircle className="h-5 w-5 text-theSplit-aqua" />
                  <span>No credit card required to start</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

export default Index;
