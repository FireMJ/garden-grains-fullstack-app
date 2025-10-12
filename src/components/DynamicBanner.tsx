// -------------------- Dynamic Banner Optimized --------------------
const DynamicBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentIndex(Math.floor(Math.random() * bannerImages.length));
  }, []);

  const goNext = useCallback(
    () => setCurrentIndex((p) => (p + 1) % bannerImages.length),
    []
  );
  const goPrev = useCallback(
    () => setCurrentIndex((p) => (p === 0 ? bannerImages.length - 1 : p - 1)),
    []
  );

  // Auto-rotate
  useEffect(() => {
    if (!isClient || isPaused) return;
    const id = setInterval(goNext, 5000);
    return () => clearInterval(id);
  }, [isClient, isPaused, goNext]);

  // Smart Preload: current + next + prev + 2 ahead
  useEffect(() => {
    if (!isClient) return;

    const preloadIndices = [
      currentIndex,
      (currentIndex + 1) % bannerImages.length,
      (currentIndex - 1 + bannerImages.length) % bannerImages.length,
      (currentIndex + 2) % bannerImages.length,
      (currentIndex + 3) % bannerImages.length,
    ];

    preloadIndices.forEach((i) => {
      const img = new window.Image();
      img.src = bannerImages[i];
    });
  }, [currentIndex, isClient]);

  const handlers = useSwipeable({
    onSwipedLeft: goNext,
    onSwipedRight: goPrev,
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  if (!isClient) {
    return <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-gray-200 animate-pulse" />;
  }

  return (
    <div
      {...handlers}
      className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Promotional banners"
    >
      <NextImage
        key={currentIndex}
        src={bannerImages[currentIndex]}
        alt={`Banner ${currentIndex + 1}`}
        fill
        priority
        className="object-cover transition-opacity duration-700"
      />

      {/* Caption */}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded text-sm sm:text-base">
        wholesome. crave-worthy. nourishment-focused.
      </div>

      {/* Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#FAF7F2] to-transparent" />

      {/* Prev/Next */}
      <button
        aria-label="Previous banner"
        onClick={goPrev}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 focus:outline-none"
      >
        ◀
      </button>
      <button
        aria-label="Next banner"
        onClick={goNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 focus:outline-none"
      >
        ▶
      </button>

      {/* Pause/Play */}
      <button
        aria-label={isPaused ? "Play rotation" : "Pause rotation"}
        onClick={() => setIsPaused((p) => !p)}
        className="absolute top-2 left-2 bg-black/40 text-white px-3 py-1 rounded text-xs focus:outline-none hover:bg-black/60"
      >
        {isPaused ? "▶ Play" : "⏸ Pause"}
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {bannerImages.map((src, idx) => (
          <div
            key={idx}
            className="relative"
            onMouseEnter={() => setHoveredDot(idx)}
            onMouseLeave={() => setHoveredDot(null)}
          >
            <button
              aria-label={`Show banner ${idx + 1}`}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full focus:outline-none ${
                idx === currentIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
              }`}
            />
            {hoveredDot === idx && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white p-1 rounded shadow-lg z-50">
                <NextImage
                  src={src}
                  alt={`Preview ${idx + 1}`}
                  width={80}
                  height={50}
                  className="object-cover rounded"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
