import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './propiedad.css'

interface FormData {
  nombre: string
  tipo: string
  direccion: string
  ciudad: string
  region: string
  codigo_postal: string
  precio: string
  descripcion: string
  habitaciones: string
  banos: string
  area: string
  garage: string
  patio: string
  estado: string
  amenidades: string[]
  imagenes: File[]
  contacto_nombre: string
  contacto_telefono: string
  contacto_email: string
}

const amenidadesOptions = [
  'Piscina',
  'Gimnasio',
  'Jardín',
  'Terraza',
  'Balcón',
  'Aire Acondicionado',
  'Calefacción',
  'Seguridad 24/7',
  'Portería',
  'Juegos Infantiles',
  'Ascensor',
  'Sótano'
]

export function PropiedadPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    tipo: 'Apartamento',
    direccion: '',
    ciudad: '',
    region: '',
    codigo_postal: '',
    precio: '',
    descripcion: '',
    habitaciones: '',
    banos: '',
    area: '',
    garage: '',
    patio: '',
    estado: 'disponible',
    amenidades: [],
    imagenes: [],
    contacto_nombre: '',
    contacto_telefono: '',
    contacto_email: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [enviado, setEnviado] = useState(false)
  const [preview, setPreview] = useState<string[]>([])

  const sessionRaw = localStorage.getItem('clienteActual')
  const session = sessionRaw ? JSON.parse(sessionRaw) : null
  if (!session) {
    navigate('/iniciar-sesion')
    return null
  }

  const isSeller = session.role === 'seller' && session.sellerApproved
  const isPending = !!session.pendingSeller

  const requestSeller = () => {
    const usersRaw = localStorage.getItem('users')
    const users = usersRaw ? JSON.parse(usersRaw) : []
    const idx = users.findIndex((u: any) => u.email === session.email)
    if (idx !== -1) {
      users[idx].pendingSeller = true
      localStorage.setItem('users', JSON.stringify(users))
      const updated = { ...session, pendingSeller: true }
      localStorage.setItem('clienteActual', JSON.stringify(updated))
      alert('Solicitud enviada. Un administrador revisará tu petición.')
      navigate('/cliente-menu')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleCheckboxChange = (amenidad: string) => {
    setFormData(prev => ({
      ...prev,
      amenidades: prev.amenidades.includes(amenidad)
        ? prev.amenidades.filter(a => a !== amenidad)
        : [...prev.amenidades, amenidad]
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      const newPreviews = newFiles.map(file => URL.createObjectURL(file))
      
      setFormData(prev => ({
        ...prev,
        imagenes: [...prev.imagenes, ...newFiles].slice(0, 5)
      }))
      
      setPreview(prev => [...prev, ...newPreviews].slice(0, 5))
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index)
    }))
    setPreview(prev => prev.filter((_, i) => i !== index))
  }

  const validarFormulario = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido'
    if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es requerida'
    if (!formData.ciudad.trim()) newErrors.ciudad = 'La ciudad es requerida'
    if (!formData.precio.trim()) newErrors.precio = 'El precio es requerido'
    if (!formData.habitaciones.trim()) newErrors.habitaciones = 'Los dormitorios son requeridos'
    if (!formData.banos.trim()) newErrors.banos = 'Los baños son requeridos'
    if (!formData.area.trim()) newErrors.area = 'El área es requerida'
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es requerida'
    if (!formData.contacto_nombre.trim()) newErrors.contacto_nombre = 'Tu nombre es requerido'
    if (!formData.contacto_telefono.trim()) newErrors.contacto_telefono = 'Tu teléfono es requerido'
    if (!formData.contacto_email.trim()) newErrors.contacto_email = 'Tu email es requerido'
    if (formData.imagenes.length === 0) newErrors.imagenes = 'Debes subir al menos una imagen'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validarFormulario()) {
      return
    }

    const propiedadNueva = {
      id: Date.now().toString(),
      ...formData,
      precio: parseFloat(formData.precio),
      habitaciones: parseInt(formData.habitaciones),
      banos: parseInt(formData.banos),
      area: parseFloat(formData.area),
      garage: parseInt(formData.garage) || 0,
      fecha_creacion: new Date().toISOString().split('T')[0],
      vendedor: session.email,
      requiereAgente: true,
      pagoPendiente: true
    }

    const propiedadesGuardadas = localStorage.getItem('propiedadesAgregadas')
    const propiedades = propiedadesGuardadas ? JSON.parse(propiedadesGuardadas) : []
    propiedades.push(propiedadNueva)
    localStorage.setItem('propiedadesAgregadas', JSON.stringify(propiedades))

    setEnviado(true)

    setTimeout(() => {
      navigate('/cliente-menu')
    }, 2000)
  }

  if (enviado) {
    return (
      <div className="propiedad-exito">
        <div className="exito-contenedor">
          <div className="exito-icono">✓</div>
          <h2>¡Propiedad Agregada Exitosamente!</h2>
          <p>Tu propiedad requiere asignación de agente y validación de pago.</p>
          <p className="redireccionando">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return (
    !isSeller ? (
      <div className="propiedad-container">
        <header className="propiedad-header">
          <button className="btn-volver" onClick={() => navigate('/cliente-menu')}>
            ← Volver
          </button>
          <h1>Agregar Nueva Propiedad</h1>
        </header>
        <main className="propiedad-contenido">
          <div className="propiedad-form">
            <h2>Permiso requerido</h2>
            {isPending ? (
              <p>Tu solicitud para vender está pendiente de aprobación por un administrador.</p>
            ) : (
              <>
                <p>Para publicar propiedades debes solicitar permiso de vendedor.</p>
                <button className="btn-enviar" onClick={requestSeller}>Solicitar permiso</button>
              </>
            )}
          </div>
        </main>
      </div>
    ) : (
    <div className="propiedad-container">
      <header className="propiedad-header">
        <button className="btn-volver" onClick={() => navigate('/cliente-menu')}>
          ← Volver
        </button>
        <h1>Agregar Nueva Propiedad</h1>
      </header>

      <main className="propiedad-contenido">
        <form className="propiedad-form" onSubmit={handleSubmit}>
          
          <section className="form-seccion">
            <h2>📍 Información Básica</h2>
            <div className="form-grid">
              <div className="form-grupo">
                <label htmlFor="nombre">Nombre de la Propiedad *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Ej: Apartamento Moderno Centro"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={errors.nombre ? 'error' : ''}
                />
                {errors.nombre && <span className="error-texto">{errors.nombre}</span>}
              </div>
              <div className="form-grupo">
                <label htmlFor="tipo">Tipo de Propiedad *</label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                >
                  <option>Apartamento</option>
                  <option>Casa</option>
                  <option>Local</option>
                </select>
              </div>

              <div className="form-grupo form-full">
                <label htmlFor="direccion">Dirección *</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  placeholder="Ej: Calle Principal 123, Piso 5"
                  value={formData.direccion}
                  onChange={handleChange}
                  className={errors.direccion ? 'error' : ''}
                />
                {errors.direccion && <span className="error-texto">{errors.direccion}</span>}
              </div>

              <div className="form-grupo">
                <label htmlFor="ciudad">Ciudad *</label>
                <input
                  type="text"
                  id="ciudad"
                  name="ciudad"
                  placeholder="Ej: Santiago"
                  value={formData.ciudad}
                  onChange={handleChange}
                  className={errors.ciudad ? 'error' : ''}
                />
                {errors.ciudad && <span className="error-texto">{errors.ciudad}</span>}
              </div>

              <div className="form-grupo">
                <label htmlFor="region">Región</label>
                <input
                  type="text"
                  id="region"
                  name="region"
                  placeholder="Ej: Metropolitana"
                  value={formData.region}
                  onChange={handleChange}
                />
              </div>

              <div className="form-grupo">
                <label htmlFor="codigo_postal">Código Postal</label>
                <input
                  type="text"
                  id="codigo_postal"
                  name="codigo_postal"
                  placeholder="Ej: 8340000"
                  value={formData.codigo_postal}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          <section className="form-seccion">
            <h2>🏠 Detalles de la Propiedad</h2>
            <div className="form-grid">
              <div className="form-grupo">
                <label htmlFor="precio">Precio (CLP) *</label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  placeholder="Ej: 450000000"
                  value={formData.precio}
                  onChange={handleChange}
                  className={errors.precio ? 'error' : ''}
                />
                {errors.precio && <span className="error-texto">{errors.precio}</span>}
              </div>

              <div className="form-grupo">
                <label htmlFor="habitaciones">Dormitorios *</label>
                <input
                  type="number"
                  id="habitaciones"
                  name="habitaciones"
                  min="1"
                  placeholder="Ej: 3"
                  value={formData.habitaciones}
                  onChange={handleChange}
                  className={errors.habitaciones ? 'error' : ''}
                />
                {errors.habitaciones && <span className="error-texto">{errors.habitaciones}</span>}
              </div>

              <div className="form-grupo">
                <label htmlFor="banos">Baños *</label>
                <input
                  type="number"
                  id="banos"
                  name="banos"
                  min="1"
                  placeholder="Ej: 2"
                  value={formData.banos}
                  onChange={handleChange}
                  className={errors.banos ? 'error' : ''}
                />
                {errors.banos && <span className="error-texto">{errors.banos}</span>}
              </div>

              <div className="form-grupo">
                <label htmlFor="area">Área (m²) *</label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  placeholder="Ej: 120"
                  value={formData.area}
                  onChange={handleChange}
                  className={errors.area ? 'error' : ''}
                />
                {errors.area && <span className="error-texto">{errors.area}</span>}
              </div>

              <div className="form-grupo">
                <label htmlFor="garage">Garajes</label>
                <input
                  type="number"
                  id="garage"
                  name="garage"
                  min="0"
                  placeholder="Ej: 2"
                  value={formData.garage}
                  onChange={handleChange}
                />
              </div>

              <div className="form-grupo">
                <label htmlFor="patio">¿Tiene Patio?</label>
                <select
                  id="patio"
                  name="patio"
                  value={formData.patio}
                  onChange={handleChange}
                >
                  <option value="">Selecciona...</option>
                  <option value="Si">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="form-grupo form-full">
                <label htmlFor="descripcion">Descripción de la Propiedad *</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  placeholder="Describe los detalles más relevantes de la propiedad..."
                  rows={5}
                  value={formData.descripcion}
                  onChange={handleChange}
                  className={errors.descripcion ? 'error' : ''}
                />
                {errors.descripcion && <span className="error-texto">{errors.descripcion}</span>}
              </div>

              <div className="form-grupo">
                <label htmlFor="estado">Estado de la Propiedad</label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                >
                  <option value="disponible">Disponible</option>
                  <option value="alquilada">Alquilada</option>
                  <option value="vendida">Vendida</option>
                </select>
              </div>
            </div>
          </section>

          <section className="form-seccion">
            <h2>✨ Amenidades</h2>
            <div className="amenidades-grid">
              {amenidadesOptions.map(amenidad => (
                <label key={amenidad} className="amenidad-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.amenidades.includes(amenidad)}
                    onChange={() => handleCheckboxChange(amenidad)}
                  />
                  <span>{amenidad}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="form-seccion">
            <h2>📷 Imágenes (máx. 5)</h2>
            <div className="upload-area">
              <input
                type="file"
                id="imagenes"
                name="imagenes"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                disabled={formData.imagenes.length >= 5}
              />
              <label htmlFor="imagenes" className="upload-label">
                <span className="upload-icon">📸</span>
                <span className="upload-text">
                  Haz clic o arrastra imágenes aquí
                </span>
                <span className="upload-info">
                  ({formData.imagenes.length}/5 imágenes)
                </span>
              </label>
              {errors.imagenes && <span className="error-texto">{errors.imagenes}</span>}
            </div>

            {preview.length > 0 && (
              <div className="preview-grid">
                {preview.map((src, index) => (
                  <div key={index} className="preview-item">
                    <img src={src} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="btn-eliminar-imagen"
                      onClick={() => removeImage(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="form-seccion">
            <h2>📞 Tu Información de Contacto</h2>
            <div className="form-grid">
              <div className="form-grupo form-full">
                <label htmlFor="contacto_nombre">Tu Nombre Completo *</label>
                <input
                  type="text"
                  id="contacto_nombre"
                  name="contacto_nombre"
                  placeholder="Ej: Juan García"
                  value={formData.contacto_nombre}
                  onChange={handleChange}
                  className={errors.contacto_nombre ? 'error' : ''}
                />
                {errors.contacto_nombre && <span className="error-texto">{errors.contacto_nombre}</span>}
              </div>

              <div className="form-grupo">
                <label htmlFor="contacto_telefono">Teléfono *</label>
                <input
                  type="tel"
                  id="contacto_telefono"
                  name="contacto_telefono"
                  placeholder="Ej: +56 9 8765 4321"
                  value={formData.contacto_telefono}
                  onChange={handleChange}
                  className={errors.contacto_telefono ? 'error' : ''}
                />
                {errors.contacto_telefono && <span className="error-texto">{errors.contacto_telefono}</span>}
              </div>

              <div className="form-grupo">
                <label htmlFor="contacto_email">Email *</label>
                <input
                  type="email"
                  id="contacto_email"
                  name="contacto_email"
                  placeholder="Ej: tu@email.com"
                  value={formData.contacto_email}
                  onChange={handleChange}
                  className={errors.contacto_email ? 'error' : ''}
                />
                {errors.contacto_email && <span className="error-texto">{errors.contacto_email}</span>}
              </div>
            </div>
          </section>

          <div className="form-acciones">
            <button
              type="button"
              className="btn-cancelar"
              onClick={() => navigate('/cliente-menu')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-enviar"
            >
              ✓ Agregar Propiedad
            </button>
          </div>
        </form>
      </main>
    </div>
  )
)
}