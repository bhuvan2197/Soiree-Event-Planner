import React from 'react';

export default function Badge({ children, variant = 'burgundy', size = 'sm', className = '', onClick }) {
  const base = "inline-flex items-center gap-1.5 font-medium rounded-full tracking-wide transition-all";
  
  const sizes = {
    xs: "text-[11px] px-2 py-0.5",
    sm: "text-xs px-2.5 py-1",
    md: "text-sm px-3.5 py-1.5",
  };

  const variants = {
    burgundy: "bg-soiree-burgundy text-[#FAF5EC] border border-soiree-burgundyDeep/30",
    burgundyOutline: "text-soiree-burgundy bg-soiree-burgundy/5 border border-soiree-burgundy/25 hover:bg-soiree-burgundy/10",
    gold: "bg-soiree-gold/15 text-soiree-burgundyDeep border border-soiree-gold/40",
    sand: "bg-soiree-sand/60 text-soiree-ink border border-soiree-sand",
    rose: "bg-soiree-rose/15 text-soiree-rose border border-soiree-rose/30",
    live: "bg-emerald-800 text-emerald-50 border border-emerald-600 shadow-sm",
    demo: "bg-amber-900/15 text-amber-950 border border-amber-800/30",
    confirmed: "bg-emerald-900/10 text-emerald-900 border border-emerald-700/30",
    invited: "bg-blue-900/10 text-blue-900 border border-blue-700/30",
    declined: "bg-stone-300 text-stone-700 border border-stone-400",
  };

  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant] || variants.burgundy} ${className}`}
    >
      {children}
    </Component>
  );
}
