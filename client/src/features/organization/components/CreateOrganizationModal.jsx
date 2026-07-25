import React, { useState } from "react";
import { UploadCloud, PlusCircle } from "lucide-react";
import Modal from "@/shared/ui/Modal";
import Input from "@/shared/ui/Input";
import Select from "@/shared/ui/Select";
import TextArea from "@/shared/ui/TextArea";
import Combobox from "@/shared/ui/Combobox";
import Alert from "@/shared/ui/Alert";
import Button from "@/shared/ui/Button";
import { UKRAINIAN_CITIES } from "@/shared/lib/constants/cities";
import { useOrganization } from "../hooks/useOrganization";

const orgTypes = [
  { label: "Університет", value: "Університет" },
  { label: "НДІ", value: "НДІ" },
  { label: "Наукове видавництво", value: "Наукове видавництво" },
  { label: "Державна структура", value: "Державна структура" },
  { label: "Приватна компанія", value: "Приватна компанія" },
  { label: "Інше", value: "Інше" },
];

const legalForms = [
  { label: "ДУ/КЗ (Державна установа)", value: "ДУ/КЗ" },
  { label: "ТОВ", value: "ТОВ" },
  { label: "ГО", value: "ГО" },
  { label: "ДП", value: "ДП" },
  { label: "ФОП", value: "ФОП" },
  { label: "Інше", value: "Інше" },
];

export default function CreateOrganizationModal({
  isOpen,
  onClose,
  onSuccess,
}) {
  const { createOrganization, submitting, error } = useOrganization();

  const [formData, setFormData] = useState({
    name: "",
    edrpou: "",
    type: "Університет",
    legalForm: "ДУ/КЗ",
    city: UKRAINIAN_CITIES[0] || "Київ",
    website: "",
    email: "",
    description: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [formError, setFormError] = useState(null);

  const handleClose = () => {
    setFormError(null);
    setLogoFile(null);
    setPreviewUrl("");
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (cityValue) => {
    setFormData((prev) => ({ ...prev, city: cityValue }));
  };

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setFormError("Розмір логотипу має бути до 5 MB");
        return;
      }
      setFormError(null);
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim() || !formData.edrpou.trim()) {
      setFormError("Назва та код ЄДРПОУ є обов'язковими");
      return;
    }

    const dataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      dataToSend.append(key, formData[key]);
    });

    if (logoFile) {
      dataToSend.append("logo", logoFile);
    }

    const res = await createOrganization(dataToSend);
    if (res.success) {
      onSuccess?.();
      handleClose();
    } else {
      setFormError(res.error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Подати заявку на створення організації"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {(formError || error) && (
          <Alert variant="danger">{formError || error}</Alert>
        )}

        <div className="flex items-center gap-4 p-3 bg-bg-secondary rounded-xl border border-border-color">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Логотип"
              className="w-14 h-14 rounded-lg object-cover border border-border-color shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-bg-tertiary border border-border-color flex items-center justify-center text-text-muted shrink-0 text-xs font-mono">
              LOGO
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase font-bold text-text-muted block">
              Логотип установи (до 5MB)
            </label>
            <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-bg-tertiary border border-border-color hover:border-brand/50 rounded-lg text-xs font-mono text-text-primary cursor-pointer transition-colors">
              <UploadCloud size={14} /> Обрати файл
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-mono uppercase text-text-muted font-bold block mb-1">
              Назва організації *
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Наприклад: КНУ ім. Шевченка"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-text-muted font-bold block mb-1">
              Код ЄДРПОУ / Ідентифікатор *
            </label>
            <Input
              name="edrpou"
              value={formData.edrpou}
              onChange={handleChange}
              placeholder="8-значний код"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Select
              label="Тип"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={orgTypes}
            />
          </div>

          <div>
            <Select
              label="Форма"
              name="legalForm"
              value={formData.legalForm}
              onChange={handleChange}
              options={legalForms}
            />
          </div>

          <div>
            <Combobox
              label="Місто"
              options={UKRAINIAN_CITIES}
              value={formData.city}
              onChange={handleCityChange}
              placeholder="Оберіть місто..."
              searchPlaceholder="Пошук міста..."
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Вебсайт (URL)"
          />
          <Input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Офіційний Email"
          />
        </div>

        <TextArea
          label="Опис установи"
          name="description"
          rows={2}
          value={formData.description}
          onChange={handleChange}
          placeholder="Коротко про діяльність установи..."
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-border-color">
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={handleClose}
          >
            Скасувати
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            icon={PlusCircle}
            disabled={submitting}
            isLoading={submitting}
          >
            Подати на модерацію
          </Button>
        </div>
      </form>
    </Modal>
  );
}
