import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Newsletter = () => (
  <section className="py-12 bg-warm-gray">
    <div className="container mx-auto px-4">
      <div className="max-w-xl mx-auto text-center">
        <h3 className="font-heading font-bold text-lg text-primary">Newsletter Signup</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Get the latest tips, products, and updates delivered to your inbox.
        </p>
        <div className="mt-4 flex gap-2">
          <Input placeholder="Enter your email" className="rounded-full flex-1" />
          <Button className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6">Subscribe</Button>
        </div>
      </div>
    </div>
  </section>
);

export default Newsletter;
