import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Scale,
  AlertTriangle,
  Users,
  Shield,
  Mail,
  Phone,
  Calendar,
  CheckCircle
} from "lucide-react";

export default function Terms() {
  const sections = [
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Acceptance of Terms",
      content: `By accessing and using Think.Aman, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.

This platform is intended for users who are 18 years of age or older. By using our service, you represent that you meet this age requirement.`
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "User Accounts and Responsibilities",
      content: `When you create an account with us, you must provide accurate, complete, and current information. You are responsible for:

• Safeguarding your account credentials
• All activities that occur under your account
• Maintaining the confidentiality of your login information
• Notifying us immediately of any unauthorized use

You agree not to use the platform for any unlawful purposes or to conduct any unlawful activity, including but not limited to fraud, embezzlement, money laundering, or insider trading.`
    },
    {
      icon: <Scale className="h-6 w-6 text-primary" />,
      title: "Platform Usage Guidelines",
      content: `Users must:

• Respect other community members and maintain professional conduct
• Not share inappropriate, offensive, or harmful content
• Not attempt to circumvent security measures or access restricted areas
• Not use automated tools to access the platform without permission
• Respect intellectual property rights of others
• Not spam, harass, or abuse other users

Violation of these guidelines may result in account suspension or termination.`
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-primary" />,
      title: "Limitation of Liability",
      content: `Think.Aman provides this service "as is" without any warranties, expressed or implied. We shall not be liable for:

• Any direct, indirect, incidental, special, or consequential damages
• Loss of profits, data, or other intangible losses
• Any harm resulting from your use of the platform
• The quality or reliability of connections made through our platform

Users engage with each other at their own risk and are responsible for their own due diligence.`
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: "Content and Intellectual Property",
      content: `Users retain ownership of content they post on our platform. By posting content, you grant us a non-exclusive, royalty-free, worldwide license to use, display, and distribute your content.

You represent that you own or have the necessary rights to post the content you share. We respect intellectual property rights and will respond to clear notices of alleged copyright infringement.`
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
                <FileText className="h-4 w-4 mr-2" />
                Terms & Conditions
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Terms of
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Service
                </span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-lg leading-relaxed">
                Please read these terms carefully before using Think.Aman. Your use of our platform constitutes acceptance of these terms.
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
          <div className="max-w-4xl mx-auto space-y-8">
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

            {/* Additional Terms */}
            <Card className="p-8">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">Additional Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Service Availability</h4>
                  <p className="text-muted-foreground">
                    We strive to maintain continuous service availability, but we do not guarantee that the platform
                    will be available at all times. We may perform maintenance, updates, or experience technical
                    difficulties that temporarily affect service availability.
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Termination</h4>
                  <p className="text-muted-foreground">
                    Either party may terminate this agreement at any time. We reserve the right to suspend or
                    terminate your account if you violate these terms or engage in harmful behavior. Upon
                    termination, your right to use the platform will cease immediately.
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Governing Law</h4>
                  <p className="text-muted-foreground">
                    These terms are governed by and construed in accordance with the laws of India. Any disputes
                    arising from these terms or your use of the platform will be subject to the exclusive
                    jurisdiction of the courts in Lucknow, Uttar Pradesh, India.
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Changes to Terms</h4>
                  <p className="text-muted-foreground">
                    We reserve the right to modify these terms at any time. We will notify users of significant
                    changes via email or platform notifications. Continued use of the platform after changes
                    constitutes acceptance of the modified terms.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Questions About These Terms?</h2>
            <p className="text-muted-foreground text-lg mb-8">
              If you have any questions about these Terms of Service or need clarification on any point, please contact us:
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

      {/* Agreement Section */}
      <section className="py-16 border-t">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h3 className="text-xl font-semibold">Agreement to Terms</h3>
            <p className="text-muted-foreground leading-relaxed">
              By using Think.Aman, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              If you do not agree with any part of these terms, please do not use our platform.
            </p>
            <div className="flex justify-center">
              <Badge variant="outline" className="px-6 py-3 text-sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Terms Effective: January 2025
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
