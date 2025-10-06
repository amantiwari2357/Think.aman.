import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Users,
  Mail,
  Phone,
  Calendar,
  FileText
} from "lucide-react";

export default function Privacy() {
  const sections = [
    {
      icon: <Database className="h-6 w-6 text-primary" />,
      title: "Information We Collect",
      content: `We collect information you provide directly to us, such as when you create an account, update your profile, make a request, provide a solution, or contact us for support. This may include:

• Personal information (name, email, phone number)
• Professional information (education, experience, skills)
• Profile information (bio, avatar, location)
• Communication data (messages, feedback)
• Usage data (how you interact with our platform)`
    },
    {
      icon: <Eye className="h-6 w-6 text-primary" />,
      title: "How We Use Your Information",
      content: `We use the information we collect to:

• Provide, maintain, and improve our services
• Connect users with relevant expertise and opportunities
• Facilitate communication between users
• Personalize your experience on our platform
• Analyze usage patterns to enhance functionality
• Ensure platform security and prevent abuse
• Comply with legal obligations`
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Information Sharing",
      content: `We may share your information in the following circumstances:

• With your explicit consent
• With other users as necessary to provide services (e.g., connecting problem-solvers)
• With service providers who assist in our operations
• In response to legal requests or to prevent harm
• In connection with a business transfer
• In aggregated, anonymized form for analytics

We never sell your personal information to third parties.`
    },
    {
      icon: <Lock className="h-6 w-6 text-primary" />,
      title: "Data Security",
      content: `We implement robust security measures to protect your data:

• End-to-end encryption for communications
• Secure data storage with access controls
• Regular security audits and updates
• Employee access restrictions on a need-to-know basis
• Secure API endpoints and authentication

While we strive for complete security, no online service is 100% secure.`
    },
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "Your Rights and Choices",
      content: `You have control over your data:

• Access, update, or delete your account information
• Opt out of non-essential communications
• Request data export or account deletion
• Control visibility of your profile and activity
• Manage notification preferences

Contact us to exercise these rights or if you have privacy concerns.`
    }
  ];

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      label: "Email",
      value: "amankumartiwari5255@gmail.com",
      action: "mailto:amankumartiwari5255@gmail.com"
    },
    {
      icon: <Phone className="h-5 w-5" />,
      label: "Phone",
      value: "+91 9031359720",
      action: "tel:+919031359720"
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
                <Shield className="h-4 w-4 mr-2" />
                Privacy & Security
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Privacy
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Policy
                </span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-lg leading-relaxed">
                Your privacy is our priority. Learn how we collect, use, and protect your personal information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Last Updated */}
      <section className="py-8 border-b">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Last updated: January 2024
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            {sections.map((section, index) => (
              <Card key={index} className="p-8">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {section.icon}
                    </div>
                    <CardTitle className="text-2xl">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray max-w-none">
                    {section.content.split('\n').map((paragraph, i) => (
                      <p key={i} className="mb-4 last:mb-0 text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Contact Us</h2>
            <p className="text-muted-foreground text-lg mb-8">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {contactInfo.map((contact, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full">
                      {contact.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-primary">{contact.label}</p>
                      <a
                        href={contact.action}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {contact.value}
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Separator className="my-8" />

            <p className="text-sm text-muted-foreground">
              We will respond to your inquiry within 30 days.
            </p>
          </div>
        </div>
      </section>

      {/* Legal Note */}
      <section className="py-16 border-t">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h3 className="text-xl font-semibold">Changes to This Policy</h3>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page and updating the "Last updated" date.
              We encourage you to review this Privacy Policy periodically.
            </p>
            <p className="text-sm text-muted-foreground">
              By using Think.Aman, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
