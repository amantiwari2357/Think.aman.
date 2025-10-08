import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Award,
  BookOpen,
  Briefcase,
  Code,
  GraduationCap,
  Heart,
  Lightbulb,
  MapPin,
  Star,
  Users,
  Zap
} from "lucide-react";

export default function AboutFounder() {
  const founder = {
    name: "Aman Tiwari",
    role: "Founder & CEO",
    education: "B.Tech Computer Science, AKTU Lucknow",
    company: "Digi India Solution",
    location: "India",
    experience: "5+ years in software development and entrepreneurship",
    description: "Aman Tiwari is a passionate software developer, entrepreneur, and community builder who founded Think.Aman with the vision of connecting developers worldwide and creating a collaborative platform for problem-solving and knowledge sharing.",
    vision: "To democratize access to technical expertise and create a world where no developer struggles alone.",
    achievements: [
      "Built Think.Aman from ground up, connecting 10K+ developers globally",
      "Founded Digi India Solution, a leading tech solutions company",
      "Led development of multiple collaborative platforms and open-source projects",
      "Mentored 500+ aspiring developers through various programs",
      "Recognized as 'Emerging Tech Leader' by industry peers"
    ],
    skills: [
      "Full-Stack Development",
      "React & Node.js",
      "Cloud Architecture",
      "Team Leadership",
      "Product Strategy",
      "Community Building"
    ],
    journey: [
      {
        year: "2018",
        title: "Started Programming Journey",
        description: "Began learning programming during college years, focusing on web development and problem-solving"
      },
      {
        year: "2019",
        title: "First Startup Venture",
        description: "Launched first tech venture while still in college, gaining valuable entrepreneurial experience"
      },
      {
        year: "2020",
        title: "Founded Digi India Solution",
        description: "Established a tech solutions company providing innovative digital services to clients"
      },
      {
        year: "2022",
        title: "Conceived Think.Aman",
        description: "Identified the need for a dedicated platform connecting developers and solving real-world problems"
      },
      {
        year: "2023",
        title: "Launched Think.Aman Platform",
        description: "Successfully launched the platform, achieving rapid growth and community adoption"
      }
    ],
    values: [
      {
        icon: <Heart className="h-6 w-6 text-primary" />,
        title: "Community First",
        description: "Building meaningful connections and fostering collaboration in the developer community"
      },
      {
        icon: <Lightbulb className="h-6 w-6 text-primary" />,
        title: "Innovation",
        description: "Embracing new technologies and creative solutions to solve complex problems"
      },
      {
        icon: <Users className="h-6 w-6 text-primary" />,
        title: "Knowledge Sharing",
        description: "Believing that sharing knowledge accelerates growth for everyone involved"
      },
      {
        icon: <Award className="h-6 w-6 text-primary" />,
        title: "Excellence",
        description: "Striving for excellence in everything we build and every interaction we have"
      }
    ]
  };

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
                About Our Founder
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Meet
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Aman Tiwari
                </span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl leading-relaxed">
                {founder.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Profile Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Founder Image & Basic Info */}
              <div className="space-y-8">
                <Card className="p-8 text-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-6xl mx-auto mb-6">
                    AT
                  </div>
                  <h2 className="text-3xl font-bold mb-2">{founder.name}</h2>
                  <p className="text-primary font-semibold text-xl mb-4">{founder.role}</p>

                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      <span className="text-muted-foreground">{founder.education}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-5 w-5 text-primary" />
                      <span className="text-muted-foreground">{founder.company}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="text-muted-foreground">{founder.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-primary" />
                      <span className="text-muted-foreground">{founder.experience}</span>
                    </div>
                  </div>
                </Card>

                {/* Skills Section */}
                <Card className="p-6">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Core Skills & Expertise
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {founder.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Founder Story & Vision */}
              <div className="space-y-8">
                <Card className="p-8">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-2xl">Vision & Mission</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {founder.vision}
                    </p>
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground italic">
                        "I believe that by connecting the right people with the right problems,
                        we can accelerate innovation and learning across the global tech community."
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Journey Timeline */}
                <Card className="p-6">
                  <CardHeader className="pb-4">
                    <CardTitle>Professional Journey</CardTitle>
                    <CardDescription>The path that led to Think.Aman</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {founder.journey.map((milestone, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-16 text-center">
                          <Badge variant="secondary" className="mb-2">{milestone.year}</Badge>
                        </div>
                        <div className="flex-1 pb-6 border-l-2 border-primary/20 pl-4">
                          <h4 className="font-semibold mb-1">{milestone.title}</h4>
                          <p className="text-sm text-muted-foreground">{milestone.description}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">Core Values</h2>
            <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
              The principles that drive Aman's work and shape the Think.Aman community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {founder.values.map((value, index) => (
              <Card key={index} className="text-center h-full">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">Key Achievements</h2>
            <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
              Milestones that reflect Aman's commitment to building great technology and communities.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {founder.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">{achievement}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
            Want to Connect?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-[600px] mx-auto">
            Reach out to Aman directly or join the Think.Aman community to be part of this exciting journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">Get in Touch</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to="/about">Learn About Think.Aman</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
