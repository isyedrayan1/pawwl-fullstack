import TestimonialsSection from "./TestimonialsSection";

const testimonials = [
  {
    quote: "“Game-changer for our golden retriever. The staff truly cares about every detail of his well-being.”",
    name: "Ayushi Mishra",
    role: "Dog Parent",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    quote: "“Outstanding vet care. Every single visit is amazing and stress-free for my cat.”",
    name: "Ankita Vashisht",
    role: "Cat Parent",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    quote: "“My pup comes home tired and happy every single day! Best day care experience!”",
    name: "Aarti Sharma",
    role: "Pet Parent",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    quote: "“The grooming service is top-notch. My poodle looks like a star every time!”",
    name: "Rohan Gupta",
    role: "Dog Parent",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
  {
    quote: "“Very professional staff and clean facilities. Highly recommended for all pet owners.”",
    name: "Sanya Malhotra",
    role: "Pet Enthusiast",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
  },
];

const Testimonials = () => <TestimonialsSection testimonials={testimonials} />;

export default Testimonials;
