import { useEffect, useState } from 'react'
import './menuadmin.css'

interface UserItem {
  id: string
  nombre: string
  apellido: string
  email: string
  role: string
  sellerApproved?: boolean
  pendingSeller?: boolean
}

export function MenuAdmin() {
  const [users, setUsers] = useState<UserItem[]>([])

  useEffect(() => {
    const raw = localStorage.getItem('users')
    const list = raw ? JSON.parse(raw) : []
    setUsers(list)
  }, [])

  const refresh = () => {
    const raw = localStorage.getItem('users')
    const list = raw ? JSON.parse(raw) : []
    setUsers(list)
  }

  const approveSeller = (email: string) => {
    const raw = localStorage.getItem('users')
    const list = raw ? JSON.parse(raw) : []
    const idx = list.findIndex((u: any) => u.email === email)
    if (idx !== -1) {
      list[idx].role = 'seller'
      list[idx].sellerApproved = true
      list[idx].pendingSeller = false
      localStorage.setItem('users', JSON.stringify(list))
      refresh()
    }
  }

  const rejectSeller = (email: string) => {
    const raw = localStorage.getItem('users')
    const list = raw ? JSON.parse(raw) : []
    const idx = list.findIndex((u: any) => u.email === email)
    if (idx !== -1) {
      list[idx].pendingSeller = false
      localStorage.setItem('users', JSON.stringify(list))
      refresh()
    }
  }

  const revokeSeller = (email: string) => {
    const raw = localStorage.getItem('users')
    const list = raw ? JSON.parse(raw) : []
    const idx = list.findIndex((u: any) => u.email === email)
    if (idx !== -1) {
      list[idx].role = 'user'
      list[idx].sellerApproved = false
      localStorage.setItem('users', JSON.stringify(list))
      refresh()
    }
  }

  return (
    <main className="admin-shell">
      <section className="admin-hero">
        <h1>Panel Admin - Usuarios</h1>
        <p>Aprueba o rechaza solicitudes de permiso para vender.</p>
      </section>

      <section className="admin-grid">
        <article className="admin-card">
          <h2>Solicitudes Pendientes</h2>
          {users.filter(u => u.pendingSeller).length === 0 && <p>No hay solicitudes pendientes.</p>}
          <ul>
            {users.filter(u => u.pendingSeller).map(u => (
              <li key={u.email} className="admin-user-item">
                <div>
                  <strong>{u.nombre} {u.apellido}</strong>
                  <div>{u.email}</div>
                </div>
                <div className="admin-actions">
                  <button onClick={() => approveSeller(u.email)} className="btn-approve">Aprobar</button>
                  <button onClick={() => rejectSeller(u.email)} className="btn-reject">Rechazar</button>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="admin-card">
          <h2>Vendedores Aprobados</h2>
          {users.filter(u => u.role === 'seller' || u.sellerApproved).length === 0 && <p>No hay vendedores aprobados.</p>}
          <ul>
            {users.filter(u => u.role === 'seller' || u.sellerApproved).map(u => (
              <li key={u.email} className="admin-user-item">
                <div>
                  <strong>{u.nombre} {u.apellido}</strong>
                  <div>{u.email}</div>
                </div>
                <div className="admin-actions">
                  <button onClick={() => revokeSeller(u.email)} className="btn-reject">Revocar</button>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  )
}
