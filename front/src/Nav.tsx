
const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
          <span className="text-2xl font-bold uppercase tracking-wider">Best Offer</span>
        </div>
        <div className="flex">
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {['Страхование', 'Займы', 'Бизнес', 'Новости', 'Контакты'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="uppercase text-sm tracking-wider border-transparent text-gray-900 hover:border-gray-900 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 font-medium"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  </nav>
  )
}

export default Navbar;