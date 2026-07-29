import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/shared/ui/Card";
import Input from "@/shared/ui/Input";
import TextArea from "@/shared/ui/TextArea";
import Button from "@/shared/ui/Button";
import Toggle from "@/shared/ui/Toggle";
import Alert from "@/shared/ui/Alert";
import Select from "@/shared/ui/Select";
import FileUploader from "@/shared/ui/FileUploader";
import Avatar from "@/shared/ui/Avatar";
import TransferOwnershipModal from "@/features/organization/components/TransferOwnershipModal";
import {
  Save,
  Building2,
  Globe,
  Mail,
  MapPin,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import {
  LEGAL_FORM_OPTIONS,
  TYPE_OPTIONS,
} from "@/shared/lib/constants/legalForms";
import { SCIENTIFIC_DOMAINS } from "@/shared/lib/constants/domains";

export default function OrganizationSettings({
  orgData,
  onUpdate,
  onTransferOwnership,
  currentUserId,
}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    email: "",
    website: "",
    description: "",
    type: "Університет",
    legalForm: "ДУ/КЗ",
    scientificDomains: [],
    allowPublicJoin: true,
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  useEffect(() => {
    if (orgData) {
      setFormData({
        name: orgData.name || "",
        city: orgData.city || "",
        email: orgData.email || "",
        website: orgData.website || "",
        description: orgData.description || "",
        type: orgData.type || "Університет",
        legalForm: orgData.legalForm || "ДУ/КЗ",
        scientificDomains: Array.isArray(orgData.scientificDomains)
          ? orgData.scientificDomains
          : [],
        allowPublicJoin: orgData.allowPublicJoin ?? true,
      });
      if (orgData.logo) {
        setLogoPreview(orgData.logo);
      }
    }
  }, [orgData]);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (logoPreview && !logoPreview.startsWith("http")) {
        URL.revokeObjectURL(logoPreview);
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSelectAllDomains = () => {
    setFormData((prev) => ({
      ...prev,
      scientificDomains: [...SCIENTIFIC_DOMAINS],
    }));
  };

  const handleClearAllDomains = () => {
    setFormData((prev) => ({
      ...prev,
      scientificDomains: [],
    }));
  };

  const handleDomainToggle = (domain) => {
    setFormData((prev) => {
      const currentDomains = Array.isArray(prev.scientificDomains)
        ? prev.scientificDomains
        : [];

      const target = domain.trim();
      const exists = currentDomains.some(
        (d) => typeof d === "string" && d.trim() === target,
      );

      const updated = exists
        ? currentDomains.filter(
            (d) => typeof d === "string" && d.trim() !== target,
          )
        : [...currentDomains, target];

      return { ...prev, scientificDomains: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const submitData = new FormData();
      submitData.append("name", formData.name.trim());
      submitData.append("city", formData.city.trim());
      submitData.append("email", formData.email.trim());
      submitData.append(
        "website",
        formData.website ? formData.website.trim() : "",
      );
      submitData.append(
        "description",
        formData.description ? formData.description.trim() : "",
      );
      submitData.append("type", formData.type);
      submitData.append("legalForm", formData.legalForm);
      submitData.append("allowPublicJoin", formData.allowPublicJoin);

      const domains = Array.isArray(formData.scientificDomains)
        ? Array.from(
            new Set(
              formData.scientificDomains.map((d) => d.trim()).filter(Boolean),
            ),
          )
        : [];

      submitData.append("scientificDomains", JSON.stringify(domains));

      if (logoFile) {
        submitData.append("logo", logoFile);
      }

      await onUpdate?.(submitData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      const msg = err?.response?.data?.error || "Не вдалося зберегти зміни";
      setError(msg);
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 text-left max-w-4xl mx-auto"
      >
        {success && (
          <Alert variant="success" onClose={() => setSuccess(false)}>
            Налаштування організації успішно збережено!
          </Alert>
        )}

        {error && (
          <Alert variant="danger" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-mono font-bold uppercase text-text-primary flex items-center gap-2">
            <Building2 size={16} className="text-brand" /> Профіль установи
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg bg-bg-secondary border border-border-color">
            <Avatar
              src={logoPreview}
              name={formData.name}
              size="lg"
              className="w-16 h-16"
            />
            <div className="flex-1 w-full">
              <FileUploader
                label="Завантажити логотип організації"
                description="PNG, JPG або WEBP до 2MB"
                accept="image/*"
                onChange={handleLogoChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Назва організації"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <Input
              label="Код ЄДРПОУ / Ідентифікатор"
              value={orgData?.edrpou || ""}
              disabled
            />

            <Select
              label="Тип організації"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              options={TYPE_OPTIONS.map((opt) => ({ label: opt, value: opt }))}
            />

            <Select
              label="Організаційно-правова форма"
              value={formData.legalForm}
              onChange={(e) =>
                setFormData({ ...formData, legalForm: e.target.value })
              }
              options={LEGAL_FORM_OPTIONS.map((opt) => ({
                label: opt,
                value: opt,
              }))}
            />

            <Input
              label="Місто / Регіон"
              icon={MapPin}
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />

            <Input
              label="Офіційний Email"
              icon={Mail}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <Input
              label="Вебсайт"
              icon={Globe}
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
            />
          </div>

          <TextArea
            label="Опис діяльності"
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </Card>

        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase text-text-primary">
                Наукові напрямки та галузі
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Оберіть ключові галузі, у яких працює ваша установа.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSelectAllDomains}
                className="text-[11px] h-7 px-2"
              >
                Обрати всі
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearAllDomains}
                className="text-[11px] h-7 px-2"
              >
                Зняти всі
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {SCIENTIFIC_DOMAINS.map((domain) => {
              const isSelected = formData.scientificDomains.some(
                (d) => typeof d === "string" && d.trim() === domain.trim(),
              );
              return (
                <button
                  type="button"
                  key={domain}
                  onClick={() => handleDomainToggle(domain)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-brand/15 text-brand border-brand/40 font-bold"
                      : "bg-bg-secondary text-text-muted border-border-color hover:bg-bg-tertiary"
                  }`}
                >
                  {isSelected && <CheckCircle2 size={12} />}
                  {domain}
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-5 space-y-3">
          <h3 className="text-sm font-mono font-bold uppercase text-text-primary">
            Правила приєднання
          </h3>
          <Toggle
            label="Відображати у списку для приєднання"
            description="Дозволяє користувачам шукати вашу установу та надсилати заявки на вступ."
            checked={formData.allowPublicJoin}
            onChange={(val) =>
              setFormData({ ...formData, allowPublicJoin: val })
            }
          />
        </Card>

        <div className="flex justify-end">
          <Button
            variant="primary"
            type="submit"
            icon={Save}
            isLoading={saving}
          >
            Зберегти зміни
          </Button>
        </div>

        {orgData?.isVerified && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-amber-500 text-xs">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Зверніть увагу:</span>
              Ваша установа має статус верифікованої. Зміна офіційної назви або
              логотипу призведе до тимчасового зняття верифікації до перевірки
              адміністратором.
            </div>
          </div>
        )}

        <Card className="p-5 border-red-500/30 bg-red-500/5 space-y-3">
          <h3 className="text-sm font-mono font-bold uppercase text-red-500 flex items-center gap-2">
            <AlertTriangle size={16} /> Небезпечна зона
          </h3>
          <p className="text-xs text-text-muted">
            Передача прав засновника або видалення профілю організації з
            платформи.
          </p>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => setIsTransferModalOpen(true)}
            className="border-red-500/40 text-red-500 hover:bg-red-500/10"
          >
            Передати права засновника
          </Button>
        </Card>
      </form>

      <TransferOwnershipModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        orgId={orgData?._id}
        currentOwnerId={
          orgData?.creatorId?._id || orgData?.creatorId || currentUserId
        }
        onTransfer={onTransferOwnership}
        onSuccess={(msg) => {
          navigate("/profile", {
            state: {
              successMessage: msg || "Права засновника успішно передано!",
            },
          });
        }}
      />
    </>
  );
}
