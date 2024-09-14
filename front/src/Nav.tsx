const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md p-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <img src={"logo.png"} alt="logo" className="h-auto w-auto" />
          </div>
          <div className="flex">
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {["Страхование", "Займы", "Бизнес", "Новости", "Контакты"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="uppercase text-sm tracking-wider border-transparent text-gray-900 hover:border-gray-900 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 font-medium"
                  >
                    {item}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto p-8">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex-1 pr-8">
              <h1 className="text-5xl font-bold mb-4">
                Туристическая
                <br />
                страховка
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Сравните цены страховок для путешествий за границу. Купите полис
                ВЗР на выгодных условиях со страховой суммой от 30 000 до 100
                000 $/€
              </p>
            </div>
            <div className="flex-shrink-0">
              <img
                src={"image.png"}
                alt="Travel Insurance Illustration"
                className="w-auto h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
