"use client";

import { Search, CalendarCheck, Home } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "Search & Filter",
    description: "Find the perfect hostel based on your location, budget, and required amenities.",
    icon: Search,
  },
  {
    id: 2,
    title: "Book & Pay",
    description: "Secure your room instantly with our easy and safe online booking system.",
    icon: CalendarCheck,
  },
  {
    id: 3,
    title: "Move In",
    description: "Pack your bags and move into your new home away from home.",
    icon: Home,
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-white py-24 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-primary-light/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-3">
            How It Works
          </h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-brand-dark tracking-tight">
            Three simple steps to <br /> your next stay
          </h3>
        </motion.div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-100 -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {steps.map((step, idx) => (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 rounded-full bg-white shadow-xl border border-gray-50 flex items-center justify-center mb-6 relative">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold shadow-md">
                    {step.id}
                  </div>
                  <step.icon className="h-10 w-10 text-brand-primary" />
                </div>
                <h4 className="text-xl font-bold text-brand-dark mb-3">{step.title}</h4>
                <p className="text-gray-500 font-medium leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
