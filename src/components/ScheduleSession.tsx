import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const details = [
  { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
  { icon: Mail, label: "Email", value: "hello@pawwl.com" },
  { icon: MapPin, label: "Address", value: "123 Pet Lane, Suite 100" },
  { icon: Clock, label: "Working Hours", value: "Mon–Sat: 9AM–7PM" },
];

const ScheduleSession = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary text-center">
        Schedule a session with Pawwl
      </h2>
      <p className="text-center text-muted-foreground mt-3 max-w-lg mx-auto">
        Whether it's grooming, vet check-ups, or training — book a session and let our experts take care of your best friend.
      </p>

      <div className="mt-12 grid md:grid-cols-2 gap-8 items-start">
        {/* Image collage */}
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=600&h=450&fit=crop"
            alt="Pet shop storefront"
            className="w-full h-80 object-cover rounded-2xl"
            loading="lazy"
          />
          <div className="absolute bottom-4 left-4 bg-secondary text-secondary-foreground rounded-full px-4 py-2 text-xs font-semibold shadow-lg">
            🐾 Trusted by 10K+ pet parents
          </div>
        </div>

        {/* Service info card */}
        <div className="bg-muted rounded-2xl p-6 md:p-8">
          <h3 className="font-heading font-bold text-xl text-primary">Pawwl Pet Services</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Full-service pet care including grooming, health check-ups, training sessions, and more.
          </p>

          <div className="mt-6 space-y-4">
            {details.map((d) => (
              <div key={d.label} className="flex items-start gap-3">
                <d.icon size={18} className="text-secondary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-primary">{d.label}</p>
                  <p className="text-sm text-muted-foreground">{d.value}</p>
                </div>
              </div>
            ))}
          </div>

          <Button className="mt-6 w-full rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 text-sm font-semibold">
            Book a Session
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default ScheduleSession;
