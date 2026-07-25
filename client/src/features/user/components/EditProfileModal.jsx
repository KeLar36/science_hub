import React, { useState } from "react";
import { UploadCloud, AlertCircle, Save } from "lucide-react";

import Modal from "@/shared/ui/Modal";
import Input from "@/shared/ui/Input";
import Select from "@/shared/ui/Select";
import Button from "@/shared/ui/Button";

import { UKRAINIAN_CITIES } from "@/shared/lib/constants/cities";

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
  onSave,
  updating,
}) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    city: user?.city || UKRAINIAN_CITIES[0] || "Інше",
    bio: user?.bio || "",
    github: user?.socials?.github || "",
    linkedIn: user?.socials?.linkedIn || "",
    twitter: user?.socials?.twitter || "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.image || "");
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setFormError("Розмір зображення має бути до 5 MB");
        return;
      }
      setFormError(null);
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError("Ім'я є обов'язковим полем");
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append("name", formData.name.trim());
    dataToSend.append("city", formData.city);
    dataToSend.append("bio", formData.bio.trim());

    dataToSend.append(
      "socials",
      JSON.stringify({
        github: formData.github.trim(),
        linkedIn: formData.linkedIn.trim(),
        twitter: formData.twitter.trim(),
      }),
    );

    if (imageFile) {
      dataToSend.append("image", imageFile);
    }

    const res = await onSave(dataToSend);
    if (res?.success) {
      onClose();
    } else if (res?.error) {
      setFormError(res.error);
    }
  };

  const cityOptions = UKRAINIAN_CITIES.map((c) => ({ label: c, value: c }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Редагувати профіль">
      <form onSubmit={handleSubmit} className="space-y-5 text-left">
        {formError && (
          <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 text-xs font-mono flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <div className="flex items-center gap-4 p-3 bg-bg-secondary rounded-xl border border-border-color">
          <img
            src={previewUrl || "https://via.placeholder.com/150"}
            alt="Аватар"
            className="w-16 h-16 rounded-full object-cover border border-border-color shrink-0"
          />
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase font-bold text-text-muted block">
              Фото профілю (до 5MB)
            </label>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg-tertiary border border-border-color hover:border-brand/50 rounded-lg text-xs font-mono text-text-primary cursor-pointer transition-colors">
              <UploadCloud size={14} /> Обрати фото
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase text-text-muted font-bold">
              ПІБ / Ім'я *
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ваше ім'я"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase text-text-muted font-bold">
              Місто
            </label>
            <Select
              name="city"
              value={formData.city}
              onChange={handleChange}
              options={cityOptions}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase text-text-muted font-bold">
            Коротко про себе / Науковий ступінь
          </label>
          <textarea
            rows={3}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full bg-bg-secondary border border-border-color rounded-xl p-3 text-xs text-text-primary focus:outline-none focus:border-brand font-sans"
            placeholder="Опишіть ваші наукові інтереси чи посаду..."
          />
        </div>

        <div className="space-y-3 pt-2 border-t border-border-color">
          <span className="text-[10px] font-mono uppercase text-text-muted font-bold block">
            // Наукові та соціальні профілі
          </span>
          <div className="grid grid-cols-1 gap-2">
            <Input
              name="github"
              placeholder="GitHub URL"
              value={formData.github}
              onChange={handleChange}
            />
            <Input
              name="linkedIn"
              placeholder="LinkedIn URL"
              value={formData.linkedIn}
              onChange={handleChange}
            />
            <Input
              name="twitter"
              placeholder="Twitter / X URL"
              value={formData.twitter}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border-color">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Скасувати
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            icon={Save}
            disabled={updating}
          >
            {updating ? "Збереження..." : "Зберегти зміни"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
