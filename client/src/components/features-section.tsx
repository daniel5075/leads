import { BrainCircuit, Code, LightbulbIcon, Star, TrendingUp, Trophy } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-card p-6 rounded-xl border border-border hover:border-primary/50 transition-all group">
      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export default function FeaturesSection() {
  const features = [
    {
      icon: <TrendingUp className="text-primary text-xl" />,
      title: "How milestone-based onboarding turns new players into long-term power users",
      description: "Learn the exact framework that drives 5x longer retention and builds emotional investment from day one."
    },
    {
      icon: <BrainCircuit className="text-primary text-xl" />,
      title: "The 5 psychological triggers that keep users coming back daily",
      description: "Master the science of habit formation and learn how to build addictive experiences your players can't resist."
    },
    {
      icon: <Trophy className="text-primary text-xl" />,
      title: "How to build gamified progression paths that hook your players from day one",
      description: "Create a system that makes users feel like they're winning from the moment they sign up."
    },
    {
      icon: <Star className="text-primary text-xl" />,
      title: "Why \"mini wins\" beat token incentives every time",
      description: "Discover how simple psychological rewards outperform monetary incentives for long-term engagement."
    },
    {
      icon: <LightbulbIcon className="text-primary text-xl" />,
      title: "Real-world case studies and how to apply them to your game",
      description: "See how top Web2 and Web3 companies have implemented these strategies with remarkable results."
    },
    {
      icon: <Code className="text-primary text-xl" />,
      title: "Ready-to-implement strategies you can deploy today",
      description: "Get actionable, no-code solutions that you can implement immediately, even without a technical team."
    }
  ];

  return (
    <section id="features" className="py-16 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">What You'll Learn Inside This Free PDF</h2>
          <p className="text-muted-foreground text-lg">Discover the proven strategies that turn first-time players into loyal community members</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
