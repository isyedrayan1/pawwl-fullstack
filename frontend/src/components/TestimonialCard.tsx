import { Star } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  rating?: number;
  avatar: string;
}

const Stars = ({ count, color = "#1b4965", size = 14 }: { count: number; color?: string; size?: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        size={size} 
        fill={i < count ? color : "transparent"} 
        className={i < count ? "text-transparent" : "text-[#dce6ee]"} 
      />
    ))}
  </div>
);

const TestimonialCard = ({ quote, name, role, rating = 5, avatar }: TestimonialCardProps) => {
  return (
    <div className="w-full h-full bg-white border border-[#dce6ee] p-5 sm:p-6 rounded-[24px] flex flex-col justify-between shadow-sm hover:shadow-md transition-all group min-h-[180px]">
      <div className="flex flex-col gap-3">
        <Stars count={rating} size={12} />
        <p className="font-normal text-[13px] sm:text-[14px] leading-relaxed text-[#212529] opacity-90 line-clamp-3">
          {quote}
        </p>
      </div>
      <div className="flex items-center gap-3 pt-4 mt-auto border-t border-[#f4f7f9]">
        <div className="w-8 h-8 rounded-full border border-[#dce6ee] p-0.5 overflow-hidden shadow-inner">
          <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-[13px] text-[#212529] leading-tight tracking-tight">{name}</span>
          <span className="font-medium text-[11px] text-[#788796]">{role}</span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
