import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface AgendaItem {
    idAgenda: number;
    idagenda?: number; // Por si acaso viene todo en minúsculas
    clienteMensaje: string;
    vendedorMensaje: string | null;
    estadoCita: string;
    fecha: string;
    publicacion: {
        id: number;
        titulo: string;
        precio: number;
        ubicacion: string;
        ciudad: string;
        fotoPrincipal: string;
    };
    participante: {
        id: number;
        nombre: string;
        rol: string;
    };
}

const normalizeUrl = (url: string) => {
    if (!url) return "";
    return url.replace("http://floci:", "http://localhost:");
};

export function AgendasPage() {
    const { user, token, isAuthenticated } = useAuth();
    const [agendas, setAgendas] = useState<AgendaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // States for seller response
    const [responseTexts, setResponseTexts] = useState<{[key: number]: string}>({});
    const [submittingIds, setSubmittingIds] = useState<number[]>([]);

    const fetchAgendas = async () => {
        if (!user || !token) return;

        setLoading(true);
        setError("");

        const role = user.idRol === 1 ? "vendedor" : "cliente";
        const endpoint = `http://localhost:3000/api/v1/views/agenda/historial?userId=${user.idUsuario}&role=${role}`;

        try {
            const response = await fetch(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("DEBUG: Agendas recibidas:", data);
                if (data.length > 0) {
                    console.log("DEBUG: Primer elemento:", data[0]);
                }
                setAgendas(data);
            } else {
                setError("Error al cargar las agendas");
            }
        } catch (err) {
            setError("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchAgendas();
        }
    }, [isAuthenticated, user, token]);

    // Función auxiliar para obtener el ID de forma robusta
    const getAgendaId = (item: AgendaItem): number => {
        return item.idAgenda || item.idagenda || (item as any).id || 0;
    };

    const handleUpdateStatus = async (agendaId: number, nuevoEstado: string) => {
        console.log("DEBUG: Intentando actualizar ID:", agendaId, "Estado:", nuevoEstado);
        
        if (!agendaId) {
            alert("Error: No se pudo identificar el ID de la agenda. Revisa la consola.");
            return;
        }

        if (!token) return;

        const respuesta = responseTexts[agendaId] || "";
        setSubmittingIds(prev => [...prev, agendaId]);

        try {
            const response = await fetch(`http://localhost:3000/api/v0/agenda/${agendaId}/estado`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    estado: nuevoEstado,
                    respuesta: respuesta
                }),
            });

            if (response.ok) {
                setAgendas(prev => prev.map(item => {
                    const itemId = getAgendaId(item);
                    return itemId === agendaId 
                        ? { ...item, estadoCita: nuevoEstado, vendedorMensaje: respuesta } 
                        : item;
                }));
                setResponseTexts(prev => {
                    const next = { ...prev };
                    delete next[agendaId];
                    return next;
                });
            } else {
                alert("Error al actualizar el estado de la cita");
            }
        } catch (err) {
            alert("Error de conexión al intentar actualizar");
        } finally {
            setSubmittingIds(prev => prev.filter(id => id !== agendaId));
        }
    };

    if (!isAuthenticated) {
        return (
            <main className="page-shell page-light">
                <div style={{ textAlign: "center", padding: "100px" }}>
                    <h2>Acceso Denegado</h2>
                    <p>Debes iniciar sesión para ver tus agendas.</p>
                    <Link to="/iniciar-sesion" className="button button-primary" style={{ marginTop: "20px" }}>
                        Iniciar Sesión
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="page-shell page-light">
            <div className="container" style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
                <header style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h1 style={{ fontSize: "2rem", color: "#1e293b" }}>Mis Agendas</h1>
                        <p style={{ color: "#64748b" }}>
                            {user?.idRol === 1 ? "Gestiona las citas de tus propiedades" : "Consulta tus próximas visitas a propiedades"}
                        </p>
                    </div>
                    <Link 
                        to="/propiedades" 
                        className="button button-outline" 
                        style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "8px",
                            padding: "10px 20px",
                            border: "2px solid #3b82f6",
                            borderRadius: "8px",
                            backgroundColor: "#eff6ff",
                            color: "#1d4ed8",
                            fontWeight: "600",
                            textDecoration: "none",
                            transition: "all 0.2s ease"
                        }}
                    >
                        🔍 Explorar Propiedades
                    </Link>
                </header>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "50px" }}>
                        <p>Cargando agendas...</p>
                    </div>
                ) : error ? (
                    <div style={{ backgroundColor: "#fee2e2", color: "#991b1b", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
                        {error}
                    </div>
                ) : agendas.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "80px 20px", backgroundColor: "white", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "20px" }}>📅</div>
                        <h2 style={{ color: "#1e293b" }}>No tienes agendas programadas</h2>
                        <p style={{ color: "#64748b", maxWidth: "400px", margin: "10px auto 25px" }}>
                            Parece que aún no tienes citas pendientes. ¡Explora nuestras propiedades y agenda una visita hoy mismo!
                        </p>
                        <Link to="/propiedades" className="button button-primary">
                            Ver Propiedades Disponibles
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: "grid", gap: "20px" }}>
                        {agendas.map((item, index) => {
                            const actualId = getAgendaId(item);
                            
                            return (
                                <div key={actualId || index} style={{ 
                                    backgroundColor: "white", 
                                    padding: "0", 
                                    borderRadius: "12px", 
                                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                                    border: "1px solid #e2e8f0",
                                    display: "flex",
                                    overflow: "hidden",
                                    minHeight: "180px"
                                }}>
                                    {/* Miniatura de la propiedad */}
                                    <div style={{ width: "220px", flexShrink: 0, position: "relative" }}>
                                        <img 
                                            src={normalizeUrl(item.publicacion.fotoPrincipal)} 
                                            alt={item.publicacion.titulo}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                        <div style={{ 
                                            position: "absolute", 
                                            top: "10px", 
                                            left: "10px",
                                            padding: "4px 10px",
                                            borderRadius: "6px",
                                            fontSize: "0.7rem",
                                            fontWeight: "700",
                                            textTransform: "uppercase",
                                            backgroundColor: item.estadoCita?.toLowerCase() === "pendiente" ? "#fef3c7" : item.estadoCita?.toLowerCase() === "aceptada" ? "#dcfce7" : "#fee2e2",
                                            color: item.estadoCita?.toLowerCase() === "pendiente" ? "#92400e" : item.estadoCita?.toLowerCase() === "aceptada" ? "#166534" : "#991b1b",
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                                        }}>
                                            {item.estadoCita}
                                        </div>
                                    </div>

                                    {/* Contenido detallado */}
                                    <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                        <div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                                                <h3 style={{ fontSize: "1.2rem", color: "#1e293b", margin: "0", fontWeight: "700" }}>
                                                    {item.publicacion.titulo}
                                                </h3>
                                                <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "#3b82f6" }}>
                                                    {new Intl.NumberFormat("es-CO", {
                                                        style: "currency",
                                                        currency: "COP",
                                                        maximumFractionDigits: 0,
                                                    }).format(item.publicacion.precio)}
                                                </span>
                                            </div>
                                            
                                            <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0 0 12px 0", display: "flex", alignItems: "center", gap: "5px" }}>
                                                📍 {item.publicacion.ubicacion}, {item.publicacion.ciudad}
                                            </p>

                                            <div style={{ display: "grid", gridTemplateColumns: item.vendedorMensaje ? "1fr 1fr" : "1fr", gap: "15px", marginBottom: "15px" }}>
                                                <div style={{ 
                                                    padding: "12px", 
                                                    backgroundColor: "#f8fafc", 
                                                    borderRadius: "8px", 
                                                    borderLeft: "4px solid #3b82f6",
                                                }}>
                                                    <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#64748b", marginBottom: "4px", textTransform: "uppercase" }}>Mensaje del Cliente:</p>
                                                    <p style={{ margin: "0", fontSize: "0.9rem", fontStyle: "italic", color: "#475569" }}>
                                                        "{item.clienteMensaje}"
                                                    </p>
                                                </div>

                                                {item.vendedorMensaje && (
                                                    <div style={{ 
                                                        padding: "12px", 
                                                        backgroundColor: item.estadoCita?.toLowerCase() === "cancelada" ? "#fef2f2" : "#f0fdf4", 
                                                        borderRadius: "8px", 
                                                        borderLeft: `4px solid ${item.estadoCita?.toLowerCase() === "cancelada" ? "#ef4444" : "#22c55e"}`,
                                                    }}>
                                                        <p style={{ 
                                                            fontSize: "0.75rem", 
                                                            fontWeight: "700", 
                                                            color: item.estadoCita?.toLowerCase() === "cancelada" ? "#991b1b" : "#166534", 
                                                            marginBottom: "4px", 
                                                            textTransform: "uppercase" 
                                                        }}>
                                                            Respuesta del Vendedor:
                                                        </p>
                                                        <p style={{ 
                                                            margin: "0", 
                                                            fontSize: "0.9rem", 
                                                            fontStyle: "italic", 
                                                            color: item.estadoCita?.toLowerCase() === "cancelada" ? "#991b1b" : "#166534" 
                                                        }}>
                                                            "{item.vendedorMensaje}"
                                                        </p>
                                                    </div>
                                                )}

                                            </div>

                                            {/* Seller Response Interface */}
                                            {user?.idRol === 1 && item.estadoCita?.toLowerCase() === "pendiente" && actualId && (
                                                <div style={{ marginTop: "15px", padding: "15px", backgroundColor: "#f1f5f9", borderRadius: "10px" }}>
                                                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "8px" }}>Responder al cliente:</label>
                                                    <textarea 
                                                        placeholder="Escribe una respuesta..."
                                                        style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", marginBottom: "12px", minHeight: "60px", fontSize: "0.9rem" }}
                                                        value={responseTexts[actualId] || ""}
                                                        onChange={(e) => setResponseTexts({...responseTexts, [actualId]: e.target.value})}
                                                    />
                                                    <div style={{ display: "flex", gap: "10px" }}>
                                                        <button 
                                                            className="button button-primary"
                                                            style={{ flex: 1, backgroundColor: "#22c55e" }}
                                                            onClick={() => handleUpdateStatus(actualId, "ACEPTADA")}
                                                            disabled={submittingIds.includes(actualId)}
                                                        >
                                                            {submittingIds.includes(actualId) ? "Procesando..." : "✅ Aceptar"}
                                                        </button>
                                                        <button 
                                                            className="button"
                                                            style={{ flex: 1, backgroundColor: "#ef4444", color: "white" }}
                                                            onClick={() => handleUpdateStatus(actualId, "CANCELADA")}
                                                            disabled={submittingIds.includes(actualId)}
                                                        >
                                                            ❌ Cancelar
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {item.estadoCita?.toLowerCase() === "pendiente" && user?.idRol !== 1 && (
                                                <div style={{ 
                                                    fontSize: "0.8rem", 
                                                    color: "#b45309", 
                                                    backgroundColor: "#fffbeb", 
                                                    padding: "6px 10px", 
                                                    borderRadius: "6px",
                                                    border: "1px solid #fde68a",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    marginBottom: "15px"
                                                }}>
                                                    <span>🔔</span>
                                                    <span>Esperando respuesta del vendedor.</span>
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <div style={{ 
                                                    width: "32px", 
                                                    height: "32px", 
                                                    borderRadius: "50%", 
                                                    backgroundColor: "#e2e8f0", 
                                                    display: "flex", 
                                                    alignItems: "center", 
                                                    justifyContent: "center",
                                                    fontSize: "0.8rem",
                                                    fontWeight: "600",
                                                    color: "#475569"
                                                }}>
                                                    {item.participante.nombre.charAt(0)}
                                                </div>
                                                <span style={{ fontSize: "0.9rem", color: "#334155" }}>
                                                    <span style={{ color: "#64748b" }}>{item.participante.rol === "vendedor" ? "Vendedor: " : "Cliente: "}</span>
                                                    <strong>{item.participante.nombre}</strong>
                                                </span>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                                <div style={{ textAlign: "right" }}>
                                                    <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#1e293b" }}>
                                                        📅 Fecha solicitada: {new Date(item.fecha).toLocaleDateString('es-ES', { 
                                                            day: 'numeric', 
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <Link to={`/propiedades/${item.publicacion.id}`} className="button button-ghost" style={{ fontSize: "0.85rem", padding: "5px 10px" }}>
                                                    Ver Detalle
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
