
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-6 text-center py-20">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">404</h1>
          <h2 className="text-2xl font-medium">Page Not Found</h2>
          <p className="max-w-[600px] text-muted-foreground md:text-xl">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <Link to="/">
            <Button size="lg">Go back home</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default NotFound;
