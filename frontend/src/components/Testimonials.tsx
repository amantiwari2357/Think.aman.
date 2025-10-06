
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote, ChevronRight, ChevronLeft, Globe } from "lucide-react";
import { useState, useEffect } from "react";

export function Testimonials() {
  const [currentCountryIndex, setCurrentCountryIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // 4 testimonials per country, 10 countries = 40 total testimonials
  const countryTestimonials = {
    india: [
      {
        quote: "SkillSync helped me crack my startup's payment gateway integration issue in just 2 hours! The senior developer from Bangalore was incredibly helpful and patient with my questions.",
        author: "Priya Sharma",
        role: "Full Stack Developer",
        company: "TechStart Inc.",
        location: "Mumbai, India",
        avatar: "PS",
        rating: 5,
        project: "Payment Gateway Integration"
      },
      {
        quote: "As a final year CS student from IIT Delhi, I was struggling with my ML project. Found an amazing mentor on SkillSync who not only solved my technical issues but also guided me for placements!",
        author: "Arjun Patel",
        role: "Computer Science Student",
        company: "IIT Delhi",
        location: "Delhi, India",
        avatar: "AP",
        rating: 5,
        project: "Machine Learning Project"
      },
      {
        quote: "Being a remote developer from Kerala, SkillSync has been a game-changer for me. I helped debug a React Native app for a startup in Pune and earned my first side income!",
        author: "Anjali Nair",
        role: "React Native Developer",
        company: "Freelance",
        location: "Kochi, Kerala",
        avatar: "AN",
        rating: 5,
        project: "Mobile App Development"
      },
      {
        quote: "Our Bangalore-based fintech startup was facing critical security vulnerabilities. Within 4 hours, we connected with a cybersecurity expert from Hyderabad who resolved everything!",
        author: "Rohit Kumar",
        role: "CTO & Co-founder",
        company: "PaySecure Technologies",
        location: "Bangalore, India",
        avatar: "RK",
        rating: 5,
        project: "Security Audit"
      }
    ],
    usa: [
      {
        quote: "As a Silicon Valley engineer, I love how SkillSync connects me with global talent. Recently helped a startup in Singapore optimize their React application performance.",
        author: "David Kim",
        role: "Senior Frontend Engineer",
        company: "Google",
        location: "San Francisco, USA",
        avatar: "DK",
        rating: 5,
        project: "React Performance Optimization"
      },
      {
        quote: "Working at Meta in Seattle, I used SkillSync to help a nonprofit organization build their donor management system. The collaboration tools are exceptional!",
        author: "Sarah Chen",
        role: "Backend Developer",
        company: "Meta",
        location: "Seattle, USA",
        avatar: "SC",
        rating: 5,
        project: "Donor Management System"
      },
      {
        quote: "From Austin, Texas, I specialize in DevOps. SkillSync helped me assist a fintech startup in New York with their CI/CD pipeline optimization.",
        author: "Mike Johnson",
        role: "DevOps Engineer",
        company: "Amazon Web Services",
        location: "Austin, USA",
        avatar: "MJ",
        rating: 5,
        project: "CI/CD Pipeline"
      },
      {
        quote: "As a machine learning engineer in Boston, I used SkillSync to collaborate with researchers worldwide on cutting-edge AI projects.",
        author: "Lisa Wang",
        role: "ML Engineer",
        company: "MIT Research Lab",
        location: "Boston, USA",
        avatar: "LW",
        rating: 5,
        project: "AI Research Collaboration"
      }
    ],
    uk: [
      {
        quote: "From London, I was struggling with my fintech app's security. Connected with an amazing expert from Israel who secured everything in just 3 hours!",
        author: "Sarah Thompson",
        role: "CTO",
        company: "London Fintech Ltd",
        location: "London, UK",
        avatar: "ST",
        rating: 5,
        project: "Fintech Security"
      },
      {
        quote: "As a senior developer in Manchester, I helped scale a SaaS platform for a client in Edinburgh using SkillSync's collaborative debugging features.",
        author: "James Wilson",
        role: "Senior Developer",
        company: "BT Group",
        location: "Manchester, UK",
        avatar: "JW",
        rating: 5,
        project: "SaaS Platform Scaling"
      },
      {
        quote: "Working remotely from Brighton, I assisted a London-based startup with their React Native mobile application development and deployment.",
        author: "Emma Davis",
        role: "Mobile Developer",
        company: "Freelance",
        location: "Brighton, UK",
        avatar: "ED",
        rating: 5,
        project: "React Native Development"
      },
      {
        quote: "From Cambridge, I used SkillSync to mentor junior developers across different UK tech companies while working on my own blockchain research.",
        author: "Dr. Robert Brown",
        role: "Blockchain Researcher",
        company: "University of Cambridge",
        location: "Cambridge, UK",
        avatar: "RB",
        rating: 5,
        project: "Blockchain Research"
      }
    ],
    canada: [
      {
        quote: "As a developer in Toronto, SkillSync's real-time collaboration helped me mentor students across Canada while working on my own blockchain projects.",
        author: "Ahmed Al-Rashid",
        role: "Blockchain Developer",
        company: "RBC Tech",
        location: "Toronto, Canada",
        avatar: "AA",
        rating: 5,
        project: "Blockchain Development"
      },
      {
        quote: "From Vancouver, I helped a Montreal-based startup optimize their e-commerce platform using modern web technologies and cloud infrastructure.",
        author: "Jennifer Liu",
        role: "Full Stack Developer",
        company: "Shopify",
        location: "Vancouver, Canada",
        avatar: "JL",
        rating: 5,
        project: "E-commerce Optimization"
      },
      {
        quote: "Working in Ottawa, I used SkillSync to collaborate with government agencies on secure application development and cybersecurity projects.",
        author: "Marc Trudeau",
        role: "Security Engineer",
        company: "Government of Canada",
        location: "Ottawa, Canada",
        avatar: "MT",
        rating: 5,
        project: "Government Security"
      },
      {
        quote: "As a data scientist in Calgary, I leveraged SkillSync to work with oil and gas companies on predictive analytics and machine learning solutions.",
        author: "Priya Singh",
        role: "Data Scientist",
        company: "Suncor Energy",
        location: "Calgary, Canada",
        avatar: "PS2",
        rating: 5,
        project: "Predictive Analytics"
      }
    ],
    australia: [
      {
        quote: "Our Australian startup needed urgent help with machine learning deployment. Found an incredible expert from Germany who solved everything remotely!",
        author: "Emily Watson",
        role: "AI/ML Engineer",
        company: "Sydney AI Labs",
        location: "Sydney, Australia",
        avatar: "EW",
        rating: 5,
        project: "ML Model Deployment"
      },
      {
        quote: "From Melbourne, I assisted a Perth-based mining company with IoT sensor data analysis and real-time monitoring system development.",
        author: "Michael Thompson",
        role: "IoT Developer",
        company: "Rio Tinto",
        location: "Melbourne, Australia",
        avatar: "MT2",
        rating: 5,
        project: "IoT Monitoring System"
      },
      {
        quote: "Working in Brisbane, I helped a Sydney fintech startup build a secure mobile banking application using React Native and blockchain technology.",
        author: "Sophie Green",
        role: "Mobile App Developer",
        company: "Commonwealth Bank",
        location: "Brisbane, Australia",
        avatar: "SG",
        rating: 5,
        project: "Mobile Banking App"
      },
      {
        quote: "As a cloud architect in Adelaide, I used SkillSync to help Australian government agencies migrate their legacy systems to modern cloud infrastructure.",
        author: "David Miller",
        role: "Cloud Architect",
        company: "Australian Government",
        location: "Adelaide, Australia",
        avatar: "DM",
        rating: 5,
        project: "Cloud Migration"
      }
    ]
  };

  const countries = Object.keys(countryTestimonials);
  const currentCountry = countries[currentCountryIndex];
  const currentTestimonials = countryTestimonials[currentCountry];

  // Auto-play functionality - change country every 8 seconds
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentCountryIndex((prev) => (prev + 1) % countries.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, countries.length]);

  const nextCountry = () => {
    setCurrentCountryIndex((prev) => (prev + 1) % countries.length);
    setIsAutoPlaying(false);
  };

  const prevCountry = () => {
    setCurrentCountryIndex((prev) => (prev - 1 + countries.length) % countries.length);
    setIsAutoPlaying(false);
  };

  const getCountryFlag = (country) => {
    const flags = {
      india: "🇮🇳",
      usa: "🇺🇸",
      uk: "🇬🇧",
      canada: "🇨🇦",
      australia: "🇦🇺"
    };
    return flags[country] || "🌍";
  };

  const getCountryName = (country) => {
    const names = {
      india: "India",
      usa: "United States",
      uk: "United Kingdom",
      canada: "Canada",
      australia: "Australia"
    };
    return names[country] || country;
  };

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
              Discover success stories from developers across {countries.length} countries, each showcasing unique expertise and collaboration experiences.
            </p>
          </div>
        </div>

        {/* Country header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20">
            <span className="text-3xl">{getCountryFlag(currentCountry)}</span>
            <div className="text-left">
              <h3 className="text-2xl font-bold text-primary">{getCountryName(currentCountry)}</h3>
              <p className="text-sm text-muted-foreground">4 Developer Stories</p>
            </div>
          </div>
        </div>

        {/* Testimonials grid - 4 in one row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {currentTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 p-6 shadow-lg hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Quote icon */}
              <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-40 transition-opacity">
                <Quote className="h-6 w-6 text-primary" />
              </div>

              {/* Rating stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-muted-foreground text-sm leading-relaxed mb-4 group-hover:text-foreground/90 transition-colors duration-300">
                "{testimonial.quote}"
              </blockquote>

              {/* Project badge */}
              <div className="mb-4">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  {testimonial.project}
                </span>
              </div>

              {/* Author info */}
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-semibold text-sm">
                    {testimonial.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground truncate">{testimonial.role}</p>
                  <p className="text-xs text-primary/70 font-medium truncate">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation controls */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <button
            onClick={prevCountry}
            className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-full p-3 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 shadow-lg"
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground hover:text-primary" />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center space-x-2">
            {countries.map((country, index) => (
              <button
                key={country}
                onClick={() => {
                  setCurrentCountryIndex(index);
                  setIsAutoPlaying(false);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentCountryIndex
                    ? 'bg-primary scale-125'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextCountry}
            className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-full p-3 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 shadow-lg"
          >
            <ChevronRight className="h-5 w-5 text-muted-foreground hover:text-primary" />
          </button>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center gap-6 px-8 py-4 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <div className="flex items-center gap-3 text-primary font-medium">
              <span className="text-lg">Join developers from 150+ countries</span>
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary/30 border-2 border-background flex items-center justify-center text-xs font-bold text-primary">+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
