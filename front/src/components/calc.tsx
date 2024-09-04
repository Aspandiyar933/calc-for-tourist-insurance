import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Mail, Info } from "lucide-react";
import { APIResponse, InsuranceOption } from "@/types/calc";
import { Card } from "./ui/card";

export function Calc() {
  const [country, setCountry] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [age, setAge] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<APIResponse[]>([]);
  const [error, setError] = useState<string>("");

  const countries = [
    "Австралия",
    "Австрия",
    "Азербайджан",
    "Албания",
    "Алжир",
    "Ангола",
    "Аргентина",
    "Армения",
    "Беларусь",
    "Бельгия",
    "Болгария",
    "Бразилия",
    "Великобритания",
    "Венгрия",
    "Вьетнам",
    "Германия",
    "Греция",
    "Грузия",
    "Дания",
    "Египет",
    "Израиль",
    "Индия",
    "Индонезия",
    "Иран",
    "Ирландия",
    "Исландия",
    "Испания",
    "Италия",
    "Казахстан",
    "Канада",
    "Кипр",
    "Китай",
    "Колумбия",
    "Куба",
    "Латвия",
    "Литва",
    "Люксембург",
    "Малайзия",
    "Мальта",
    "Марокко",
    "Мексика",
    "Нидерланды",
    "Новая Зеландия",
    "Норвегия",
    "ОАЭ",
    "Польша",
    "Португалия",
    "Россия",
    "Румыния",
    "Сербия",
    "Сингапур",
    "Словакия",
    "Словения",
    "США",
    "Таиланд",
    "Турция",
    "Украина",
    "Финляндия",
    "Франция",
    "Хорватия",
    "Черногория",
    "Чехия",
    "Чили",
    "Швейцария",
    "Швеция",
    "Эстония",
    "Южная Корея",
    "Япония",
  ];

  const handleGetPrice = async (): Promise<void> => {
    if (!startDate || !endDate || !country || !age) {
      setError("Please select both start and end dates.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResults([]);

    const endpoints = [
      "https://bestoffer.kz/api/mst/amanat",
      "https://bestoffer.kz/api/mst/interteach",
      "https://bestoffer.kz/api/mst/asko",
      "https://bestoffer.kz/api/mst/freedom",
      "https://bestoffer.kz/api/mst/nomad",
      "https://bestoffer.kz/api/mst/jusan",
    ];

    const requestData = {
      age: parseInt(age),
      country: country,
      start_date: format(startDate, "yyyy-MM-dd"),
      end_date: format(endDate, "yyyy-MM-dd"),
    };

    try {
      const requests = endpoints.map((endpoint) =>
        axios.post<APIResponse>(endpoint, requestData, {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          withCredentials: true,
          timeout: 10000,
        })
      );

      const responses = await Promise.all(
        requests.map((p) => p.catch((e) => e))
      );

      const successfulResponses = responses.filter(
        (response): response is AxiosResponse<APIResponse> =>
          !(response instanceof Error)
      );
      const errors = responses.filter(
        (response): response is Error => response instanceof Error
      );

      if (successfulResponses.length > 0) {
        const allResults = successfulResponses.map((response) => response.data);
        console.log("API Responses:", allResults);
        setResults(allResults);
      } else {
        console.error("All API requests failed:", errors);
        setError("All API requests failed. Please try again.");
      }

      if (errors.length > 0) {
        console.error("API Errors:", errors);
        const errorMessages = errors.map((err) => {
          if (axios.isAxiosError(err)) {
            if (err.code === "ECONNABORTED") {
              return `Request timeout: ${err.config?.url}`;
            }
            return err.message;
          }
          return err.toString();
        });
        setError(`Errors occurred: ${errorMessages.join(", ")}`);
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error("API Error:", err.response?.data || err.message);
        setError(
          `An error occurred: ${err.response?.data?.message || err.message}`
        );
      } else {
        console.error("An unexpected error occurred:", err);
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isSingleOption = (
    option: InsuranceOption | InsuranceOption[] | InsuranceOption[][]
  ): option is InsuranceOption => {
    return !Array.isArray(option);
  };

  const isOptionArray = (
    option: InsuranceOption | InsuranceOption[] | InsuranceOption[][]
  ): option is InsuranceOption[] => {
    return Array.isArray(option) && !Array.isArray(option[0]);
  };

  const renderInsuranceOptions = (
    options: InsuranceOption | InsuranceOption[] | InsuranceOption[][]
  ): JSX.Element => {
    if (isSingleOption(options)) {
      return (
        <li className="mb-2">
          <p>Стоимость: {options.premium} тенге</p>
        </li>
      );
    }

    if (isOptionArray(options)) {
      return (
        <ul>
          {options.map((option, index) => (
            <li key={index} className="mb-2">
              <p>Стоимость: {option.premium} тенге</p>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <>
        {options.map((optionGroup, groupIndex) => (
          <div key={groupIndex} className="mt-2">
            <h5 className="text-sm font-semibold">
              Группа опций {groupIndex + 1}
            </h5>
            <ul>
              {optionGroup.map((option, optionIndex) => (
                <li key={optionIndex} className="mb-2">
                  <p>Стоимость: {option.premium} тенге</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="p-8 bg-white">
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
              ВЗР на выгодных условиях со страховой суммой от 30 000 до 100 000
              $/€
            </p>
          </div>
          <div className="flex-shrink-0">
            <img
              src={"mst.webp"}
              alt="Travel Insurance Illustration"
              className="w-80 h-auto"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger id="country">
              <SelectValue placeholder="Куда поедете" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  !startDate && "text-muted-foreground"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Уезжаете</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  !endDate && "text-muted-foreground"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Возвращаетесь</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Input
            type="number"
            placeholder="Возраст туриста"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <Button
            className="bg-[#00303f] text-white mt-4"
            onClick={handleGetPrice}
            disabled={isLoading}
          >
            {isLoading ? "Загрузка..." : "Показать цены"}
          </Button>
        </div>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {results.length > 0 && (
        <div className="max-w-6xl mx-auto p-8">
          <h2 className="text-xl font-bold mb-2">Результаты:</h2>
          {results.map((result, index) => (
            <Card className="w-full max-w-4xl mx-auto p-4 m-4 bg-gray-50">
              <div key={index}>
                <div className="font-semibold text-lg">
                  <h3 className="text-sm font-semibold">
                    {result.insurance_company.name}
                  </h3>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-1xl font-bold">
                    {renderInsuranceOptions(result.results[0])}
                  </span>
                  <a
                    href={result.insurance_company.main_page}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-blue-900 hover:bg-blue-800 text-white">
                      Купить онлайн
                    </Button>
                  </a>
                  <Info className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto p-8">
        <Card className="md:row-span-2 p-8 bg-white shadow-md flex flex-col h-full relative overflow-hidden">
          <div className="z-10">
            <h2 className="text-4xl font-bold mb-4">Идеально для визы</h2>
            <p className="text-gray-600 text-xl mb-8 max-w-[70%]">
              Мы поможем выбрать страховку для путешествия в любую точку мира.
            </p>
          </div>
          <div className="absolute bottom-0 right-0 w-auto h-auto flex items-end justify-end">
            <img
              src={"cardmst.png"}
              alt="Travel illustration"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </Card>

        <Card className="p-8 bg-white shadow-md">
          <h2 className="text-2xl font-bold mb-3">Выгодно</h2>
          <p className="text-gray-600">
            Стоимость страховых полисов может различаться. Мы рассчитаем
            стоимость в нескольких компаниях, чтобы вы могли выбрать самый
            выгодный вариант.
          </p>
        </Card>

        <Card className="p-8 bg-white shadow-md">
          <h3 className="text-2xl font-bold mb-3">Без комиссии</h3>
          <p className="text-gray-600">
            Наш сервис полностью бесплатен для пользователей. Полисы
            предлагаются по ценам страховых компаний без дополнительных наценок.
          </p>
        </Card>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <h3 className="text-4xl font-bold mb-10">
          Как оформить туристическую страховку
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-gray-200 rounded-lg h-auto flex items-center justify-center overflow-hidden">
            <img
              src={"woman.png"}
              alt="Happy travelers"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <ul className="space-y-6 text-lg">
              <li className="flex items-start">
                <span className="w-3 h-3 bg-black rounded-full mt-2 mr-4 flex-shrink-0"></span>
                <span>Укажите страну и даты поездки</span>
              </li>
              <li className="flex items-start">
                <span className="w-3 h-3 bg-black rounded-full mt-2 mr-4 flex-shrink-0"></span>
                <span>Сравните условия и выберите наилучший вариант</span>
              </li>
              <li className="flex items-start">
                <span className="w-3 h-3 bg-black rounded-full mt-2 mr-4 flex-shrink-0"></span>
                <span>Заполните анкету на сайте</span>
              </li>
              <li className="flex items-start">
                <span className="w-3 h-3 bg-black rounded-full mt-2 mr-4 flex-shrink-0"></span>
                <span>Оплатите полис</span>
              </li>
              <li className="flex items-start">
                <span className="w-3 h-3 bg-black rounded-full mt-2 mr-4 flex-shrink-0"></span>
                <span>Получите полис на электронную почту</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <div className="max-w-6xl mx-auto ">
          <h2 className="text-4xl font-bold mb-10">
            Что делать если что-то случилось
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-8 bg-white shadow-md">
              <h3 className="text-xl font-bold mb-2">
                Обратитесь к вашему ассистансу
              </h3>
              <p className="text-gray-600">
                Воспользуйтесь контактами в вашем полисе
              </p>
            </Card>

            <Card className="p-8 bg-white shadow-md">
              <h3 className="text-xl font-bold mb-2">
                Следуйте указаниям оператора
              </h3>
              <p className="text-gray-600">
                Вас проинструктируют по получению помощи и подберут подходящее
                медицинское учреждение
              </p>
            </Card>

            <Card className="p-8 bg-white shadow-md">
              <h3 className="text-xl font-bold mb-2">
                Сохраняйте все документы и чеки
              </h3>
              <p className="text-gray-600">
                При возникновении расходов предоставьте их в страховую компанию
              </p>
            </Card>
          </div>
        </div>
      </div>

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
                продуктов. Платформа предлагает широкий ассортимент предложений
                от ведущих компаний, обеспечивая удобный поиск, сравнение и
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
    </div>
  );
}
