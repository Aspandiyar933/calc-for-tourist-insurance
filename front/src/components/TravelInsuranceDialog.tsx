import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "react-hot-toast";

interface TravelInsuranceDialogProps {
  countryId: number;
  insuranceSumId: number;
  startDate: Date;
  endDate: Date;
}

interface OrderResponse {
  order_id: number;
  total_cost: number;
  pay_link: string;
}


const TravelInsuranceDialog: React.FC<TravelInsuranceDialogProps> = ({
  countryId,
  insuranceSumId,
  startDate,
  endDate,
}) => {
  // Nomad Customer Fields
  const [iin, setIin] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // Passport Fields
  const [fullNameInLatin, setFullNameInLatin] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [issuedBy, setIssuedBy] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResponse, setOrderResponse] = useState<OrderResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
      country_id: countryId,
      insurance_sum_id: insuranceSumId,
      start_date: format(startDate, "yyyy-MM-dd"),
      end_date: format(endDate, "yyyy-MM-dd"),
      nomad_customer: {
        iin,
        phone_number: phoneNumber,
        email,
        address,
      },
      passport: {
        full_name_in_latin: fullNameInLatin,
        document_number: documentNumber,
        issue_date: issueDate,
        issued_by: issuedBy,
      },
    };

    try {
      const response = await axios.post(
        "https://bestoffer.kz/api/mst/nomad/order",
        formData
      );
      console.log("Order submitted successfully:", response.data);
      setOrderResponse(response.data);
      toast.success("Страховка успешно оформлена!");
      // Handle successful submission (e.g., close dialog)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error submitting order:", error.response?.data);
        if (error.response?.status === 422) {
          const errorData = error.response.data;
          console.log("Validation errors:", errorData);
          toast.error(
            "Пожалуйста, проверьте введенные данные и попробуйте снова."
          );
        } else {
          toast.error(
            "Произошла ошибка при оформлении страховки. Пожалуйста, попробуйте позже."
          );
        }
      } else {
        console.error("An unexpected error occurred:", error);
        toast.error(
          "Произошла неожиданная ошибка. Пожалуйста, попробуйте позже."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden flex flex-col max-h-[90vh]">
      <DialogHeader className="p-6 pb-2">
        <DialogTitle className="text-xl font-bold">
          Оформление страховки
        </DialogTitle>
      </DialogHeader>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 pt-0 flex-1 overflow-y-auto"
      >
        {/*
        <div className="bg-gray-100 p-4 rounded-md mb-4 space-y-1">
          <h3 className="font-semibold mb-2">Информация о поездке:</h3>
          <p>
            <strong>Страна (ID):</strong> {countryId}
          </p>
          <p>
            <strong>Страховка (ID):</strong> {insuranceSumId}
          </p>
          <p>
            <strong>Дата начала:</strong> {format(startDate, "dd.MM.yyyy")}
          </p>
          <p>
            <strong>Дата окончания:</strong> {format(endDate, "dd.MM.yyyy")}
          </p>
        </div>
        */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="iin" className="text-sm font-medium">
              ИИН
            </Label>
            <Input
              id="iin"
              value={iin}
              onChange={(e) => setIin(e.target.value)}
              placeholder="000000000000"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-sm font-medium">
              Номер телефона
            </Label>
            <Input
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+7 (___) ___-__-__"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email для получения полиса
            </Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="address" className="text-sm font-medium">
              Адрес проживания
            </Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="fullName" className="text-sm font-medium">
              Имя и Фамилия как в Паспорте (на латинице)
            </Label>
            <Input
              id="fullName"
              value={fullNameInLatin}
              onChange={(e) => setFullNameInLatin(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="passportNumber" className="text-sm font-medium">
              Номер паспорта
            </Label>
            <Input
              id="passportNumber"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              placeholder="N12312312"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="passportDate" className="text-sm font-medium">
              Дата выдачи паспорта
            </Label>
            <div className="relative mt-1">
              <Input
                id="passportDate"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                type="date"
                className="pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          <div>
            <Label htmlFor="passportAuthority" className="text-sm font-medium">
              Кем выдан паспорт
            </Label>
            <Input
              id="passportAuthority"
              value={issuedBy}
              onChange={(e) => setIssuedBy(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {orderResponse ? (
            <div className="space-y-4">
              <p>Номер заказа: {orderResponse.order_id}</p>
              <p>Общая стоимость: {orderResponse.total_cost} тенге</p>
              <Button 
                type="button" 
                className="w-full"
                onClick={() => window.open(orderResponse.pay_link, '_blank')}
              >
                Оплатить
              </Button>
            </div>
          ) : (
            <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
              {isSubmitting ? 'Оформление...' : 'Оформить страховку'}
            </Button>
          )}
      </form>
    </DialogContent>
  );
};

export default TravelInsuranceDialog;
