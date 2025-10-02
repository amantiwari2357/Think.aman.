
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CTA() {
  return (
    <section className="py-12 md:py-20 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Solve Together?</h2>
            <p className="max-w-[700px] md:text-xl">
              Join SkillSync today and connect with a community of problem solvers.
            </p>
          </div>
          <div className="space-x-4">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="px-8">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
