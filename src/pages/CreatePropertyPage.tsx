import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function CreatePropertyPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    precio: 0,
    direccion: "",
    cantidadBaños: 1,
    cantidadHabitaciones: 1,
    metraje: 0,
    idCiudad: 1,
    idTipoPropiedad: 1,
    numeroUnidad: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: [
        "precio",
        "cantidadBaños",
        "cantidadHabitaciones",
        "metraje",
        "idCiudad",
        "idTipoPropiedad",
      ].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (formData.idTipoPropiedad === 1) {
      formData.numeroUnidad = "";
    }
    const payload = {
      propiedad: {
        direccion: formData.direccion,
        cantidadBaños: formData.cantidadBaños,
        cantidadHabitaciones: formData.cantidadHabitaciones,
        metraje: formData.metraje,
        idVendedor: user?.idUsuario,
        idCiudad: formData.idCiudad,
        idTipoPropiedad: formData.idTipoPropiedad,
        idEstadoPropiedad: 1, // Por defecto disponible
        numeroUnidad: formData.numeroUnidad,
      },
      publicacion: {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        precio: formData.precio,
        ubicacion: formData.direccion,
        vendedorId: user?.idUsuario,
      },
    };

    const dataToSend = new FormData();
    dataToSend.append("data", JSON.stringify(payload));

    selectedFiles.forEach((file) => {
      dataToSend.append("fotos", file);
    });

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/publicacion/crear-con-fotos",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: dataToSend,
        },
      );

      const data = await response.json();

      if (response.ok) {
        const failedPhotos = data.fotos?.filter(
          (f: any) => f.status === "error",
        );
        let successMessage =
          data.message || "Propiedad y publicación creadas exitosamente";

        if (failedPhotos && failedPhotos.length > 0) {
          successMessage += `. Sin embargo, ${failedPhotos.length} foto(s) no pudieron subirse.`;
        }

        setMessage({
          type: failedPhotos && failedPhotos.length > 0 ? "warning" : "success",
          text: successMessage,
        });

        // Mantenemos el overlay activo durante la redirección
        const targetUrl = data.redirectUrl || "/propiedades";
        setTimeout(() => {
          navigate(targetUrl);
          setLoading(false);
        }, failedPhotos && failedPhotos.length > 0 ? 4000 : 2000);
      } else {
        setMessage({
          type: "error",
          text:
            data.message ||
            "Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo.",
        });
        setLoading(false);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo.",
      });
      setLoading(false);
    }
  };

  if (user?.idRol !== 1) {
    return (
      <main className="container">
        <div className="message-banner error" style={{ marginTop: "2rem" }}>
          No tienes permisos para acceder a esta página. Solo administradores
          pueden crear propiedades.
        </div>
      </main>
    );
  }

  return (
    <main
      className="container"
      style={{ padding: "2rem 1rem", position: "relative" }}
    >
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(6px)",
          }}
        >
          <div
            className="loading-spinner"
            style={{
              width: "60px",
              height: "60px",
              border: "6px solid #f3f3f3",
              borderTop: "6px solid #2563eb",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: "1.5rem",
            }}
          ></div>
          <p
            style={{ fontWeight: "700", color: "#1e293b", fontSize: "1.3rem" }}
          >
            {message.type === "success"
              ? "¡Éxito! Redirigiendo..."
              : "Procesando tu publicación..."}
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
      <section
        className="auth-card"
        style={{
          maxWidth: "900px",
          width: "100%",
          margin: "0 auto",
          padding: "32px",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "8px" }}>
          Crear Nueva Propiedad
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            marginBottom: "32px",
          }}
        >
          Ingresa los datos para crear la propiedad y su respectiva publicación
        </p>

        {message.text && (
          <div className={`message-banner ${message.type}`}>{message.text}</div>
        )}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
          style={{ gap: "24px" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            <div style={{ gridColumn: "1 / -1" }}>
              <h3
                style={{
                  borderBottom: "2px solid #f1f5f9",
                  paddingBottom: "12px",
                  marginBottom: "8px",
                  color: "#1e293b",
                }}
              >
                Información de Publicación
              </h3>
            </div>

            <label style={{ gridColumn: "1 / -1" }}>
              Título de la Publicación
              <input
                type="text"
                name="titulo"
                required
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ej. Hermosa Casa en Reñaca con vista al mar"
              />
            </label>

            <label style={{ gridColumn: "1 / -1" }}>
              Descripción
              <textarea
                name="descripcion"
                required
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describe los detalles atractivos de la propiedad..."
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  fontFamily: "inherit",
                  fontSize: "0.95rem",
                }}
              />
            </label>

            <div style={{ gridColumn: "1 / -1", marginTop: "16px" }}>
              <h3
                style={{
                  borderBottom: "2px solid #f1f5f9",
                  paddingBottom: "12px",
                  marginBottom: "8px",
                  color: "#1e293b",
                }}
              >
                Fotos de la Propiedad
              </h3>
              <div
                style={{
                  border: "2px dashed #cbd5e1",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  backgroundColor: "#f8fafc",
                  transition: "all 0.2s ease",
                  minHeight: "200px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files) {
                    const filesArray = Array.from(e.dataTransfer.files);
                    setSelectedFiles((prev) => [...prev, ...filesArray]);
                  }
                }}
              >
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />

                {selectedFiles.length === 0 ? (
                  <div
                    onClick={() => document.getElementById("fileInput")?.click()}
                    style={{ cursor: "pointer", width: "100%" }}
                  >
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#64748b"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginBottom: "12px" }}
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <p style={{ fontWeight: "600", color: "#475569" }}>
                      Haz clic o arrastra fotos aquí
                    </p>
                    <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                      Soporta JPG, PNG, WEBP
                    </p>
                  </div>
                ) : (
                  <div style={{ width: "100%" }}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(120px, 1fr))",
                        gap: "12px",
                        marginBottom: "16px",
                      }}
                    >
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          style={{
                            position: "relative",
                            aspectRatio: "1/1",
                            borderRadius: "8px",
                            overflow: "hidden",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              backgroundColor: "#1e293b",
                            }}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(index);
                            }}
                            style={{
                              position: "absolute",
                              top: "4px",
                              right: "4px",
                              width: "22px",
                              height: "22px",
                              borderRadius: "50%",
                              backgroundColor: "rgba(0,0,0,0.6)",
                              color: "white",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              fontWeight: "bold",
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <div
                        onClick={() =>
                          document.getElementById("fileInput")?.click()
                        }
                        style={{
                          aspectRatio: "1/1",
                          borderRadius: "8px",
                          border: "2px dashed #cbd5e1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          backgroundColor: "#fff",
                          color: "#64748b",
                          fontSize: "1.5rem",
                        }}
                      >
                        +
                      </div>
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                      {selectedFiles.length} foto(s) seleccionadas
                    </p>
                  </div>
                )}
              </div>
            </div>

            <label>
              Precio ($)
              <input
                type="number"
                name="precio"
                min="0"
                step="0.01"
                required
                value={formData.precio}
                onChange={handleChange}
              />
            </label>

            <div style={{ gridColumn: "1 / -1", marginTop: "16px" }}>
              <h3
                style={{
                  borderBottom: "2px solid #f1f5f9",
                  paddingBottom: "12px",
                  marginBottom: "8px",
                  color: "#1e293b",
                }}
              >
                Detalles de la Propiedad
              </h3>
            </div>

            <label style={{ gridColumn: "1 / -1" }}>
              Dirección Exacta
              <input
                type="text"
                name="direccion"
                required
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Ej. Viña del mar reñaca asalto 6 7"
              />
            </label>

            <label>
              Ciudad
              <select
                name="idCiudad"
                value={formData.idCiudad}
                onChange={handleChange}
              >
                <option value={1}>Viña del Mar</option>
                <option value={2}>Valparaíso</option>
                <option value={3}>Santiago</option>
                <option value={4}>Concepción</option>
                <option value={5}>Antofagasta</option>
                <option value={6}>La Serena</option>
              </select>
            </label>

            <label>
              Tipo de Propiedad
              <select
                name="idTipoPropiedad"
                value={formData.idTipoPropiedad}
                onChange={handleChange}
              >
                <option value={1}>Propiedad</option>
                <option value={2}>Departamento</option>
                <option value={3}>Hotel</option>
              </select>
            </label>
            {(formData.idTipoPropiedad === 3 ||
              formData.idTipoPropiedad === 2) && (
              <label style={{ gridColumn: "1 / -1" }}>
                Numero de departamento
                <input
                  type="text"
                  name="numeroUnidad"
                  required
                  value={formData.numeroUnidad}
                  onChange={handleChange}
                  placeholder="Ej. depto 614"
                />
              </label>
            )}

            <label>
              Metraje (m²)
              <input
                type="number"
                name="metraje"
                min="0"
                required
                value={formData.metraje}
                onChange={handleChange}
              />
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <label
                style={{
                  width: "165%",
                  padding: "12px",
                  borderRadius: "10px",
                  fontFamily: "inherit",
                  fontSize: "0.95rem",
                }}
              >
                Baños
                <input
                  type="number"
                  name="cantidadBaños"
                  min="0"
                  required
                  value={formData.cantidadBaños}
                  onChange={handleChange}
                />
              </label>
            </div>

            <label>
              Habitaciones
              <input
                type="number"
                name="cantidadHabitaciones"
                min="0"
                required
                value={formData.cantidadHabitaciones}
                onChange={handleChange}
              />
            </label>
          </div>

          <button
            type="submit"
            className="button button-primary btn-full"
            disabled={loading}
            style={{ marginTop: "16px", height: "52px", fontSize: "1.05rem" }}
          >
            {loading ? "Procesando..." : "Crear Propiedad y Publicación"}
          </button>
        </form>
      </section>
    </main>
  );
}
