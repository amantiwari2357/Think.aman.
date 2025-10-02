
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="py-20 md:py-28">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Connect, Collaborate, and Solve Together
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              SkillSync matches tech problems with the right expertise. Share your challenges or provide solutions in our collaborative platform.
            </p>
          </div>
          <div className="space-x-4">
            <Link to="/signup">
              <Button className="px-8">Get Started</Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" className="px-8">Learn More</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
