import { Mail } from "lucide-react";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-12 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 flex items-center justify-center mr-3">
                <img src={"logo.png"} alt="logo" className="h-auto w-auto" />
              </div>
              <span className="text-xl font-bold">Best Offer</span>
            </div>
            <h3 className="font-semibold mb-2">О проекте:</h3>
            <p className="text-sm text-gray-600 max-w-xl">
              BestOffer.kz — это незаменимый финансовый помощник, который
              помогает вам сделать лучший выбор среди финансовых и страховых
              продуктов. Платформа предлагает широкий ассортимент предложений от
              ведущих компаний, обеспечивая удобный поиск, сравнение и
              оформление продуктов онлайн. С нами вы экономите время и деньги,
              находя самые выгодные условия. Доверьтесь BestOffer.kz и делайте
              осознанные финансовые решения с уверенностью.
            </p>
          </div>
          <div className="text-right">
            <p className="mb-2">Ответим на все ваши вопросы</p>
            <div className="flex items-center justify-end mb-4">
              <Mail className="w-5 h-5 text-blue-500 mr-2" />
              <a
                href="mailto:boffer.kz@gmail.com"
                className="text-blue-500 hover:underline"
              >
                boffer.kz@gmail.com
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-500 text-center">
          © Финансовый маркетплейс BestOffer.kz
        </div>
      </div>
    </footer>
  );
};

export default Footer;
