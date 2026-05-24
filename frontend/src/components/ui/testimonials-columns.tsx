"use client";
import React from "react";
import { motion } from "motion/react";

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: { text: string; name: string; role?: string }[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, name, role }, i) => (
                <div 
                  className="p-8 rounded-3xl border border-border-design bg-white shadow-sm hover:shadow-md transition-shadow max-w-[350px] w-full flex flex-col gap-4" 
                  key={i}
                >
                  <p className="text-[15px] leading-relaxed text-brand-dark/80 font-medium">
                    "{text}"
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-accent font-bold text-sm">
                      {name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <div className="font-bold text-sm text-brand-dark tracking-tight leading-tight">{name}</div>
                      {role && <div className="text-xs text-brand-dark/50 font-medium mt-0.5">{role}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
