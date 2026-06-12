import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Resena {
    id: number;
    comentario: string;
    calificacion: number;
    nombreCliente: string;
}

interface DetallePublicacion {
    idPublicacion: number;
    titulo: string;
    descripcion: string;
    precio: number;
    fechaPublicacion: string;
    nombreVendedor: string;
    vendedorId: number;
    vendedor_id?: number;
    idVendedor?: number;
    estado?: string;
    propiedad: {
        id: number;
        direccion: string;
        ciudad: string;
        habitaciones: number;
        banos: number;
        metraje: number;
        tipo: string;
        estadoPropiedad: number;
        fotos?: { url: string; nombre: string }[];
    };
    resenas: Resena[];
    fotos?: { url: string; nombre: string }[];
}

const tones = ["tone-a", "tone-b", "tone-c", "tone-d", "tone-e", "tone-f"];

const normalizeUrl = (url: string) => {
    if (!url) return "";
    return url.replace("http://floci:", "http://localhost:");
};

export function PropertyDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<DetallePublicacion | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const { token, user, isAuthenticated } = useAuth();
    const [newReview, setNewReview] = useState({
        comentario: "",
        calificacion: 5,
    });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewMessage, setReviewMessage] = useState({ type: "", text: "" });
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchDetalle = async () => {
        try {
            const headers: HeadersInit = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            // Realizamos ambas peticiones en paralelo para eficiencia
            const [viewRes, baseRes] = await Promise.all([
                fetch(`http://localhost:3000/api/v1/views/publicacion-detalle/${id}`, {
                    headers,
                }),
                fetch(`http://localhost:3000/api/v1/publicacion/${id}`, { headers }),
            ]);

            if (viewRes.status === 404) {
                setErrorMsg("Publicación no encontrada");
                return;
            }

            if (!viewRes.ok) throw new Error("Error al obtener el detalle");

            const viewData = await viewRes.json();
            console.log("DEBUG: Detalle publicacion viewData:", viewData);
            const normalizedViewData =
                (Array.isArray(viewData) ? viewData[0] : viewData) || {};
            let baseData: any = {};

            try {
                if (baseRes.ok) {
                    const rawBaseData = await baseRes.json();
                    console.log("DEBUG: Detalle publicacion baseData:", rawBaseData);
                    baseData = (Array.isArray(rawBaseData) ? rawBaseData[0] : rawBaseData) || {};
                }
            } catch (e) {
                console.error("Error parsing base publication", e);
            }

            const normalizedData = {
                ...normalizedViewData,
                ...baseData,
                idPublicacion:
                    baseData.idPublicacion ??
                    baseData.idpublicacion ??
                    normalizedViewData.idPublicacion ??
                    normalizedViewData.idpublicacion,

                nombreVendedor: normalizedViewData.nombreVendedor || baseData.nombreVendedor || "Vendedor",

                fotos: baseData.fotos || normalizedViewData.fotos || [],
                estado: (baseData.estado ?? normalizedViewData.estado)?.toLowerCase(),

                resenas: (() => {
                    const baseResenas = baseData.resenas || [];
                    const viewResenas = normalizedViewData.resenas || [];

                    return baseResenas.map((res: any, index: number) => {
                        const viewMatch = viewResenas.find((vr: any) => vr.id === res.id) || viewResenas[index] || {};

                        return {
                            id: res.id || viewMatch.id || index,
                            comentario: res.comentario || viewMatch.comentario || "",
                            calificacion: res.calificacion ?? viewMatch.calificacion ?? 5,
                            nombreCliente: viewMatch.nombreCliente || res.nombreCliente || viewMatch.nombre || "Usuario Anónimo"
                        };
                    });
                })(),

                vendedorId: Number(
                    baseData.vendedorId ??
                    baseData.idVendedor ??
                    normalizedViewData.vendedorId ??
                    normalizedViewData.vendedor_id ??
                    0,
                ),
                propiedad: {
                    ...(normalizedViewData.propiedad || {}),
                    idEstadoPropiedad: Number(
                        baseData.idEstadoPropiedad ??
                        baseData.propiedad?.idEstadoPropiedad ??
                        normalizedViewData.propiedad?.idEstadoPropiedad ??
                        1,
                    ),
                    estadoPropiedad: Number(
                        baseData.idEstadoPropiedad ??
                        baseData.propiedad?.idEstadoPropiedad ??
                        normalizedViewData.propiedad?.idEstadoPropiedad ??
                        normalizedViewData.propiedad?.estadoPropiedad ??
                        1,
                    ),
                },
            };
            setData(normalizedData);
        } catch (error) {
            setErrorMsg("Error al conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchDetalle();
    }, [id, token]);

    // Debug logs for ownership comparison
    useEffect(() => {
        if (data && user) {
            console.log("DEBUG: Comparación de autoría");
            console.log("Usuario logueado:", user);
            console.log("ID Usuario (user.idUsuario):", user.idUsuario);
            console.log("Detalle Publicación (vendedor):", data.vendedorId);
            console.log("¿Es dueño?:", user.idUsuario === data.vendedorId);
        }
    }, [data, user]);

    const handleReviewSubmit = async (e: React.ChangeEvent) => {
        e.preventDefault();
        if (!user) return;

        setSubmittingReview(true);
        setReviewMessage({ type: "", text: "" });

        const payload = {
            comentario: newReview.comentario,
            calificacion: newReview.calificacion,
            publicacionId: Number(id),
            usuarioId: user.idUsuario,
        };

        try {
            const response = await fetch(
                "http://localhost:3000/api/v1/resenas/crear",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                },
            );

            if (response.ok) {
                setReviewMessage({
                    type: "success",
                    text: "¡Reseña publicada con éxito!",
                });
                setNewReview({ comentario: "", calificacion: 5 });
                fetchDetalle(); // Refresh reviews
            } else {
                const data = await response.json();
                setReviewMessage({
                    type: "error",
                    text: data.message || "Error al publicar la reseña",
                });
            }
        } catch (error) {
            setReviewMessage({ type: "error", text: "Error de conexión" });
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleDelete = async () => {
        if (!data || !user) return;

        const confirmDelete = window.confirm(
            "¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.",
        );
        if (!confirmDelete) return;

        setIsDeleting(true);

        try {
            const response = await fetch(
                `http://localhost:3000/api/v1/publicacion/eliminar-cascada/${data.idPublicacion}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        idPublicacion: data.idPublicacion,
                        vendedorId: user.idUsuario,
                    }),
                },
            );

            if (response.ok) {
                alert("Publicación eliminada exitosamente");
                navigate("/propiedades");
            } else {
                const errData = await response.json();
                alert(errData.message || "Error al eliminar la publicación");
            }
        } catch (error) {
            alert("Error de conexión al intentar eliminar");
        } finally {
            setIsDeleting(false);
        }
    };

    const allPhotos = data?.fotos || [];

    const nextImage = () => {
        if (allPhotos.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % allPhotos.length);
        }
    };

    const prevImage = () => {
        if (allPhotos.length > 0) {
            setCurrentImageIndex(
                (prev) => (prev - 1 + allPhotos.length) % allPhotos.length,
            );
        }
    };

    if (loading) {
        return (
            <main className="page-shell page-light">
                <p style={{ textAlign: "center", padding: "100px" }}>
                    Cargando detalles de la propiedad...
                </p>
            </main>
        );
    }

    if (errorMsg || !data) {
        return (
            <main className="page-shell page-light">
                <div style={{ textAlign: "center", padding: "100px" }}>
                    <h2>Lo sentimos</h2>
                    <p style={{ color: "#64748b", marginTop: "10px" }}>{errorMsg}</p>
                    <Link
                        to="/propiedades"
                        className="button button-primary"
                        style={{ marginTop: "20px" }}
                    >
                        Volver a Propiedades
                    </Link>
                </div>
            </main>
        );
    }

    const randomTone = tones[data.idPublicacion % tones.length];

    return (
        <main className="page-shell page-light">
            <div className="property-detail-layout">
                {/* Header Section */}
                <section className="detail-header">
                    <div
                        className={`detail-hero-image ${allPhotos.length === 0 ? randomTone : ""}`}
                        style={{
                            position: "relative",
                            overflow: "hidden",
                            backgroundColor: "#1e293b",
                        }}
                    >
                        {allPhotos.length > 0 ? (
                            <>
                                <img
                                    src={normalizeUrl(allPhotos[currentImageIndex].url)}
                                    alt={`${data.titulo} - ${currentImageIndex + 1}`}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                        transition: "opacity 0.3s ease",
                                    }}
                                />
                                {allPhotos.length > 1 && (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                prevImage();
                                            }}
                                            style={{
                                                position: "absolute",
                                                left: "16px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                width: "44px",
                                                height: "44px",
                                                borderRadius: "50%",
                                                backgroundColor: "rgba(0,0,0,0.5)",
                                                color: "white",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: "24px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                zIndex: 10,
                                            }}
                                        >
                                            ‹
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                nextImage();
                                            }}
                                            style={{
                                                position: "absolute",
                                                right: "16px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                width: "44px",
                                                height: "44px",
                                                borderRadius: "50%",
                                                backgroundColor: "rgba(0,0,0,0.5)",
                                                color: "white",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: "24px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                zIndex: 10,
                                            }}
                                        >
                                            ›
                                        </button>
                                        <div
                                            style={{
                                                position: "absolute",
                                                bottom: "16px",
                                                right: "16px",
                                                backgroundColor: "rgba(0,0,0,0.6)",
                                                color: "white",
                                                padding: "4px 12px",
                                                borderRadius: "20px",
                                                fontSize: "0.85rem",
                                                fontWeight: "600",
                                            }}
                                        >
                                            {currentImageIndex + 1} / {allPhotos.length}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : null}
                        <div className="detail-hero-overlay">
                            <span className="detail-price-tag">
                                {new Intl.NumberFormat("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                    maximumFractionDigits: 0,
                                }).format(data.precio)}
                            </span>
                        </div>
                    </div>
                    <div className="detail-main-info">
                        <h1>{data.titulo}</h1>
                        <p className="detail-location">
                            {data.propiedad.direccion}, {data.propiedad.ciudad}
                        </p>

                        {isAuthenticated &&
                            user?.idRol === 1 &&
                            user?.idUsuario === data.vendedorId && (
                                <div style={{ marginBottom: "20px" }}>
                                    <button
                                        onClick={handleDelete}
                                        className="button"
                                        disabled={isDeleting}
                                        style={{
                                            backgroundColor: "#ef4444",
                                            color: "white",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            border: "none",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {isDeleting ? "Eliminando..." : "🗑️ Eliminar Publicación"}
                                    </button>
                                </div>
                            )}

                        <div className="detail-meta-strip">
                            <div className="meta-item">
                                <span className="meta-value">
                                    {data.propiedad.habitaciones}
                                </span>
                                <span className="meta-label">Habitaciones</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-value">{data.propiedad.banos}</span>
                                <span className="meta-label">Baños</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-value">{data.propiedad.metraje} m²</span>
                                <span className="meta-label">Superficie</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-value">{data.propiedad.tipo}</span>
                                <span className="meta-label">Tipo</span>
                            </div>
                        </div>

                        {/* Opción de Pago si no es el dueño y no está vendida */}
                        {isAuthenticated && user?.idUsuario !== data.vendedorId && (
                            <div style={{ marginTop: "24px" }}>
                                {data.propiedad.estadoPropiedad === 2 ||
                                    data.estado === "vendido" ? (
                                    <div
                                        style={{
                                            backgroundColor: "#fee2e2",
                                            color: "#991b1b",
                                            padding: "16px",
                                            borderRadius: "12px",
                                            textAlign: "center",
                                            fontWeight: "800",
                                            border: "2px solid #ef4444",
                                            fontSize: "1.2rem",
                                        }}
                                    >
                                        🔴 Esta propiedad ya ha sido vendida
                                    </div>
                                ) : (
                                    <Link
                                        to={`/pagar/${data.idPublicacion}?monto=${data.precio}`}
                                        className="button button-primary btn-full"
                                        style={{ height: "52px", fontSize: "1.1rem" }}
                                    >
                                        💳 Proceder al Pago
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                <div className="detail-content-grid">
                    {/* Left Column: Description */}
                    <section className="detail-description">
                        <h2>Descripción</h2>
                        <p>{data.descripcion}</p>

                        <div className="detail-info-block">
                            <h3>Detalles adicionales</h3>
                            <ul>
                                <li>
                                    <strong>Publicado el:</strong>{" "}
                                    {new Date(data.fechaPublicacion).toLocaleDateString()}
                                </li>
                                <li>
                                    <strong>Ciudad:</strong> {data.propiedad.ciudad}
                                </li>
                                <li>
                                    <strong>Dirección:</strong> {data.propiedad.direccion}
                                </li>
                            </ul>
                        </div>

                        {/* Write a Review Section */}
                        <section className="write-review-section">
                            <h2>Dejar una Reseña</h2>
                            {isAuthenticated ? (
                                <form className="review-form" onSubmit={handleReviewSubmit}>
                                    {reviewMessage.text && (
                                        <div className={`message-banner ${reviewMessage.type}`}>
                                            {reviewMessage.text}
                                        </div>
                                    )}
                                    <div className="star-rating-selector">
                                        <p>Calificación:</p>
                                        <div className="stars">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    className={`star-btn ${newReview.calificacion >= star ? "active" : ""}`}
                                                    onClick={() =>
                                                        setNewReview({ ...newReview, calificacion: star })
                                                    }
                                                >
                                                    ★
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <textarea
                                        placeholder="Escribe tu comentario sobre esta propiedad..."
                                        required
                                        value={newReview.comentario}
                                        onChange={(e) =>
                                            setNewReview({ ...newReview, comentario: e.target.value })
                                        }
                                    />
                                    <button
                                        type="submit"
                                        className="button button-primary"
                                        disabled={submittingReview}
                                    >
                                        {submittingReview ? "Publicando..." : "Publicar Reseña"}
                                    </button>
                                </form>
                            ) : (
                                <div className="login-prompt">
                                    <p>Debes iniciar sesión para dejar una reseña.</p>
                                    <Link to="/iniciar-sesion" className="button button-ghost">
                                        Iniciar Sesión
                                    </Link>
                                </div>
                            )}
                        </section>

                        {/* Reviews Section */}
                        <section className="detail-reviews">
                            <h2>Reseñas de la Propiedad</h2>
                            {data.resenas && data.resenas.length > 0 ? (
                                <div className="reviews-list">
                                    {data.resenas.map((res) => (
                                        <div key={res.id} className="review-card">
                                            <div className="review-header">
                                                <span className="review-user">{res.nombreCliente}</span>
                                                <span className="review-rating">
                                                    {"★".repeat(res.calificacion)}
                                                    {"☆".repeat(5 - res.calificacion)}
                                                </span>
                                            </div>
                                            <p>{res.comentario}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-reviews">El vendedor aún no tiene reseñas.</p>
                            )}
                        </section>
                    </section>

                    {/* Right Column: Contact/Seller Info */}
                    <aside className="detail-sidebar">
                        <div className="seller-card">
                            <h3>Información del Vendedor</h3>
                            <div className="seller-info">
                                <div className="seller-avatar">
                                    {data.nombreVendedor.charAt(0)}
                                </div>
                                <div>
                                    <p className="seller-name">{data.nombreVendedor}</p>
                                    <p className="seller-status">Vendedor Verificado</p>
                                </div>
                            </div>
                            <button
                                className="button button-primary btn-full"
                                style={{ marginTop: "20px" }}
                            >
                                Contactar Vendedor
                            </button>
                        </div>

                        <div className="safety-card">
                            <h4>Consejos de seguridad</h4>
                            <ul>
                                <li>No pagues por adelantado sin ver la propiedad.</li>
                                <li>Verifica la identidad del vendedor.</li>
                                <li>Realiza los trámites en lugares seguros.</li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
