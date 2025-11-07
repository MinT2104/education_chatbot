import MainLayout from "../../../layouts/MainLayout";

const LibraryPage = () => {
  // Mock data for images
  const images = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400",
      title: "Mountain Landscape",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      title: "Forest Path",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400",
      title: "Sunset View",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
      title: "Nature Trail",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400",
      title: "Lake View",
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400",
      title: "Ocean Waves",
    },
    {
      id: 7,
      url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400",
      title: "Desert Dunes",
    },
    {
      id: 8,
      url: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400",
      title: "Mountain Peak",
    },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className=" border-b border-slate-200/70 dark:border-white/10 bg-[#f8fafc] dark:bg-[#111827]">
          <div className="px-20 md:px-6 py-4 ">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Library
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Browse and manage your images
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Images Section */}
            <div className="mb-8">
              {/* Image Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer transition-transform hover:scale-105"
                  >
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white text-sm font-medium">
                          {image.title}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LibraryPage;
