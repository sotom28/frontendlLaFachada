import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function PaymentsPage() {
  const { idPublicacion } = useParams<{ idPublicacion: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, token, isAuthenticated } = useAuth()
  
  const monto = searchParams.get('monto') || '0'
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  const [formData, setFormData] = useState({
    numeroTarjeta: '',
    nombreTitular: '',
    fechaExpiracion: '',
    cvv: '',
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/iniciar-sesion')
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    // Simple formatting or validation could go here
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    const payload = {
      idUsuario: user?.idUsuario,
      idPublicacion: Number(idPublicacion),
      monto: Number(monto),
      ...formData
    }

    try {
      const response = await fetch('http://localhost:3000/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: '¡Pago procesado exitosamente! Redirigiendo...' })
        setTimeout(() => navigate('/propiedades'), 3000)
      } else {
        setMessage({ type: 'error', text: data.message || 'Error al procesar el pago. Verifique sus datos.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión con la pasarela de pagos.'})
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container" style={{ padding: '2rem 1rem' }}>
      <section className="auth-card" style={{ 
        maxWidth: '520px', 
        width: '100%', 
        margin: '0 auto', 
        padding: '32px',
        boxSizing: 'border-box'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '8px' }}>Finalizar Pago</h1>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '24px' }}>
          Estás a un paso de asegurar esta propiedad
        </p>

        <div style={{ 
          backgroundColor: '#f8fafc', 
          padding: '16px', 
          borderRadius: '12px', 
          marginBottom: '24px',
          border: '1px solid #e2e8f0',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Monto a pagar:</span>
          <h2 style={{ margin: '4px 0', color: '#0f172a' }}>
            {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(Number(monto))}
          </h2>
        </div>

        {message.text && (
          <div className={`message-banner ${message.text.includes('éxito') ? 'success' : 'error'}`}>
            {message.text}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} style={{ gap: '20px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            Nombre en la Tarjeta
            <input
              type="text"
              name="nombreTitular"
              placeholder="Juan Pérez"
              required
              value={formData.nombreTitular}
              onChange={handleChange}
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            Número de Tarjeta
            <input
              type="text"
              name="numeroTarjeta"
              placeholder="0000 0000 0000 0000"
              maxLength={16}
              required
              value={formData.numeroTarjeta}
              onChange={handleChange}
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </label>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '16px', 
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              Expira (MM/YY)
              <input
                type="text"
                name="fechaExpiracion"
                placeholder="12/28"
                maxLength={5}
                required
                value={formData.fechaExpiracion}
                onChange={handleChange}
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              CVV
              <input
                type="password"
                name="cvv"
                placeholder="123"
                maxLength={4}
                required
                value={formData.cvv}
                onChange={handleChange}
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </label>
          </div>

          <button 
            type="submit" 
            className="button button-primary btn-full"
            disabled={loading}
            style={{ height: '52px', fontSize: '1.1rem', marginTop: '12px', width: '100%' }}
          >
            {loading ? 'Procesando Pago...' : 'Confirmar Pago Seguro'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            🔒 Tus pagos están protegidos con encriptación de grado bancario.
          </p>
        </div>
      </section>
    </main>
  )
}
