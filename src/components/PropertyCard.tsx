import React, { useState } from "react";
import { Link } from "react-router-dom";

interface Foto {
  url: string;
  nombre: string;
}

interface Publicacion {
  idPublicacion: number;
  titulo: string;
  precio: number;
  ciudad: string;
  habitaciones: number;
  banos: number;
  metraje: number;
  estado?: string;
  fotos?: Foto[];
}

const tones = ["tone-a", "tone-b", "tone-c", "tone-d", "tone-e", "tone-f"];

const normalizeUrl = (url: string) => {
  if (!url) return "";
  return url.replace("http://floci:", "http://localhost:");
};

interface PropertyCardProps {
  pub: Publicacion;
  index: number;
}

export function PropertyCard({ pub, index }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const allPhotos = pub.fotos || [];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (allPhotos.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % allPhotos.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (allPhotos.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + allPhotos.length) % allPhotos.length,
      );
    }
  };

  return (
    <article className="property-card-modern">
      <div
        className={`property-image ${allPhotos.length === 0 ? tones[index % tones.length] : ""}`}
        style={{
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#1e293b",
          height: "240px",
        }}
      >
        {allPhotos.length > 0 ? (
          <>
            <img
              src={normalizeUrl(allPhotos[currentImageIndex].url)}
              alt={`${pub.titulo} - ${currentImageIndex + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
            {allPhotos.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  style={{
                    position: "absolute",
                    left: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    zIndex: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    zIndex: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ›
                </button>
                <div
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    right: "8px",
                    backgroundColor: "rgba(0,0,0,0.6)",
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                  }}
                >
                  {currentImageIndex + 1} / {allPhotos.length}
                </div>
              </>
            )}
          </>
        ) : null}
        <span className="property-price">
          {new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
          }).format(pub.precio)}
        </span>
      </div>
      <div className="property-body">
        <h3>{pub.titulo}</h3>
        <p>{pub.ciudad}</p>
        <div className="property-meta">
          <span>{pub.habitaciones} hab</span>
          <span>{pub.banos} baños</span>
          <span>{pub.metraje} m²</span>
        </div>
        <Link
          to={`/propiedades/${pub.idPublicacion}`}
          className="button button-primary btn-full"
        >
          Ver Detalles
        </Link>
      </div>
    </article>
  );
}
