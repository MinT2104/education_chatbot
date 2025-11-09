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
    <div className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-visible dark:bg-card/70">
      {/* Pastel radial mist overlays */}
      <div className="pointer-events-none absolute inset-0">
        {/* Blue left (extend toward center to blend) */}
        <div className="absolute bottom-6 -left-24 w-[640px] h-[360px] rounded-full bg-[radial-gradient(closest-side,rgba(59,130,246,0.28),transparent_70%)] dark:bg-[radial-gradient(closest-side,rgba(59,130,246,0.24),transparent_70%)] blur-3xl"></div>
        {/* Purple center (largest, sits behind as bridge) */}
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[760px] h-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.28),transparent_70%)] dark:bg-[radial-gradient(closest-side,rgba(139,92,246,0.24),transparent_70%)] blur-3xl"></div>
        {/* Lavender bridge to smooth overlaps */}
        <div
          className="absolute rounded-full blur-3xl"
          style={{
            left: "48%",
            top: "38%",
            width: "820px",
            height: "460px",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="w-full h-full rounded-full bg-[radial-gradient(closest-side,rgba(196,181,253,0.20),transparent_70%)] dark:bg-[radial-gradient(closest-side,rgba(196,181,253,0.18),transparent_70%)]"></div>
        </div>
        {/* Pink right (pull inward for blend) */}
        <div className="absolute bottom-8 -right-12 w-[640px] h-[360px] rounded-full bg-[radial-gradient(closest-side,rgba(244,114,182,0.28),transparent_70%)] dark:bg-[radial-gradient(closest-side,rgba(244,114,182,0.24),transparent_70%)] blur-3xl"></div>
      </div>
      <div className="relative p-2 sm:p-3">
        {/* <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <h2 className="text-sm sm:text-base font-semibold text-foreground">
            Start with a Space
          </h2>
          <button className="text-xs sm:text-sm font-medium text-foreground hover:text-foreground/80 transition-colors">
            Explore hundreds more →
          </button>
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2">
          {SPACES.map((space, idx) => (
            <div
              key={idx}
              className="group rounded-lg bg-card/60 dark:bg-card/40 hover:bg-card/75 dark:hover:bg-card/55 transition-colors p-2.5 sm:p-3 flex gap-2 shadow-[0_1px_2px_rgba(0,0,0,.06)] dark:shadow-[0_1px_2px_rgba(0,0,0,.2)] text-left min-h-24"
            >
              <div className="text-2xl shrink-0 leading-none self-start">
                {space.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm md:text-base font-semibold text-foreground mb-0.5">
                  {space.title}
                </div>
                <div className="text-xs md:text-sm text-foreground/80 leading-relaxed">
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
