import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { projectApi } from "@/features/projects/api/projectApi";
import { SCIENTIFIC_DOMAINS } from "@/shared/lib/constants/domains";
import { usePrograms } from "@/features/programs/hooks/usePrograms";

export function useSubmitProject(initialProgramId = "") {
  const navigate = useNavigate();
  const { programs } = usePrograms();
  const [selectedProgram, setSelectedProgram] = useState(initialProgramId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState(SCIENTIFIC_DOMAINS[0] || "Інше");
  const [authorComment, setAuthorComment] = useState("");
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const currentProgramObj = programs.find((p) => p._id === selectedProgram);

  useEffect(() => {
    if (!selectedProgram && programs.length > 0) {
      setSelectedProgram(programs[0]._id);
    }
  }, [programs, selectedProgram]);

  useEffect(() => {
    setMetadata({});
  }, [selectedProgram]);

  const handleMetadataChange = (key, value) => {
    setMetadata((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 25 * 1024 * 1024) {
        setError("Розмір файлу перевищує 25 MB");
        return;
      }
      setError(null);
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim() || !selectedProgram) {
      setError(
        "Будь-ласка, заповніть всі необхідні поля! (Назва, опис та програма.)",
      );
      return;
    }

    if (!file) {
      setError("Будь-ласка, додайте матеріали для подачі (файл PDF/DOCX/XLSX)");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("domain", domain);
      formData.append("programId", selectedProgram);
      formData.append("authorComment", authorComment.trim());
      formData.append("metadata", JSON.stringify(metadata));
      formData.append("file", file);

      await projectApi.create(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      console.error("Помилка подачі проекту:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Не вдалося подати проект",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    programs,
    selectedProgram,
    setSelectedProgram,
    currentProgramObj,
    title,
    setTitle,
    description,
    setDescription,
    domain,
    setDomain,
    authorComment,
    setAuthorComment,
    metadata,
    handleMetadataChange,
    file,
    handleFileChange,
    handleSubmit,
    loading,
    error,
    success,
  };
}
