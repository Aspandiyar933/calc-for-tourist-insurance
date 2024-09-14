import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Phone, Calendar } from 'lucide-react'

const TravelInsuranceDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Travel Insurance Form</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gray-100 p-2 rounded-full">
              <Phone className="w-6 h-6 text-gray-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Ваши контакты</h2>
              <p className="text-sm text-gray-500">Заполните данные</p>
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg mb-6 text-sm">
            На e-mail и телефон отправим вам полис после оплаты. Если ранее пользовались продуктами Сравни, автоматически
            заполним ваши данные. Без спама и лишних звонков
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="phone">Номер телефона</Label>
              <Input id="phone" placeholder="+7 (___) ___-__-__" className="mt-1" />
              <p className="text-xs text-gray-500 mt-1">Укажите номер телефона полностью</p>
            </div>
            <div>
              <Label htmlFor="email">Email для получения полиса</Label>
              <Input id="email" type="email" className="mt-1" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-4">Сведения о туристе</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Имя как в Паспорте (на латинице)</Label>
              <Input id="firstName" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="lastName">Фамилия как в Паспорте (на латинице)</Label>
              <Input id="lastName" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="passportNumber">Номер паспорта*</Label>
              <Input id="passportNumber" placeholder="N12312312" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="passportDate">Дата выдачи паспорта*</Label>
              <div className="relative mt-1">
                <Input id="passportDate" placeholder="Дата выдачи паспорта" className="pr-10" />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            <div>
              <Label htmlFor="passportAuthority">Кем выдан паспорт*</Label>
              <Input id="passportAuthority" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="address">Адрес проживания*</Label>
              <Input id="address" className="mt-1" />
            </div>
          </div>
          
          <Button className="w-full mt-6 bg-gray-800 hover:bg-gray-700 text-white">Купить онлайн</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TravelInsuranceDialog;