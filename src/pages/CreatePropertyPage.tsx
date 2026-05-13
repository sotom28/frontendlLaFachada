import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function CreatePropertyPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

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
    tipoVentas: "venta",
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
        precio: formData.precio,
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
        tipoVentas: formData.tipoVentas,
      },
    };

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/publicacion/crear-completa",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: data.message || "Propiedad y publicación creadas exitosamente",
        });
        // Mantenemos el overlay activo durante la redirección
        const targetUrl = data.redirectUrl || "/propiedades";
        setTimeout(() => {
          navigate(targetUrl);
          setLoading(false);
        }, 2000);
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

            <label>
              Tipo de Operación
              <select
                name="tipoVentas"
                value={formData.tipoVentas}
                onChange={handleChange}
              >
                <option value="venta">Venta</option>
              </select>
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
            {(formData.idTipoPropiedad === 3 || formData.idTipoPropiedad === 2) && (
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
              }}>
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
