// -------------------- Action Section --------------------
function ActionSection() {
  return (
    <section className="py-16 px-6 bg-gradient-to-b from-[#1e4259] to-[#2c536b]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">How to Enjoy Garden & Grains</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Choose your preferred way to experience our fresh, healthy meals
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 mt-10 px-4">
          {/* Order Online */}
          <Link 
            href="/order" 
            className="flex-1 max-w-sm bg-[#94aa4d] text-white px-8 py-6 rounded-xl hover:bg-[#7d9243] text-xl font-bold transition-all duration-300 flex flex-col items-center justify-center gap-4 shadow-lg hover:shadow-xl"
          >
            <div className="text-4xl">📱</div>
            <div className="text-center">
              <div className="font-bold text-lg">Order Online</div>
              <div className="text-sm opacity-80 mt-2">Quick delivery & pickup</div>
            </div>
          </Link>
          
          {/* Book Catering */}
          <Link 
            href="/catering" 
            className="flex-1 max-w-sm bg-[#a5bbb9] text-[#1e4259] px-8 py-6 rounded-xl hover:bg-[#94aa9d] text-xl font-bold transition-all duration-300 flex flex-col items-center justify-center gap-4 shadow-lg hover:shadow-xl"
          >
            <div className="text-4xl">🎉</div>
            <div className="text-center">
              <div className="font-bold text-lg">Book Catering</div>
              <div className="text-sm opacity-90 mt-2">Events & gatherings</div>
            </div>
          </Link>
          
          {/* Reserve Table */}
          <Link 
            href="/reserve" 
            className="flex-1 max-w-sm bg-[#b6cac5] text-[#1e4259] px-8 py-6 rounded-xl hover:bg-[#a5b9b4] text-xl font-bold transition-all duration-300 flex flex-col items-center justify-center gap-4 shadow-lg hover:shadow-xl"
          >
            <div className="text-4xl">🪑</div>
            <div className="text-center">
              <div className="font-bold text-lg">Reserve Table</div>
              <div className="text-sm opacity-90 mt-2">Dine-in experience</div>
            </div>
          </Link>
        </div>
        
        {/* Contact Info */}
        <div className="text-center mt-10 text-white/90 text-sm">
          <p>📍 Uitsig Wine Farm: Spaanschemat River Rd, Fir Grove, Cape Town, 7806</p>
        </div>
      </div>
    </section>
  );
}
