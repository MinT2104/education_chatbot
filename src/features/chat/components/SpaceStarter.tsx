import React from "react";

type SpaceItem = {
  title: string;
  description: string;
  icon: string;
};

const SPACES: SpaceItem[] = [
  {
    title: "Lesson Plan Generator",
    description: "Generate and modify comprehensive lesson plans on any topic",
    icon: "📘",
  },
  {
    title: "Multiple Choice Quiz Builder",
    description: "Generate a quiz and export to popular formats",
    icon: "📝",
  },
  {
    title: "Text Translator",
    description: "Convert text between 100+ languages",
    icon: "🌐",
  },
  {
    title: "Worksheet Generator",
    description: "Create a worksheet for any subject",
    icon: "📄",
  },
  {
    title: "Rubric Generator",
    description: "Generate a rubric for an assignment",
    icon: "📊",
  },
  {
    title: "Text Leveler",
    description: "Adjust reading level for any grade",
    icon: "🔧",
  },
];

const SpaceStarter: React.FC = () => {
  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-2xl overflow-hidden bg-white shadow-sm">
      {/* Pastel radial mist overlays */}
      <div className="pointer-events-none absolute inset-0">
        {/* Blue left (extend toward center to blend) */}
        <div className="absolute bottom-6 -left-24 w-[640px] h-[360px] rounded-full bg-[radial-gradient(closest-side,rgba(59,130,246,0.52),transparent_55%)] blur-3xl"></div>
        {/* Purple center (largest, sits behind as bridge) */}
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[760px] h-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.50),transparent_55%)] blur-3xl"></div>
        {/* Lavender bridge to smooth overlaps */}
        <div className="absolute rounded-full blur-3xl" style={{ left: "48%", top: "38%", width: "820px", height: "460px" , transform: "translate(-50%, -50%)" }}>
          <div className="w-full h-full rounded-full bg-[radial-gradient(closest-side,rgba(196,181,253,0.22),transparent_60%)]"></div>
        </div>
        {/* Pink right (pull inward for blend) */}
        <div className="absolute bottom-8 -right-12 w-[640px] h-[360px] rounded-full bg-[radial-gradient(closest-side,rgba(244,114,182,0.44),transparent_55%)] blur-3xl"></div>
      </div>

      <div className="relative p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Start with a Space</h2>
          <button className="text-sm font-medium text-black hover:text-black">
            Explore hundreds more →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {SPACES.map((space, idx) => (
            <div
              key={idx}
              className="group rounded-xl bg-white/70 hover:bg-white/80 transition-colors p-5 flex gap-3 shadow-[0_1px_2px_rgba(0,0,0,.06)] text-left"
            >
              <div className="text-3xl shrink-0 leading-none self-center">{space.icon}</div>
              <div className="min-w-0">
                <div className="text-base md:text-lg font-semibold text-foreground mb-1">
                  {space.title}
                </div>
                <div className="text-sm md:text-base text-foreground/80 leading-relaxed">
                  {space.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpaceStarter;


