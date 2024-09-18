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
import { Calendar as CalendarIcon } from "lucide-react";
import { APIResponse, InsuranceOption } from "@/types/calc";
import { Card } from "./ui/card";
import { Badge } from '@/components/ui/badge';
import React from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import TravelInsuranceDialog from './TravelInsuranceDialog';

export function Calc() {
  const [country, setCountry] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [age, setAge] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<APIResponse[]>([]);
  const [error, setError] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

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

  const FloatingLabel = ({ id, label, children }: { id: string; label: string; children: React.ReactNode }) => (
    <div className="relative pt-6">
      <label
        htmlFor={id}
        className={`absolute text-sm transition-all duration-200 ${
          React.isValidElement(children) && children.props.value
            ? "-top-1 left-2 text-xs text-gray-500"
            : "top-1/2 left-3 -translate-y-1/2 text-gray-400"
        }`}
      >
        {label}
      </label>
      {children}
    </div>
  );

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
      return <p>{options.premium} тенге</p>;
    }

    if (isOptionArray(options)) {
      return (
        <ul>
          {options.map((option, index) => (
            <li key={index} className="mb-2">
              <p>{option.premium} тенге</p>
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <FloatingLabel id="country" label="Куда поедете">
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
          </FloatingLabel>

          <FloatingLabel id="startDate" label="Уезжаете">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !startDate && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Уезжаете"}
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
          </FloatingLabel>

          <FloatingLabel id="endDate" label="Возвращаетесь">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !endDate && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Возвращаетесь"}
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
          </FloatingLabel>

          <FloatingLabel id="age" label="Возраст туриста">
            <Input
              type="number"
              placeholder="Возраст туриста"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </FloatingLabel>

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
          <div className="space-y-4">
          {results
              .sort((a, b) => 
                a.insurance_company.name.toLowerCase() === "nomad" ? -1 : 
                b.insurance_company.name.toLowerCase() === "nomad" ? 1 : 0
              )
              .map((result, index) => (
                <Card key={result.insurance_company.name} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                  <div className="flex items-center space-x-4">
                    <img
                      src={`${result.insurance_company.name}.svg`}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `${result.insurance_company.name}.png`;
                      }}
                      alt={result.insurance_company.name}
                      className="w-16 h-16 object-contain"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">
                        {result.insurance_company.name}
                      </h3>
                      {index === 0 && result.insurance_company.name.toLowerCase() === "nomad" && (
                        <Badge className="bg-green-500 text-white">Лучший выбор</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-bold">
                      <p>Страховая сумма</p>
                      {Array.isArray(result.results[0])
                        ? result.results[0][0].value
                        : result.results[0].value}{" "}
                      USD
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-bold"> 
                        {renderInsuranceOptions(result.results[0])}
                    </span>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                      <DialogTrigger asChild>
                        <Button>Оформить страховку</Button>
                      </DialogTrigger>
                      <TravelInsuranceDialog
                        countryId={result.country.external_info.id}
                        insuranceSumId={result.results[0].external_info.id}
                        startDate={startDate ?? new Date()}
                        endDate={endDate ?? new Date()}
                      />
                    </Dialog>
                  </div>
                </Card>
              ))}
          </div>
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
    </div>
  );
}
