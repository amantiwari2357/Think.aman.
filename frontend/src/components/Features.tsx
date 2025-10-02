
import { Code, MessageSquare, Users } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <Code className="h-10 w-10 text-primary" />,
      title: "Share Code Challenges",
      description:
        "Upload project files, share code snippets, and describe your technical issues to find the perfect match for your problem."
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Connect with Experts",
      description:
        "Connect with skilled developers, students, and industry professionals who have the expertise to solve your specific challenges."
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: "Real-time Collaboration",
      description:
        "Collaborate in real-time through our integrated chat system to discuss solutions, exchange ideas, and solve problems efficiently."
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How SkillSync Works</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Our platform simplifies the process of finding solutions to your technical challenges.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 pt-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              {feature.icon}
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
