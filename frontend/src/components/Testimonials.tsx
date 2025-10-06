
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote, ChevronRight, ChevronLeft, Globe } from "lucide-react";
import { useState, useEffect } from "react";

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      quote: "SkillSync helped me crack my startup's payment gateway integration issue in just 2 hours! The senior developer from Bangalore was incredibly helpful and patient with my questions.",
      author: "Priya Sharma",
      role: "Full Stack Developer",
      company: "TechStart Inc.",
      location: "Mumbai, India",
      country: "India",
      avatar: "PS",
      rating: 5,
      project: "Payment Gateway Integration",
      flag: "🇮🇳"
    },
    {
      quote: "As a Silicon Valley engineer, I love how SkillSync connects me with global talent. Recently helped a startup in Singapore optimize their React application performance.",
      author: "David Kim",
      role: "Senior Frontend Engineer",
      company: "Google",
      location: "San Francisco, USA",
      country: "United States",
      avatar: "DK",
      rating: 5,
      project: "React Performance Optimization",
      flag: "🇺🇸"
    },
    {
      quote: "From London, I was struggling with my fintech app's security. Connected with an amazing expert from Israel who secured everything in just 3 hours!",
      author: "Sarah Thompson",
      role: "CTO",
      company: "London Fintech Ltd",
      location: "London, UK",
      country: "United Kingdom",
      avatar: "ST",
      rating: 5,
      project: "Fintech Security",
      flag: "🇬🇧"
    },
    {
      quote: "As a developer in Toronto, SkillSync's real-time collaboration helped me mentor students across Canada while working on my own blockchain projects.",
      author: "Ahmed Al-Rashid",
      role: "Blockchain Developer",
      company: "RBC Tech",
      location: "Toronto, Canada",
      country: "Canada",
      avatar: "AA",
      rating: 5,
      project: "Blockchain Development",
      flag: "🇨🇦"
    },
    {
      quote: "Our Australian startup needed urgent help with machine learning deployment. Found an incredible expert from Germany who solved everything remotely!",
      author: "Emily Watson",
      role: "AI/ML Engineer",
      company: "Sydney AI Labs",
      location: "Sydney, Australia",
      country: "Australia",
      avatar: "EW",
      rating: 5,
      project: "ML Model Deployment",
      flag: "🇦🇺"
    },
    {
      quote: "From Tokyo, I helped a European startup with their mobile app localization. SkillSync makes global collaboration so seamless!",
      author: "Tanaka Hiroshi",
      role: "Mobile Developer",
      company: "Sony Japan",
      location: "Tokyo, Japan",
      country: "Japan",
      avatar: "TH",
      rating: 5,
      project: "App Localization",
      flag: "🇯🇵"
    },
    {
      quote: "As a developer in São Paulo, I was stuck on a complex e-commerce platform. Connected with an expert from South Korea who solved it brilliantly!",
      author: "Maria Santos",
      role: "E-commerce Developer",
      company: "Mercado Livre",
      location: "São Paulo, Brazil",
      country: "Brazil",
      avatar: "MS",
      rating: 5,
      project: "E-commerce Platform",
      flag: "🇧🇷"
    },
    {
      quote: "From Seoul, I specialize in game development. Recently helped a French indie studio optimize their Unity game performance.",
      author: "Park Ji-hoon",
      role: "Game Developer",
      company: "Nexon Korea",
      location: "Seoul, South Korea",
      country: "South Korea",
      avatar: "PJ",
      rating: 5,
      project: "Game Optimization",
      flag: "🇰🇷"
    },
    {
      quote: "Our Dubai-based startup needed help with cloud infrastructure. Connected with an amazing DevOps expert from the Netherlands!",
      author: "Fatima Al-Zahra",
      role: "Cloud Architect",
      company: "Dubai Tech Solutions",
      location: "Dubai, UAE",
      country: "UAE",
      avatar: "FA",
      rating: 5,
      project: "Cloud Infrastructure",
      flag: "🇦🇪"
    },
    {
      quote: "From Amsterdam, I help startups scale their applications. Recently assisted a company in Singapore with their microservices architecture.",
      author: "Lukas van der Berg",
      role: "DevOps Engineer",
      company: "ING Bank",
      location: "Amsterdam, Netherlands",
      country: "Netherlands",
      avatar: "LV",
      rating: 5,
      project: "Microservices Architecture",
      flag: "🇳🇱"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-background via-muted/10 to-background overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100/30 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.4))] dark:bg-grid-slate-700/20" />
      <div className="absolute top-10 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 left-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container relative px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
              <Globe className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Global Developer Community</span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Trusted by Developers
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Worldwide
              </span>
            </h2>
            <p className="max-w-[800px] text-muted-foreground text-lg md:text-xl leading-relaxed">
              Connect with expert developers from around the globe. See testimonials from our international community of problem-solvers.
            </p>
          </div>
        </div>

        {/* Main testimonial display */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="relative">
            {/* Navigation buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full p-3 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 shadow-lg"
            >
              <ChevronLeft className="h-5 w-5 text-muted-foreground hover:text-primary" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full p-3 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 shadow-lg"
            >
              <ChevronRight className="h-5 w-5 text-muted-foreground hover:text-primary" />
            </button>

            {/* Testimonial card */}
            <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 p-8 md:p-12 shadow-2xl">
              {/* Quote icon */}
              <div className="absolute top-6 right-6 opacity-20">
                <Quote className="h-12 w-12 text-primary" />
              </div>

              {/* Rating stars */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8">
                "{currentTestimonial.quote}"
              </blockquote>

              {/* Project badge */}
              <div className="mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                  <span className="text-lg">{currentTestimonial.flag}</span>
                  {currentTestimonial.project}
                </span>
              </div>

              {/* Author info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16 border-2 border-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-bold text-lg">
                      {currentTestimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-lg font-bold text-foreground">{currentTestimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{currentTestimonial.role}</p>
                    <p className="text-sm text-primary/70 font-medium">{currentTestimonial.company}</p>
                    <p className="text-sm text-muted-foreground">{currentTestimonial.location}</p>
                  </div>
                </div>

                {/* Country flag and name */}
                <div className="text-right">
                  <div className="text-4xl mb-2">{currentTestimonial.flag}</div>
                  <p className="text-sm font-semibold text-primary">{currentTestimonial.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary scale-125'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>

          {/* Auto-play toggle */}
          <div className="text-center mt-6">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isAutoPlaying ? '⏸️ Pause auto-play' : '▶️ Resume auto-play'}
            </button>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-6 px-8 py-4 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <div className="flex items-center gap-3 text-primary font-medium">
              <span className="text-lg">Join developers from 150+ countries</span>
              <div className="flex -space-x-2">
                <span className="text-lg">🇮🇳</span>
                <span className="text-lg">🇺🇸</span>
                <span className="text-lg">🇬🇧</span>
                <span className="text-lg">🇨🇦</span>
                <span className="text-lg">🇯🇵</span>
                <div className="w-8 h-8 rounded-full bg-primary/30 border-2 border-background flex items-center justify-center text-xs font-bold text-primary">+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
