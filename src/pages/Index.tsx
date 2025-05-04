
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeatureCard from '@/components/FeatureCard';
import Footer from '@/components/Footer';
import { ArrowRight, CheckCircle, CreditCard, Lock, PieChart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: "Group Expenses",
      description: "Easily split bills with roommates, friends, or travel companions with automatic balance calculations."
    },
    {
      icon: CreditCard,
      title: "Instant Settlements",
      description: "Send and receive payments directly through the app with your preferred payment method."
    },
    {
      icon: PieChart,
      title: "Expense Analytics",
      description: "Track your spending patterns with insightful charts and spending categorization."
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description: "Your financial data is encrypted and never shared with third parties."
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
                Split expenses without the <span className="text-gradient">headache</span>
              </h2>
              <p className="text-theSplit-light/80 max-w-2xl mx-auto">
                Our intuitive tools make tracking shared expenses and settling debts easier than ever before.
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
                How <span className="text-gradient">The Split</span> works
              </h2>
              <p className="text-theSplit-light/80 max-w-2xl mx-auto">
                Three simple steps to make sharing expenses with friends completely stress-free.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {[
                {
                  step: "01",
                  title: "Add your expenses",
                  description: "Enter bills and expenses as they happen. Tag who paid and who needs to share the cost."
                },
                {
                  step: "02",
                  title: "The Split does the math",
                  description: "Our app calculates who owes what to whom, simplifying even the most complex expense sharing scenarios."
                },
                {
                  step: "03",
                  title: "Settle up easily",
                  description: "Send payment reminders or pay directly through the app with your preferred payment method."
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
                Loved by friends and <span className="text-gradient">roommates</span>
              </h2>
              <p className="text-theSplit-light/80 max-w-2xl mx-auto">
                See what our users are saying about The Split.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  quote: "The Split has made managing apartment expenses so much easier. No more awkward money conversations!",
                  author: "Alex Johnson",
                  role: "Apartment Renter"
                },
                {
                  quote: "We used this for our group trip to Europe and it saved us hours of calculating who owed what.",
                  author: "Sarah Williams",
                  role: "Travel Enthusiast"
                },
                {
                  quote: "As a financial advisor, I recommend The Split to clients who share expenses. It's simple yet powerful.",
                  author: "Michael Chen",
                  role: "Financial Advisor"
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
                  Ready to split expenses <span className="text-gradient">smarter</span>?
                </h2>
                <p className="text-theSplit-light/80 max-w-2xl mx-auto mb-8">
                  Join thousands of friends, roommates, and couples who use The Split to manage shared expenses without the stress.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-theSplit-teal hover:bg-theSplit-aqua text-theSplit-white h-12 px-8 button-glow">
                    Get Started Free
                  </Button>
                  <Button variant="outline" className="border-theSplit-teal text-theSplit-aqua hover:bg-theSplit-teal/10 h-12 px-8">
                    View Demo
                  </Button>
                </div>
                
                <div className="mt-8 flex items-center justify-center gap-3 text-theSplit-light/80">
                  <CheckCircle className="h-5 w-5 text-theSplit-aqua" />
                  <span>No credit card required</span>
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
