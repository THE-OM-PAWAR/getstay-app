"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export function CtaPartner() {
  return (
    <section className="bg-brand-white py-16 md:py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="bg-brand-primary/10 rounded-[40px] overflow-hidden lg:overflow-visible relative flex flex-col lg:flex-row items-center border border-brand-primary/20">

          {/* Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="p-8 sm:p-12 lg:p-16 lg:w-1/2 z-10 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-dark tracking-tight mb-6 leading-[1.1] max-w-md lg:max-w-none"
            >
              GetStay, <span className="italic font-light">your partner</span> <br className="hidden sm:block" /> in property growth.
            </motion.h2>

            <motion.p 
              variants={itemVariants} 
              className="text-gray-600 text-base sm:text-lg mb-8 sm:mb-10 max-w-md leading-relaxed font-medium"
            >
              Find verified tenants, manage bookings effortlessly, and scale your hostel or PG business from anywhere with our partner dashboard.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link
                href="/partner"
                className="group inline-flex items-center justify-center gap-2 bg-brand-dark text-white px-7 py-3.5 text-base font-semibold rounded-full overflow-hidden transition-all hover:bg-gray-800 hover:scale-105 active:scale-95 shadow-md"
              >
                Become a Partner
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Image Section - Phone Mockup */}
          <div className="hidden lg:flex lg:w-1/2 relative w-full h-[500px] justify-end lg:pr-16 mt-0">
            {/* The phone image mimicking the screenshot */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7, type: "spring" }}
              className="absolute -bottom-10 right-[15%] z-20 shadow-2xl w-[280px] h-[520px] rounded-[40px] overflow-hidden border-[8px] border-brand-dark bg-brand-dark"
            >
              {/* Camera Notch/Dynamic Island */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-brand-dark rounded-full z-30 flex items-center justify-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#101015]" />
                <div className="w-6 h-1 bg-[#101015] rounded-full" />
              </div>
              
              {/* Screen Content Wrapper */}
              <div className="relative w-full h-full rounded-[32px] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
                  alt="GetStay Partner Dashboard on Mobile"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* Decorative background circle behind the phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-primary/20 rounded-full blur-3xl lg:translate-x-[20%] lg:translate-y-[-10%]" />
          </div>

        </div>
      </div>
    </section>
  );
}
