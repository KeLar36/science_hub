import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Edit3,
  MapPin,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Building2,
  PlusCircle,
  ExternalLink,
  ShieldAlert,
  FileText,
  CheckSquare,
} from "lucide-react";
import Card from "@/shared/ui/Card";
import Button from "@/shared/ui/Button";
import Avatar from "@/shared/ui/Avatar";
import Badge from "@/shared/ui/Badge";
import Alert from "@/shared/ui/Alert";
import EditProfileModal from "@/features/user/components/EditProfileModal";
import JoinOrganizationModal from "@/features/organization/components/JoinOrganizationModal";
import CreateOrganizationModal from "@/features/organization/components/CreateOrganizationModal";

export default function ProfileHeader({
  user,
  onUpdateProfile,
  updating,
  onRefreshProfile,
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [actionAlert, setActionAlert] = useState(null);

  const triggerAlert = (message, variant = "success") => {
    setActionAlert({ message, variant });
    setTimeout(() => {
      setActionAlert(null);
    }, 6000);
  };

  const hasOrganization = Boolean(user?.organizationId);
  const hasPendingOrg = Boolean(user?.pendingOrganizationId);
  const hasPendingJoinRequest = Boolean(
    user?.pendingJoinRequestOrgId || user?.hasPendingJoinRequest,
  );

  const isOrgActionDisabled =
    hasOrganization || hasPendingOrg || hasPendingJoinRequest;

  const isSuperAdmin = user?.role === "superadmin";
  const isContentManager =
    user?.role === "content-manager" || user?.role === "admin";
  const isReviewer = user?.role === "reviewer";

  const superAdminDashboards = [
    { label: "Адмінка", path: "/admin/dashboard", icon: ShieldAlert },
    { label: "Установа", path: "/organization/dashboard", icon: ExternalLink },
    { label: "Контент", path: "/manager-dashboard", icon: FileText },
    { label: "Рецензент", path: "/reviewer-dashboard", icon: CheckSquare },
  ];

  const getDashboardConfig = (user) => {
    if (user?.organizationId) {
      return {
        label: "Кабінет установи",
        path: "/organization/dashboard",
        icon: ExternalLink,
        variant: "primary",
      };
    }
    return null;
  };

  const dashboardConfig = getDashboardConfig(user);

  const handleUpdateProfile = async (formData) => {
    const res = await onUpdateProfile(formData);
    if (res?.success) {
      triggerAlert("Профіль успішно оновлено!");
      setIsEditModalOpen(false);
    }
    return res;
  };

  const handleCreateSuccess = () => {
    onRefreshProfile?.();
    triggerAlert(
      "Заявку на створення організації успішно надіслано! Вона перебуває на модерації.",
      "warning",
    );
  };

  const handleJoinSuccess = (msg) => {
    onRefreshProfile?.();
    triggerAlert(
      msg || "Запит на вступ до установи успішно надіслано!",
      "info",
    );
  };

  return (
    <>
      <Card className="bg-bg-secondary/60 border-border-color backdrop-blur-xs space-y-4 text-left">
        {actionAlert && (
          <Alert
            variant={actionAlert.variant}
            onClose={() => setActionAlert(null)}
          >
            {actionAlert.message}
          </Alert>
        )}

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 my-3">
          <div className="flex items-center gap-4">
            <Avatar
              src={user?.image}
              name={user?.name}
              size="lg"
              className="w-16 h-16 text-base shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black font-sans uppercase tracking-tight text-text-primary">
                  {user?.name || "Користувач"}
                </h2>
                <Badge status="default">{user?.role || "user"}</Badge>

                {hasOrganization && (
                  <Badge status="success" className="flex items-center gap-1">
                    <Building2 size={11} /> Організація
                  </Badge>
                )}
              </div>

              <p className="text-xs font-mono text-text-muted flex items-center gap-1.5">
                <Mail size={12} /> {user?.email}
              </p>

              {user?.city && (
                <p className="text-xs font-mono text-text-muted flex items-center gap-1.5">
                  <MapPin size={12} /> {user.city}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto shrink-0 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              icon={Edit3}
              onClick={() => setIsEditModalOpen(true)}
              className="justify-center sm:w-auto"
            >
              Редагувати
            </Button>

            {isSuperAdmin ? (
              <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
                {superAdminDashboards.map((dash) => (
                  <Link
                    key={dash.path}
                    to={dash.path}
                    className="flex-1 sm:flex-initial"
                  >
                    <Button
                      variant="primary"
                      size="sm"
                      icon={dash.icon}
                      className="w-full justify-center text-xs px-2.5"
                    >
                      {dash.label}
                    </Button>
                  </Link>
                ))}
              </div>
            ) : (
              <>
                {isReviewer && (
                  <Link to="/reviewer-dashboard" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={CheckSquare}
                      className="w-full justify-center text-xs"
                    >
                      Зона рецензента
                    </Button>
                  </Link>
                )}

                {isContentManager && (
                  <Link to="/manager-dashboard" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={FileText}
                      className="w-full justify-center text-xs"
                    >
                      Зона контент-менеджера
                    </Button>
                  </Link>
                )}

                {dashboardConfig && (
                  <Link to={dashboardConfig.path} className="w-full sm:w-auto">
                    <Button
                      variant={dashboardConfig.variant}
                      size="sm"
                      icon={dashboardConfig.icon}
                      className="w-full justify-center text-xs"
                    >
                      {dashboardConfig.label}
                    </Button>
                  </Link>
                )}

                {!hasOrganization &&
                  !hasPendingOrg &&
                  !hasPendingJoinRequest && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Building2}
                        onClick={() =>
                          !isOrgActionDisabled && setIsJoinModalOpen(true)
                        }
                        disabled={isOrgActionDisabled}
                        className="justify-center"
                        title={
                          isOrgActionDisabled
                            ? "У вас вже є активний запит або ви в організації"
                            : ""
                        }
                      >
                        Приєднатися до установи
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        icon={PlusCircle}
                        onClick={() =>
                          !isOrgActionDisabled && setIsCreateModalOpen(true)
                        }
                        disabled={isOrgActionDisabled}
                        className="justify-center"
                        title={
                          isOrgActionDisabled
                            ? "У вас вже є активний запит або ви в організації"
                            : ""
                        }
                      >
                        Зареєструвати установу
                      </Button>
                    </>
                  )}
              </>
            )}
          </div>
        </div>

        {!hasOrganization && hasPendingOrg && (
          <Alert
            variant="warning"
            title="Заявку на реєстрацію установи надіслано"
          >
            Ваша заявка на створення організації зараз перебуває на модерації
            адміністратором платформи. Після підтвердження ви отримаєте доступ
            до кабінету установи.
          </Alert>
        )}

        {!hasOrganization && !hasPendingOrg && hasPendingJoinRequest && (
          <Alert
            variant="info"
            title="Запит на вступ до установи очікує підтвердження"
          >
            Ваш запит на приєднання до установи надіслано і зараз перебуває на
            розгляді адміністратором організації. Очікуйте на підтвердження.
          </Alert>
        )}
        {user?.bio && (
          <p className="pt-3 border-t border-border-color text-xs text-text-secondary leading-relaxed font-sans break-words">
            {user.bio}
          </p>
        )}

        {user?.socials && (
          <div className="pt-2 flex items-center gap-3">
            {user.socials.github && (
              <a
                href={user.socials.github}
                target="_blank"
                rel="noreferrer"
                className="text-text-muted hover:text-brand transition-colors"
              >
                <Github size={15} />
              </a>
            )}
            {user.socials.linkedIn && (
              <a
                href={user.socials.linkedIn}
                target="_blank"
                rel="noreferrer"
                className="text-text-muted hover:text-brand transition-colors"
              >
                <Linkedin size={15} />
              </a>
            )}
            {user.socials.twitter && (
              <a
                href={user.socials.twitter}
                target="_blank"
                rel="noreferrer"
                className="text-text-muted hover:text-brand transition-colors"
              >
                <Twitter size={15} />
              </a>
            )}
          </div>
        )}
      </Card>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleUpdateProfile}
        updating={updating}
      />

      <JoinOrganizationModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={handleJoinSuccess}
      />

      <CreateOrganizationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
}
