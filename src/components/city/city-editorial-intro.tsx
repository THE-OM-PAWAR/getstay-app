export function CityEditorialIntro({ cityName, stateName }: { cityName: string; stateName: string }) {
  return (
    <section className="mb-6 p-5 md:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xs">
      <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-zinc-100 mb-2">
        Student Accommodation & Hostel Guide for {cityName}, {stateName}
      </h2>
      <p className="text-xs md:text-sm text-gray-600 dark:text-zinc-400 leading-relaxed mb-3">
        {cityName} is a major educational center in {stateName}, home to premier institutions like MANIT, RGPV, AIIMS, LNCT, and Barkatullah University. GetStay helps students and young working professionals compare verified hostels, PGs, and student accommodations across key hubs including MP Nagar, Indrapuri, Kolar Road, and Arera Colony.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600 dark:text-zinc-400 pt-3 border-t border-gray-100 dark:border-zinc-800">
        <div>
          <span className="font-bold text-gray-900 dark:text-zinc-200">Average Rent:</span> ₹4,500 – ₹8,000 / month
        </div>
        <div>
          <span className="font-bold text-gray-900 dark:text-zinc-200">Popular Hubs:</span> MP Nagar, Indrapuri, Kolar Road
        </div>
        <div>
          <span className="font-bold text-gray-900 dark:text-zinc-200">Safety & Security:</span> 24/7 CCTV & Verified Stays
        </div>
      </div>
    </section>
  );
}
