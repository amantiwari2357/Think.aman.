import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Linkedin,
  Github,
  Instagram
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      description: "Send us an email anytime",
      contact: "amankumartiwari5255@gmail.com",
      action: "mailto:amankumartiwari5255@gmail.com"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      description: "Speak directly with our team",
      contact: "+91 9031359720",
      action: "tel:+919031359720"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Location",
      description: "Our headquarters",
      contact: "Lucknow, Uttar Pradesh, India",
      action: "#"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Response Time",
      description: "We typically respond within",
      contact: "24 hours",
      action: "#"
    }
  ];

  const socialLinks = [
    {
      icon: <Linkedin className="h-5 w-5" />,
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/aman-tiwari-91b869225/"
    },
    {
      icon: <Instagram className="h-5 w-5" />,
      label: "Instagram",
      url: "https://www.instagram.com/amantiwari2357"
    },
    {
      icon: <Github className="h-5 w-5" />,
      label: "GitHub",
      url: "https://github.com/digiindia2025"
    },
    {
      icon: <Github className="h-5 w-5" />,
      label: "GitHub (Personal)",
      url: "https://github.com/aman2357"
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
                <MessageSquare className="h-4 w-4 mr-2" />
                Get In Touch
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Contact
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Us
                </span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-lg leading-relaxed">
                Have a question, suggestion, or just want to say hello? We'd love to hear from you.
                Reach out to us and let's start a conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods & Form */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">Get in Touch</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Choose the most convenient way to reach us. We're here to help and would love to hear from you.
                </p>
              </div>

              <div className="grid gap-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg text-primary">
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{info.title}</h3>
                        <p className="text-muted-foreground mb-2">{info.description}</p>
                        {info.action.startsWith("mailto") || info.action.startsWith("tel") ? (
                          <a
                            href={info.action}
                            className="text-primary hover:underline font-medium"
                          >
                            {info.contact}
                          </a>
                        ) : (
                          <p className="text-primary font-medium">{info.contact}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Follow Aman Tiwari</h3>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      {social.icon}
                      <span className="text-sm font-medium">{social.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="p-8">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="What's this about?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="Tell us more about your inquiry..."
                      className="min-h-[120px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">
              Quick answers to common questions about Think.Aman
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">How do I get started?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Simply sign up for a free account, complete your profile, and start browsing requests or post your own coding challenges.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Is the platform free to use?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! Basic features are completely free. We also offer premium features for advanced users and teams.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">How does payment work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Users negotiate rates directly. We provide a secure platform but don't handle payments - that's between you and your clients.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Can I contact you for support?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolutely! Use the contact form above or reach out via email/phone. We typically respond within 24 hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-[600px] mx-auto">
            Join thousands of developers already using Think.Aman to solve problems and grow their careers.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href="/signup">Get Started Today</a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
