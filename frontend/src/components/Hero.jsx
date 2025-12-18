import React from 'react';

const Hero = () => {
  // Gambar-gambar bertema Workplace / Productivity
  const workspaces = [
    {
      src: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=300&q=80',
      alt: 'Office',
      style:
        'top-[10%] left-[15%] rotate-[-12deg] w-40 opacity-40 hover:opacity-100 hover:scale-110 hover:z-20',
    },
    {
      src: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=300&q=80',
      alt: 'Coworking',
      style:
        'top-[15%] right-[20%] rotate-[8deg] w-48 opacity-50 hover:opacity-100 hover:scale-110 hover:z-20',
    },
    {
      src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=300&q=80',
      alt: 'Laptop',
      style:
        'bottom-[20%] left-[20%] rotate-[15deg] w-44 opacity-30 hover:opacity-100 hover:scale-110 hover:z-20',
    },
    {
      src: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=300&q=80',
      alt: 'Coffee',
      style:
        'bottom-[15%] right-[25%] rotate-[-10deg] w-36 opacity-40 hover:opacity-100 hover:scale-110 hover:z-20',
    },
    {
      src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80',
      alt: 'Meeting Room',
      style: 'top-[45%] left-[5%] rotate-[-20deg] w-32 blur-[1px] opacity-20',
    },
    {
      src: 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&w=300&q=80',
      alt: 'Minimal Desk',
      style: 'top-[40%] right-[5%] rotate-[20deg] w-40 blur-[2px] opacity-25',
    },
  ];

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black selection:bg-white selection:text-black">
      {/* Background Gradient (Subtle Spotlight) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Floating Images Layer */}
      <div className="absolute inset-0 pointer-events-none md:pointer-events-auto">
        {workspaces.map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt={img.alt}
            className={`absolute object-cover rounded-lg shadow-2xl transition-all duration-700 ease-out cursor-pointer border border-white/5 ${img.style}`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="z-30 text-center flex flex-col items-center gap-6 mix-blend-normal">
        {/* Title */}
        <h1 className="text-[6rem] md:text-[11rem] leading-none font-semibold tracking-tighter text-white relative group cursor-default">
          PlaceRadar
          <span className="absolute top-4 md:top-10 -right-4 md:-right-8 text-2xl md:text-4xl font-light text-zinc-500 group-hover:text-white transition-colors">
            ®
          </span>
        </h1>

        {/* Subtitle / Search Concept */}
        <div className="flex flex-col md:flex-row items-center gap-3 text-lg md:text-xl text-zinc-400 font-light tracking-wide animate-fade-in-up">
          <span>Find your sanctuary for</span>

          <div className="flex items-center gap-2">
            <span className="px-5 py-1.5 border border-zinc-800 rounded-full text-zinc-200 bg-zinc-900/80 backdrop-blur-md hover:bg-white hover:text-black hover:border-white cursor-pointer transition-all duration-300">
              deep work
            </span>
            <span className="text-zinc-600">or</span>
            <span className="px-5 py-1.5 border border-zinc-800 rounded-full text-zinc-200 bg-zinc-900/80 backdrop-blur-md hover:bg-white hover:text-black hover:border-white cursor-pointer transition-all duration-300">
              meetings
            </span>
          </div>
        </div>
      </div>

      {/* Footer Hint */}
      <div className="absolute bottom-8 text-zinc-600 text-xs tracking-widest uppercase">
        Kaliurang • Sleman • Yogyakarta
      </div>
    </div>
  );
};

export default Hero;
