// -------------------- Fixed Header --------------------
function FixedHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { cart } = useCart();
  const itemCount = (cart || []).reduce((total: number, item) => total + (item.quantity || 1), 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#1e4259] shadow-lg" : "bg-transparent"
      } h-16`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 z-50 hover:opacity-90 transition-opacity">
            <div className="relative h-10 w-40">
              <Image 
                src="/logo/logo.png" 
                alt="Garden & Grains Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Complete Navigation Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Home Link */}
            <Link 
              href="/" 
              className="text-white hover:text-[#a5bbb9] transition-colors font-medium text-sm px-3 py-2 rounded hover:bg-white/10"
            >
              Home
            </Link>
            
            {/* Menu Link */}
            <Link 
              href="/menu" 
              className="text-white hover:text-[#a5bbb9] transition-colors font-medium text-sm px-3 py-2 rounded hover:bg-white/10"
            >
              Menu
            </Link>
            
            {/* Catering Link */}
            <Link 
              href="/catering" 
              className="text-white hover:text-[#a5bbb9] transition-colors font-medium text-sm px-3 py-2 rounded hover:bg-white/10"
            >
              Catering
            </Link>
            
            {/* About Link */}
            <Link 
              href="/about" 
              className="text-white hover:text-[#a5bbb9] transition-colors font-medium text-sm px-3 py-2 rounded hover:bg-white/10"
            >
              About
            </Link>
            
            {/* Contact Link */}
            <Link 
              href="/contact" 
              className="text-white hover:text-[#a5bbb9] transition-colors font-medium text-sm px-3 py-2 rounded hover:bg-white/10"
            >
              Contact
            </Link>
            
            {/* Reviews Link */}
            <Link 
              href="/reviews" 
              className="flex items-center gap-1 text-white hover:text-[#ff9800] transition-colors font-medium text-sm px-3 py-2 rounded hover:bg-white/10"
            >
              <FaStar className="h-3 w-3" />
              <span>Reviews</span>
            </Link>
            
            {/* Driver Login Portal */}
            <Link 
              href="/driver-login" 
              className="flex items-center gap-1 bg-[#6c8665] text-white px-3 py-2 rounded-lg hover:bg-[#5a7465] transition-all duration-300 text-sm font-semibold"
            >
              <FaCar className="h-3 w-3" />
              <span>Driver Portal</span>
            </Link>
            
            {/* Book a Table Button */}
            <Link 
              href="/reserve" 
              className="bg-[#94aa4d] text-white px-3 py-2 rounded-lg hover:bg-[#7d9243] transition-all duration-300 text-sm font-semibold"
            >
              Book a Table
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <Link 
              href="/auth" 
              className="text-white hover:text-[#a5bbb9] transition-colors text-sm font-medium px-3 py-1 rounded hover:bg-white/10"
            >
              Sign In
            </Link>
            <Link 
              href="/cart" 
              className="relative text-white hover:text-[#a5bbb9] transition-colors p-2"
            >
              <span className="text-xl">🛒</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ff9800] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
