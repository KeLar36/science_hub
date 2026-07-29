import React, { useState, useEffect } from "react";
import { ShieldAlert, Search, UserCheck, AlertTriangle } from "lucide-react";
import Modal from "@/shared/ui/Modal";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Avatar from "@/shared/ui/Avatar";
import Alert from "@/shared/ui/Alert";
import Skeleton from "@/shared/ui/Skeleton";
import { organizationApi } from "@/features/organization/api/organizationApi";

export default function TransferOwnershipModal({
  isOpen,
  onClose,
  orgId,
  currentOwnerId,
  onSuccess,
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [error, setError] = useState(null);
  const [confirmStep, setConfirmStep] = useState(false);

  useEffect(() => {
    if (isOpen && orgId) {
      fetchMembers();
    } else {
      resetState();
    }
  }, [isOpen, orgId]);

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await organizationApi.getUsers(orgId, 1);
      const membersOnly = (res.items || []).filter(
        (m) => (m._id || m.id) !== currentOwnerId,
      );
      setUsers(membersOnly);
    } catch (err) {
      showError(
        err?.response?.data?.error || "Не вдалося завантажити учасників",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setSelectedUserId(null);
    setSearchTerm("");
    setError(null);
    setConfirmStep(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedUser = users.find((u) => (u._id || u.id) === selectedUserId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId) return;

    if (!confirmStep) {
      setConfirmStep(true);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const res = await organizationApi.transferOwnership(
        orgId,
        selectedUserId,
      );
      onSuccess?.(res.message || "Права власності успішно передано!");
      handleClose();
    } catch (err) {
      showError(err?.response?.data?.error || "Не вдалося передати права");
      setConfirmStep(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Передача прав засновника"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {error && (
          <Alert variant="danger" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {!confirmStep ? (
          <>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-xs text-amber-500">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <p>
                <strong>Увага:</strong> Після передачі прав засновника ви
                втратите статус адміністратора організації та отримаєте роль
                звичайного учасника.
              </p>
            </div>

            <Input
              placeholder="Пошук учасника за ім'ям чи Email..."
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton variant="rectangle" height="48px" />
                  <Skeleton variant="rectangle" height="48px" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <p className="text-center py-6 text-xs text-text-muted font-mono">
                  {users.length === 0
                    ? "У вашій організації поки немає інших учасників"
                    : "Учасника не знайдено"}
                </p>
              ) : (
                filteredUsers.map((user) => {
                  const uId = user._id || user.id;
                  const isSelected = selectedUserId === uId;
                  return (
                    <div
                      key={uId}
                      onClick={() => setSelectedUserId(uId)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? "border-brand bg-brand/10 shadow-xs ring-1 ring-brand/30"
                          : "border-border-color bg-bg-secondary hover:border-brand/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar src={user.image} name={user.name} size="sm" />
                        <div>
                          <h4 className="text-xs font-bold text-text-primary">
                            {user.name}
                          </h4>
                          <p className="text-[10px] font-mono text-text-muted">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <UserCheck size={16} className="text-brand" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 space-y-3">
            <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
              <ShieldAlert size={18} /> Підтвердіть дію
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Ви дійсно бажаєте передати права власності на організацію
              користувачеві{" "}
              <strong className="text-text-primary">
                {selectedUser?.name} ({selectedUser?.email})
              </strong>
              ?
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2.5 pt-3 border-t border-border-color">
          {confirmStep ? (
            <>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setConfirmStep(false)}
                disabled={submitting}
              >
                Назад
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                className="bg-red-600 hover:bg-red-700 border-none text-white"
                isLoading={submitting}
              >
                Підтверджую передачу
              </Button>
            </>
          ) : (
            <>
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
                disabled={!selectedUserId}
              >
                Далі
              </Button>
            </>
          )}
        </div>
      </form>
    </Modal>
  );
}
