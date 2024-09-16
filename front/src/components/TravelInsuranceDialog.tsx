import React, { useState } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Phone, Calendar } from 'lucide-react'

interface NomadCustomer {
  iin: string;
  phone_number: string;
  email: string;
  address: string;
}

interface Passport {
  full_name_in_latin: string;
  document_number: string;
  issue_date: string;
  issued_by: string;
}

interface InsuranceFormData {
  nomad_customer: NomadCustomer;
  passport: Passport;
}

const TravelInsuranceDialog = () => {
  const [formData, setFormData] = useState<InsuranceFormData>({
    nomad_customer: {
      iin: "",
      phone_number: "",
      email: "",
      address: ""
    },
    passport: {
      full_name_in_latin: "",
      document_number: "",
      issue_date: "",
      issued_by: ""
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const [section, field] = name.split('.')
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof InsuranceFormData],
        [field]: value
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await axios.post('/mst/nomad/order', formData)
      console.log('Order submitted successfully:', response.data)
      // Handle successful submission (e.g., show success message, close dialog)
    } catch (error) {
      console.error('Error submitting order:', error)
      // Handle error (e.g., show error message)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Travel Insurance Form</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
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
              <Label htmlFor="iin">ИИН</Label>
              <Input 
                id="iin" 
                name="nomad_customer.iin"
                value={formData.nomad_customer.iin}
                onChange={handleInputChange}
                placeholder="000000000000" 
                className="mt-1" 
              />
            </div>
            <div>
              <Label htmlFor="phone">Номер телефона</Label>
              <Input 
                id="phone" 
                name="nomad_customer.phone_number"
                value={formData.nomad_customer.phone_number}
                onChange={handleInputChange}
                placeholder="+7 (___) ___-__-__" 
                className="mt-1" 
              />
            </div>
            <div>
              <Label htmlFor="email">Email для получения полиса</Label>
              <Input 
                id="email" 
                name="nomad_customer.email"
                value={formData.nomad_customer.email}
                onChange={handleInputChange}
                type="email" 
                className="mt-1" 
              />
            </div>
            <div>
              <Label htmlFor="address">Адрес проживания</Label>
              <Input 
                id="address" 
                name="nomad_customer.address"
                value={formData.nomad_customer.address}
                onChange={handleInputChange}
                className="mt-1" 
              />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-4">Сведения о паспорте</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Имя и Фамилия как в Паспорте (на латинице)</Label>
              <Input 
                id="fullName" 
                name="passport.full_name_in_latin"
                value={formData.passport.full_name_in_latin}
                onChange={handleInputChange}
                className="mt-1" 
              />
            </div>
            <div>
              <Label htmlFor="passportNumber">Номер паспорта</Label>
              <Input 
                id="passportNumber" 
                name="passport.document_number"
                value={formData.passport.document_number}
                onChange={handleInputChange}
                placeholder="N12312312" 
                className="mt-1" 
              />
            </div>
            <div>
              <Label htmlFor="passportDate">Дата выдачи паспорта</Label>
              <div className="relative mt-1">
                <Input 
                  id="passportDate" 
                  name="passport.issue_date"
                  value={formData.passport.issue_date}
                  onChange={handleInputChange}
                  type="date"
                  className="pr-10" 
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            <div>
              <Label htmlFor="passportAuthority">Кем выдан паспорт</Label>
              <Input 
                id="passportAuthority" 
                name="passport.issued_by"
                value={formData.passport.issued_by}
                onChange={handleInputChange}
                className="mt-1" 
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full mt-6 bg-gray-800 hover:bg-gray-700 text-white">
            Купить онлайн
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TravelInsuranceDialog;