
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, MessageSquare, FileUp, Users, Clock, ArrowRight, MessageCircle, Clock4 } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-2 text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How Help.Aman Works</h1>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Connect with industry experts to solve your challenges quickly and efficiently
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <Card>
              <CardHeader className="pb-2">
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Post a Problem</CardTitle>
                <CardDescription>Share your challenge with our community</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Describe your issue in detail, providing context and information specific to your industry. 
                  The more details you provide, the easier it will be for experts to help you.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Get Expert Help</CardTitle>
                <CardDescription>Industry specialists will accept your request</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Experts in your field will review your problem and offer to help. 
                  You'll be able to see their profile, specialization, and success rate before accepting.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <MessageCircle className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Collaborate in Real-Time</CardTitle>
                <CardDescription>Chat directly with your expert</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Once you accept an offer, you'll be connected to a real-time chat with your expert.
                  Work together to solve your problem efficiently and effectively.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2 text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">Industry-Specific Knowledge</h2>
            <p className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed">
              Help.Aman connects you with experts in your specific industry
            </p>
          </div>

          <div className="space-y-6 mb-12">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-xl font-semibold mb-4">We Support These Industries</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Technology</p>
                    <p className="text-sm text-muted-foreground">Software, IT, Web Development</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Healthcare</p>
                    <p className="text-sm text-muted-foreground">Medical, Pharma, Healthcare IT</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Legal</p>
                    <p className="text-sm text-muted-foreground">Law, Compliance, Legal Tech</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Finance</p>
                    <p className="text-sm text-muted-foreground">Banking, Investment, FinTech</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Education</p>
                    <p className="text-sm text-muted-foreground">Teaching, EdTech, Administration</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Cybersecurity</p>
                    <p className="text-sm text-muted-foreground">Security, Risk, Compliance</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Civil Service</p>
                    <p className="text-sm text-muted-foreground">Government, Public Administration</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Engineering</p>
                    <p className="text-sm text-muted-foreground">Civil, Mechanical, Electrical</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">And Many More...</p>
                    <p className="text-sm text-muted-foreground">20+ industries supported</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-center">FAQs</h2>
            
            <div className="space-y-4">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold mb-2">How quickly will I get help?</h3>
                <p className="text-muted-foreground">
                  Most problems receive expert responses within 1-4 hours, depending on complexity and 
                  industry. Urgent requests can be prioritized for faster response times.
                </p>
              </div>
              
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold mb-2">Are the experts verified?</h3>
                <p className="text-muted-foreground">
                  Yes, all experts on Help.Aman go through a verification process that validates their 
                  industry expertise, credentials, and past experience.
                </p>
              </div>
              
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold mb-2">How is my data protected?</h3>
                <p className="text-muted-foreground">
                  We take data security seriously. All communications are encrypted, and you control what 
                  information you share. Our experts follow strict confidentiality guidelines.
                </p>
              </div>
              
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold mb-2">Can I become an expert?</h3>
                <p className="text-muted-foreground">
                  If you have expertise in your field and want to help others, you can apply to become an 
                  expert. We'll review your credentials and experience before approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
