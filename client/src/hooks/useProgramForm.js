import { useState } from "react";
import axiosInstance from "../api/axios";
import toast from "react-hot-toast";

export const useProgramForm = (
  newProgram,
  setNewProgram,
  setPrograms,
  onCreateProgram,
  initialState,
) => {
  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setNewProgram({
      ...newProgram,
      type: selectedType,
      amount: selectedType === "Грант" ? newProgram.amount : "",
      issn: selectedType === "Науковий журнал" ? newProgram.issn : "",
      impactFactor:
        selectedType === "Науковий журнал" ? newProgram.impactFactor : 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onCreateProgram(e);
      setNewProgram(initialState);
    } catch (err) {
      console.error("Помилка при створенні можливості:", err);
    }
  };

  const handleSaveModal = async (updatedFormData, onUpdateSuccess) => {
    try {
      const res = await axiosInstance.put(
        `/programs/${updatedFormData._id}`,
        updatedFormData,
      );
      toast.success("Програму успішно оновлено!");

      if (setPrograms) {
        setPrograms((prev) =>
          prev.map((p) =>
            p._id === updatedFormData._id ? res.data.program : p,
          ),
        );
      }

      if (onUpdateSuccess) onUpdateSuccess(res.data.program);
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Помилка при оновленні програми",
      );
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Ви впевнені, що хочете видалити цю програму НАЗАВЖДИ? Цю дію не можна буде скасувати.",
      )
    )
      return;
    try {
      await axiosInstance.delete(`/programs/${id}/permanent`);
      toast.success("Програму видалено назавжди");
      if (setPrograms) {
        setPrograms((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      toast.error("Не вдалося видалити програму");
    }
  };

  return {
    handleTypeChange,
    handleSubmit,
    handleSaveModal,
    handleDelete,
  };
};
