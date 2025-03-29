import { Star } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  authorName: string;
  authorRole: string;
  authorImage: string;
}

function TestimonialCard({ quote, authorName, authorRole, authorImage }: TestimonialCardProps) {
  return (
    <div className="bg-card p-6 rounded-xl border border-border">
      <div className="flex items-center mb-4">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="fill-yellow-500 text-yellow-500 h-4 w-4" />
          ))}
        </div>
      </div>
      <p className="text-muted-foreground mb-4">{quote}</p>
      <div className="flex items-center">
        <img 
          src={authorImage} 
          alt={authorName} 
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div>
          <p className="text-sm font-semibold">{authorName}</p>
          <p className="text-xs text-muted-foreground">{authorRole}</p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Implementing the milestone-based onboarding strategy doubled our Day 7 retention rate and significantly reduced our player acquisition costs.",
      authorName: "Sarah Chen",
      authorRole: "CEO, MetaVentures Gaming",
      authorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
    },
    {
      quote: "The framework completely transformed how we think about player acquisition. Our community is more engaged and our players are spending more time in-game.",
      authorName: "Marcus Johnson",
      authorRole: "CTO, BlockChain Heroes",
      authorImage: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
    },
    {
      quote: "We saw a 73% improvement in player retention after implementing the milestone-based onboarding system. It's been a game-changer for our studio.",
      authorName: "David Rodriguez",
      authorRole: "Product Lead, Crypto Crusaders",
      authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">What Game Studios Are Saying</h2>
          <p className="text-muted-foreground text-lg">See how our framework has helped Web3 game developers succeed</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index}
              quote={testimonial.quote}
              authorName={testimonial.authorName}
              authorRole={testimonial.authorRole}
              authorImage={testimonial.authorImage}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
