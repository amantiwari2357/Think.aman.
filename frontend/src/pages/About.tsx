import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Users,
  Target,
  Lightbulb,
  Heart,
  Award,
  Globe,
  Code,
  Zap,
  Shield,
  Star
} from "lucide-react";

export default function About() {
  const values = [
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Community First",
      description: "Building meaningful connections between developers, fostering collaboration and knowledge sharing across the globe."
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Problem Solving",
      description: "Every challenge is an opportunity to learn and grow. We believe in tackling complex problems together."
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: "Innovation",
      description: "Embracing new technologies and creative solutions to build the future of collaborative development."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Trust & Safety",
      description: "Creating a secure, respectful environment where developers can share knowledge without hesitation."
    }
  ];

  const stats = [
    { number: "50K+", label: "Problems Solved", icon: <Zap className="h-6 w-6" /> },
    { number: "10K+", label: "Active Developers", icon: <Users className="h-6 w-6" /> },
    { number: "150+", label: "Countries", icon: <Globe className="h-6 w-6" /> },
    { number: "24/7", label: "Support", icon: <Star className="h-6 w-6" /> }
  ];

  const team = [
    {
      name: "Aman Tiwari",
      role: "Founder & CEO",
      education: "B.Tech Computer Science, AKTU Lucknow",
      company: "Digi India Solution",
      description: "Passionate about connecting developers and building innovative solutions for the tech community.",
      image: "AT",
      achievements: ["Built Think.Aman from ground up", "Led development of collaborative platform", "Connected 10K+ developers globally"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-4">
              <Badge variant="secondary" className="px-4 py-2">
                <Star className="h-4 w-4 mr-2" />
                About Think.Aman
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Connecting Developers,
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Solving Problems Together
                </span>
              </h1>
              <p className="mx-auto max-w-[800px] text-muted-foreground text-lg md:text-xl leading-relaxed">
                Think.Aman is more than just a platform—it's a global community where developers,
                students, and industry professionals come together to share knowledge, solve complex
                challenges, and build meaningful connections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4 text-primary">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Our Mission</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                To democratize access to technical expertise and create a world where no developer
                struggles alone. We believe that by connecting the right people with the right
                problems, we can accelerate innovation and learning across the global tech community.
              </p>
              <div className="flex flex-wrap gap-4">
                <Badge variant="outline" className="px-4 py-2">
                  <Code className="h-4 w-4 mr-2" />
                  Code Collaboration
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  <Users className="h-4 w-4 mr-2" />
                  Knowledge Sharing
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  <Globe className="h-4 w-4 mr-2" />
                  Global Community
                </Badge>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                <div className="text-6xl">🚀</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
              The principles that guide everything we do and shape our community culture.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center h-full">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">Meet the Founder</h2>
            <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
              The visionary behind Think.Aman and Digi India Solution.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-2xl">
                      {member.image}
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                    <p className="text-primary font-semibold mb-2">{member.role}</p>
                    <p className="text-muted-foreground mb-2">{member.education}</p>
                    <p className="text-muted-foreground mb-4">{member.company}</p>
                    <p className="text-muted-foreground mb-4">{member.description}</p>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Key Achievements:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {member.achievements.map((achievement, i) => (
                          <li key={i}>• {achievement}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6">
                      <Button asChild>
                        <Link to="/about-founder">Learn About Our Founder</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-[600px] mx-auto">
            Become part of a global network of developers, share your expertise, and solve challenging problems together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to="/how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
