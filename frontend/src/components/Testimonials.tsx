
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Testimonials() {
  const testimonials = [
    {
      quote: "SkillSync helped me solve a complex database issue within hours. The expert I connected with was incredibly knowledgeable and patient.",
      author: "Sarah Johnson",
      role: "CS Student",
      avatar: "SJ"
    },
    {
      quote: "As a senior developer, I enjoy helping others on SkillSync. It keeps my skills sharp and the platform makes collaboration seamless.",
      author: "Michael Chen",
      role: "Senior Developer",
      avatar: "MC"
    },
    {
      quote: "Found a mentor through SkillSync who helped debug my AI project. The real-time collaboration feature is game-changing.",
      author: "Elena Rodriguez",
      role: "Data Scientist",
      avatar: "ER"
    }
  ];

  return (
    <section className="py-12 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">What Our Users Say</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Discover how SkillSync is changing the way people collaborate and solve technical challenges.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 pt-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="relative">
                <blockquote className="text-muted-foreground italic">"{testimonial.quote}"</blockquote>
              </div>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
