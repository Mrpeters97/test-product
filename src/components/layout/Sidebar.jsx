export default function Sidebar() {
  const menuItems = [
    { label: 'Product catalog', type: 'header' },
    { label: 'Overview', type: 'item' },
    { label: 'Products', type: 'item', active: true },
    { label: 'Agreement information', type: 'header', mt: 'mt-6' },
    { label: 'Overview', type: 'item', active: false },
    { label: 'Agreements', type: 'item', active: false },
    { label: 'Collections', type: 'item', active: false },
    { label: 'Customer & risk management', type: 'header', mt: 'mt-6' },
    { label: 'KYC Tasks', type: 'item', active: false },
    { label: 'Page & channel configuration', type: 'header', mt: 'mt-6' },
    { label: 'Channel configuration', type: 'item', active: false },
    { label: 'Page templates', type: 'item', active: false },
    { label: 'Theming', type: 'item', active: false },
    { label: 'Offer list pages', type: 'item', active: false },
  ]

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-[#f9f9f9] border-r border-gray-200 overflow-y-auto z-40">
      <div className="p-4 border-b border-gray-100 flex items-center gap-2 mb-4 bg-white">
        <div className="w-8 h-8 rounded bg-black flex items-center justify-center text-white font-bold text-xs">HS</div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-black leading-none">Hub Studio</span>
          <span className="text-[10px] text-gray-400">v10.1</span>
        </div>
        <span className="ml-auto text-gray-300">↕</span>
      </div>
      <nav className="px-2 flex flex-col">
        {menuItems.map((item, index) => (
          item.type === 'header' ? (
            <div key={index} className={`text-[10px] font-bold text-gray-400 uppercase px-3 py-2 ${item.mt || ''}`}>
              {item.label}
            </div>
          ) : (
            <a
              key={index}
              href="#"
              className={`text-xs font-medium px-3 py-2 rounded-sm transition-colors ${
                item.active 
                  ? 'bg-white text-black shadow-sm border-l-2 border-black -ml-[2px]' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </a>
          )
        ))}
      </nav>
    </div>
  )
}
