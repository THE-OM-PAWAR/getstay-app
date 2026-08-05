// "use client";

// import { useEffect, useState, useCallback } from "react";
// import Image from "next/image";
// import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
// import useEmblaCarousel from "embla-carousel-react";
// import { motion } from "framer-motion";

// const testimonials = [
//   {
//     id: 1,
//     name: "Rahul Sharma",
//     role: "Engineering Student",
//     image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
//     text: "GetStay made finding a hostel near my college so easy. The amenities were exactly as shown in the pictures, and the process was seamless.",
//     rating: 5,
//   },
//   {
//     id: 2,
//     name: "Priya Desai",
//     role: "IT Professional",
//     image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
//     text: "As a working woman, safety is my top priority. The PG I found through GetStay is extremely safe, clean, and has a great community vibe.",
//     rating: 5,
//   },
//   {
//     id: 3,
//     name: "Aman Gupta",
//     role: "Medical Student",
//     image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
//     text: "The 'Best Value' tag really helped me find an affordable place with good food. Highly recommend to any student looking for budget options.",
//     rating: 4,
//   },
//   {
//     id: 4,
//     name: "Sneha Reddy",
//     role: "Design Student",
//     image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
//     text: "I loved the transparent pricing. No hidden fees, and the support team was very responsive when I wanted to change my move-in date.",
//     rating: 5,
//   },
// ];

// export function TestimonialsSection() {
//   const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center", skipSnaps: false });
//   const [selectedIndex, setSelectedIndex] = useState(0);

//   const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
//   const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

//   const onSelect = useCallback(() => {
//     if (!emblaApi) return;
//     setSelectedIndex(emblaApi.selectedScrollSnap());
//   }, [emblaApi, setSelectedIndex]);

//   useEffect(() => {
//     if (!emblaApi) return;
//     onSelect();
//     emblaApi.on("select", onSelect);
//     emblaApi.on("reInit", onSelect);
//   }, [emblaApi, onSelect]);

//   // Autoplay
//   useEffect(() => {
//     if (!emblaApi) return;
//     const autoplay = setInterval(() => {
//       emblaApi.scrollNext();
//     }, 4000);
//     return () => clearInterval(autoplay);
//   }, [emblaApi]);

//   return (
//     <section className="bg-brand-dark py-28 relative overflow-hidden">
//       {/* Background accents */}
//       <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/10 blur-[150px] rounded-full pointer-events-none" />
//       <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

//       <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="text-center max-w-2xl mx-auto mb-16"
//         >
//           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
//             <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
//             <span className="text-xs font-bold text-white tracking-widest uppercase">Trusted by 10,000+</span>
//           </div>
//           <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
//             Don't just take <br className="hidden md:block" />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary-light to-purple-400">our word for it</span>
//           </h3>
//         </motion.div>

//         {/* Embla Carousel */}
//         <motion.div 
//           initial={{ opacity: 0, scale: 0.95, y: 20 }}
//           whileInView={{ opacity: 1, scale: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           className="relative max-w-6xl mx-auto group"
//         >
//           <div className="overflow-hidden cursor-grab active:cursor-grabbing pb-8" ref={emblaRef}>
//             <div className="flex -ml-4">
//               {testimonials.map((testimonial, idx) => {
//                 const isActive = selectedIndex === idx;
//                 return (
//                   <div 
//                     key={testimonial.id} 
//                     className="flex-[0_0_100%] min-w-0 pl-4 md:flex-[0_0_60%] lg:flex-[0_0_45%] py-4"
//                   >
//                     <div className={`h-full flex flex-col relative transition-all duration-500 rounded-[2rem] p-8 md:p-10 ${isActive ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 shadow-[0_0_40px_rgba(57,50,216,0.15)] scale-100' : 'bg-white/5 border-white/5 scale-95 opacity-50 hover:opacity-80'} border backdrop-blur-xl`}>
//                       <Quote className={`absolute top-8 right-8 h-10 w-10 transition-colors duration-500 ${isActive ? 'text-brand-primary-light/40' : 'text-white/10'}`} />
                      
//                       <div className="flex items-center gap-1.5 mb-8">
//                         {[...Array(testimonial.rating)].map((_, i) => (
//                           <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
//                         ))}
//                       </div>
                      
//                       <p className={`text-lg md:text-xl leading-relaxed flex-1 mb-10 transition-colors duration-500 ${isActive ? 'text-white' : 'text-gray-400'}`}>
//                         "{testimonial.text}"
//                       </p>
                      
//                       <div className="flex items-center gap-4 mt-auto">
//                         <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-brand-primary-light shadow-lg">
//                           <Image
//                             src={testimonial.image}
//                             alt={testimonial.name}
//                             fill
//                             className="object-cover"
//                           />
//                         </div>
//                         <div>
//                           <h4 className="text-white font-bold text-lg">{testimonial.name}</h4>
//                           <p className="text-sm text-brand-primary-light">{testimonial.role}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Navigation Arrows (visible on hover) */}
//           <button 
//             onClick={scrollPrev}
//             className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 hover:scale-110 hidden md:flex active:scale-95"
//             aria-label="Previous testimonial"
//           >
//             <ChevronLeft className="h-6 w-6" />
//           </button>
          
//           <button 
//             onClick={scrollNext}
//             className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 hover:scale-110 hidden md:flex active:scale-95"
//             aria-label="Next testimonial"
//           >
//             <ChevronRight className="h-6 w-6" />
//           </button>

//           {/* Dots */}
//           <div className="flex justify-center gap-3 mt-6">
//             {testimonials.map((_, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => emblaApi?.scrollTo(idx)}
//                 className={`h-2.5 rounded-full transition-all duration-500 ${
//                   selectedIndex === idx ? "w-10 bg-brand-primary-light shadow-[0_0_10px_rgba(183,180,240,0.5)]" : "w-2.5 bg-white/20 hover:bg-white/40"
//                 }`}
//                 aria-label={`Go to slide ${idx + 1}`}
//               />
//             ))}
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }
