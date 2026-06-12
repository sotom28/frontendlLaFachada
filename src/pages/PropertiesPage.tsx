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

export function PropertiesPage() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [term, setTerm] = useState("");

  const { token } = useAuth();

  useEffect(() => {
    const fetchPublicaciones = async () => {
      try {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          "http://localhost:3000/api/v1/views/publicaciones-containers",
          {
            headers,
          },
        );

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          console.log("DEBUG: Publicaciones list raw data:", data);
          if (Array.isArray(data)) {
            // Normalize and Filter out sold properties
            const activePublicaciones = data
              .map((pub: any) => ({
                ...pub,
                idPublicacion: pub.idPublicacion ?? pub.idpublicacion,
                fotos: pub.fotos || [],
                estado: pub.estado?.toLowerCase(),
              }))
              .filter((pub: any) => pub.estado !== "vendido");

            setPublicaciones(activePublicaciones);
          } else {
            setPublicaciones([]); // Ensure it's an array
            setErrorMsg("No hay publicaciones disponibles");
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
  }, []);

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
        <button type="button" className="button button-ghost">
          Filtros
        </button>
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
    </main>
  );
}
