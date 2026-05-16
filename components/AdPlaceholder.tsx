export default function AdPlaceholder() {
  return (
    <div className="w-full max-w-4xl mx-auto my-12">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-8 flex flex-col items-center justify-center text-center">
        <div className="absolute top-2 right-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Sponsored
        </div>
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
        </div>
        <h3 className="text-gray-900 font-semibold mb-2">Advertise Here</h3>
        <p className="text-gray-500 text-sm max-w-xs">
          Reach thousands of users looking to save their favorite X content.
        </p>
        <button className="mt-4 px-6 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-gray-300 transition-colors shadow-sm">
          Contact Us
        </button>
      </div>
    </div>
  );
}
