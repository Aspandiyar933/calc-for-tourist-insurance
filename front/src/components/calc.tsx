import { useState } from 'react';
import axios, { AxiosResponse} from 'axios';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { APIResponse, InsuranceOption } from '@/types/calc';

export function Calc() {
  const [country, setCountry] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [age, setAge] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<APIResponse[]>([]);
  const [error, setError] = useState<string>("");

  const countries = [
    "Австралия", "Австрия", "Азербайджан", "Албания", "Алжир", "Ангола", "Аргентина", "Армения",
    "Беларусь", "Бельгия", "Болгария", "Бразилия", "Великобритания", "Венгрия", "Вьетнам", "Германия",
    "Греция", "Грузия", "Дания", "Египет", "Израиль", "Индия", "Индонезия", "Иран", "Ирландия",
    "Исландия", "Испания", "Италия", "Казахстан", "Канада", "Кипр", "Китай", "Колумбия", "Куба",
    "Латвия", "Литва", "Люксембург", "Малайзия", "Мальта", "Марокко", "Мексика", "Нидерланды",
    "Новая Зеландия", "Норвегия", "ОАЭ", "Польша", "Португалия", "Россия", "Румыния", "Сербия",
    "Сингапур", "Словакия", "Словения", "США", "Таиланд", "Турция", "Украина", "Финляндия", "Франция",
    "Хорватия", "Черногория", "Чехия", "Чили", "Швейцария", "Швеция", "Эстония", "Южная Корея", "Япония"
  ];
  
  const handleGetPrice = async(): Promise<void> => {
    if(!startDate || !endDate || !country || !age) {
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
    ];

    const requestData = {
      age: parseInt(age),
      country: country,
      start_date: format(startDate, "yyyy-MM-dd"),
      end_date: format(endDate, "yyyy-MM-dd")
    };

    try{
      const requests = endpoints.map(endpoint => 
        axios.post<APIResponse>(endpoint, requestData, {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          },
          withCredentials: true,
          timeout: 10000
        })
      );

      const responses = await Promise.all(requests.map(p => p.catch(e => e)));

      const successfulResponses = responses.filter((response): response is AxiosResponse<APIResponse> => !(response instanceof Error));      const errors = responses.filter((response): response is Error => response instanceof Error);

      if (successfulResponses.length > 0){
        const allResults = successfulResponses.map(response => response.data);
        console.log('API Responses:', allResults);
        setResults(allResults);
      } else {
        console.error('All API requests failed:', errors);
        setError('All API requests failed. Please try again.');
      }
      
      if (errors.length > 0) {
        console.error('API Errors:', errors);
        const errorMessages = errors.map(err => {
          if (axios.isAxiosError(err)) {
            if (err.code === 'ECONNABORTED') {
              return `Request timeout: ${err.config?.url}`;
            }
            return err.message;
          }
          return err.toString();
        });
        setError(`Errors occurred: ${errorMessages.join(', ')}`);
      }
    } catch(err:any) {
      if (axios.isAxiosError(err)) {
        console.error("API Error:", err.response?.data || err.message);
        setError(`An error occurred: ${err.response?.data?.message || err.message}`);
      } else {
        console.error("An unexpected error occurred:", err);
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const isSingleOption = (option: InsuranceOption | InsuranceOption[] | InsuranceOption[][]): option is InsuranceOption => {
    return !Array.isArray(option);
  };

  const isOptionArray = (option: InsuranceOption | InsuranceOption[] | InsuranceOption[][]): option is InsuranceOption[] => {
    return Array.isArray(option) && !Array.isArray(option[0]);
  };

  const renderInsuranceOptions = (options: InsuranceOption | InsuranceOption[] | InsuranceOption[][]): JSX.Element => {
    if (isSingleOption(options)) {
      return (
        <li className="mb-2">
          <p>Сумма покрытия: {options.value} {options.currency}</p>
          <p>Стоимость: {options.premium} тенге</p>
          <p>Стоимость со скидкой: {options.discounted_premium} тенге</p>
        </li>
      );
    }

    if (isOptionArray(options)) {
      return (
        <ul>
          {options.map((option, index) => (
            <li key={index} className="mb-2">
              <p>Сумма покрытия: {option.value} {option.currency}</p>
              <p>Стоимость: {option.premium} тенге</p>
              <p>Стоимость со скидкой: {option.discounted_premium} тенге</p>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <>
        {options.map((optionGroup, groupIndex) => (
          <div key={groupIndex} className="mt-2">
            <h5 className="text-sm font-semibold">Группа опций {groupIndex + 1}</h5>
            <ul>
              {optionGroup.map((option, optionIndex) => (
                <li key={optionIndex} className="mb-2">
                  <p>Сумма покрытия: {option.value} {option.currency}</p>
                  <p>Стоимость: {option.premium} тенге</p>
                  <p>Стоимость со скидкой: {option.discounted_premium} тенге</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger id="country">
            <SelectValue placeholder="Куда поедете" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={`w-full justify-start text-left font-normal ${!startDate && "text-muted-foreground"}`}>
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
            <Button variant="outline" className={`w-full justify-start text-left font-normal ${!endDate && "text-muted-foreground"}`}>
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
      </div>
      
      <Button
        className="bg-[#00303f] text-white mt-4"
        onClick={handleGetPrice}
        disabled={isLoading}
      >
        {isLoading ? "Загрузка..." : "Показать цены"}
      </Button>
      
      {error && <p className="text-red-500 mt-4">{error}</p>}
      
      {results.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Результаты:</h2>
          {results.map((result, index) => (
            <div key={index} className="mb-6 p-4 border rounded">
              <h3 className="text-lg font-semibold">{result.insurance_company.name}</h3>
              <p>Сайт страховой компании: <a href={result.insurance_company.main_page} target="_blank" rel="noopener noreferrer">{result.insurance_company.main_page}</a></p>
              <h4 className="text-md font-semibold mt-2">Варианты страховки:</h4>
              {renderInsuranceOptions(result.results)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

