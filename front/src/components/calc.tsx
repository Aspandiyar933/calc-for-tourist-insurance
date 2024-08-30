import { useState } from 'react';
import axios from 'axios';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { APIResponse } from '@/types/calc';

export function Calc() {
  const [country, setCountry] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [age, setAge] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<APIResponse | null>(null);
  const [error, setError] = useState("");

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
  
  const handleGetPrice = async() => {
    if(!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResults(null);

    try{
      const response = await axios.post<APIResponse>("https://bestoffer.kz/api/mst/amanat", {
        age: parseInt(age),
        country,
        start_date: format(startDate, "yyyy-MM-dd"),
        end_date: format(endDate, "yyyy-MM-dd"),
      });

      setResults(response.data);
    } catch(err:any) {
      setError("An error occurred while fetching the insurance prices. Please try again.");
      console.error("API Error:", err.response ? err.response.data : err.message);
    } finally {
      setIsLoading(false);
    }
  }

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
      
      {results && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Результаты:</h2>
          <p>Страховая компания: {results.insurance_company.name}</p>
          <p>Сайт страховой компании: <a href={results.insurance_company.main_page} target="_blank" rel="noopener noreferrer">{results.insurance_company.main_page}</a></p>
          <h3 className="text-lg font-semibold mt-4 mb-2">Варианты страховки:</h3>
          <ul>
            {results.results.map((result, index) => (
              <li key={index} className="mb-2">
                <p>Сумма покрытия: {result.value} {result.currency}</p>
                <p>Стоимость: {result.premium} тенге</p>
                <p>Стоимость со скидкой: {result.discounted_premium} тенге</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

