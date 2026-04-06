export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-1">
        <span className="text-xl font-black text-baemin italic tracking-tighter">Deli-Cheap</span>
        <span className="bg-baemin/10 text-baemin text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Beta</span>
      </div>
      <button className="p-2 -mr-2 text-gray-400 hover:text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </button>
    </header>
  );
}
