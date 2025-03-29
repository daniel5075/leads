import { Users, TrendingUp } from "lucide-react";

interface StatCardProps {
  value: string;
  description: string;
}

function StatCard({ value, description }: StatCardProps) {
  return (
    <div className="bg-card p-6 rounded-xl border border-border text-center">
      <div className="text-4xl font-bold text-emerald-500 mb-2">{value}</div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

interface CaseStudyCardProps {
  image: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

function CaseStudyCard({ image, title, description, children }: CaseStudyCardProps) {
  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border">
      <img 
        src={image}
        alt={title} 
        className="w-full h-64 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        {children}
      </div>
    </div>
  );
}

export default function ProofSection() {
  const stats = [
    {
      value: "5x",
      description: "Longer player retention compared to standard onboarding"
    },
    {
      value: "40M+",
      description: "Monthly active users for Duolingo using this strategy"
    },
    {
      value: "+20%",
      description: "Increase in onboarding completion after implementing"
    },
    {
      value: "73%",
      description: "Increase in Week 1 player retention for Web3 games"
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">Why This Works (Backed by Data)</h2>
          <p className="text-muted-foreground text-lg">Companies using milestone-based onboarding see dramatically better retention</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <StatCard key={index} value={stat.value} description={stat.description} />
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <CaseStudyCard 
            image="/images/duolingo.jpeg"
            title="Case Study: How Duolingo Hooks Users"
            description="Duolingo guides users through early lessons using visual goals, streaks, XP, and cute characters that celebrate wins."
          >
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">40M+ MAUs</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">5x longer retention</span>
              </div>
            </div>
          </CaseStudyCard>

          <CaseStudyCard 
            image="/images/Quest-Structure.png"
            title="Web3 Application: The Forge Path"
            description="Break the first 24–72 hours of gameplay into mini quests with tiny rewards (XP, lore, items) and visual progress tracking."
          >
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-primary/20 rounded text-primary text-xs">Complete missions</span>
              <span className="px-2 py-1 bg-primary/20 rounded text-primary text-xs">Level up character</span>
              <span className="px-2 py-1 bg-primary/20 rounded text-primary text-xs">Join community</span>
              <span className="px-2 py-1 bg-primary/20 rounded text-primary text-xs">Mint starter Aura</span>
            </div>
          </CaseStudyCard>
        </div>
      </div>
    </section>
  );
}