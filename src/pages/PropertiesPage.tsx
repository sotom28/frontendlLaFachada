import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { PropertyCard } from "../components/PropertyCard";

interface Publicacion {
  idPublicacion: number;
  titulo: string;
  precio: number;
  ciudad: string;
  habitaciones: number;
  banos: number;
  metraje: number;
  estado?: string;
  fotos?: { url: string; nombre: string }[];
}

const ITEMS_PER_PAGE = 9;

const CITIES = [
  { id_ciudad: 1, nombre: "Viña del Mar" },
  { id_ciudad: 2, nombre: "Valparaíso" },
  { id_ciudad: 3, nombre: "Santiago" },
  { id_ciudad: 4, nombre: "Concepción" },
  { id_ciudad: 5, nombre: "Antofagasta" },
  { id_ciudad: 6, nombre: "Calama" },
  { id_ciudad: 7, nombre: "La Serena" },
  { id_ciudad: 8, nombre: "Coquimbo" },
  { id_ciudad: 9, nombre: "Rancagua" },
  { id_ciudad: 10, nombre: "Talca" },
  { id_ciudad: 11, nombre: "Puerto Montt" },
  { id_ciudad: 12, nombre: "Punta Arenas" }
];

export function PropertiesPage() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [term, setTerm] = useState("");
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);

  const { token } = useAuth();

  useEffect(() => {
    const fetchPublicaciones = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const url = selectedCityId !== null
          ? `http://localhost:3000/api/v1/publicacion/ciudad/${selectedCityId}`
          : "http://localhost:3000/api/v1/views/publicaciones-containers";

        const response = await fetch(url, { headers });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          console.log(`DEBUG: Publicaciones list from ${url}:`, data);
          if (Array.isArray(data)) {
            // Normalize and Filter out sold properties
            const activePublicaciones = data
              .map((pub: any) => ({
                ...pub,
                idPublicacion: pub.idPublicacion ?? pub.idpublicacion ?? pub.id_publicacion,
                titulo: pub.titulo ?? pub.title,
                precio: pub.precio ?? pub.price,
                habitaciones: pub.habitaciones ?? pub.habitaciones_count ?? pub.cantidadHabitaciones ?? pub.cantidad_habitaciones ?? 0,
                banos: pub.banos ?? pub.cantidadBaños ?? pub.cantidad_banos ?? 0,
                metraje: pub.metraje ?? pub.area ?? 0,
                fotos: pub.fotos || [],
                estado: pub.estado?.toLowerCase(),
                ciudad: pub.ciudad || CITIES.find((c) => c.id_ciudad === selectedCityId)?.nombre || "",
              }))
              .filter((pub: any) => pub.estado !== "vendido");

            setPublicaciones(activePublicaciones);
          } else {
            setPublicaciones([]); // Ensure it's an array
            setErrorMsg("No hay publicaciones disponibles para esta ciudad");
          }
        } else {
          const text = await response.text();
          setErrorMsg(text || "No hay publicaciones disponibles");
        }
      } catch (error) {
        setErrorMsg("No hay publicaciones disponibles");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicaciones();
  }, [selectedCityId, token]);

  const handleCitySelect = (id: number) => {
    setSelectedCityId(id);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCityId(null);
    setCurrentPage(1);
  };

  // Basic filtering logic (local for now as requested)
  const filtered = useMemo(() => {
    const q = term.toLowerCase().trim();
    if (!q) return publicaciones;
    return publicaciones.filter(
      (item) =>
        item.titulo.toLowerCase().includes(q) ||
        item.ciudad.toLowerCase().includes(q),
    );
  }, [term, publicaciones]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filtered.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // Generate page numbers to show (sliding window of 5 if possible)
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="page-shell page-light">
      <section className="section-header">
        <h1>Nuestras Propiedades</h1>
        <p>Explora {filtered.length} propiedades disponibles</p>
      </section>

      <div className="properties-container-layout">
        {/* Sidebar Filters like Mercado Libre */}
        <aside className="properties-sidebar">
          <div className="sidebar-filter-group">
            <h3>Ubicación</h3>
            <ul className="filter-list">
              {CITIES.map((city) => (
                <li key={city.id_ciudad}>
                  <button
                    type="button"
                    className={`filter-link-btn ${selectedCityId === city.id_ciudad ? "active" : ""}`}
                    onClick={() => handleCitySelect(city.id_ciudad)}
                  >
                    {city.nombre}
                  </button>
                </li>
              ))}
            </ul>
            {selectedCityId !== null && (
              <button
                type="button"
                className="button button-ghost clear-filter-btn"
                onClick={handleClearFilters}
              >
                Limpiar Filtros
              </button>
            )}
          </div>
        </aside>

        {/* Main content grid */}
        <div className="properties-main-content">
          <section className="search-toolbar">
            <input
              type="text"
              value={term}
              onChange={(event) => {
                setTerm(event.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              placeholder="Buscar por título o ubicación..."
            />
            {selectedCityId !== null && (
              <div className="active-filters-row">
                <span className="active-filter-badge">
                  {CITIES.find((c) => c.id_ciudad === selectedCityId)?.nombre}
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="remove-badge-btn"
                    title="Eliminar filtro"
                  >
                    &times;
                  </button>
                </span>
              </div>
            )}
          </section>

          {loading ? (
            <p style={{ textAlign: "center", padding: "40px" }}>
              Cargando propiedades...
            </p>
          ) : errorMsg || filtered.length === 0 ? (
            <p style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
              {errorMsg ||
                "No se encontraron propiedades que coincidan con tu búsqueda."}
            </p>
          ) : (
            <>
              <p className="results-text">
                Mostrando {paginatedItems.length} de {filtered.length} propiedades
              </p>

              <section className="property-grid-cards">
                {paginatedItems.map((pub, index) => (
                  <PropertyCard
                    key={pub.idPublicacion}
                    pub={pub}
                    index={startIndex + index}
                  />
                ))}
              </section>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  <button
                    className="button button-ghost"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Anterior
                  </button>

                  <div className="pagination-numbers">
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        className={`button ${currentPage === page ? "button-primary" : "button-ghost"}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    className="button button-ghost"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
