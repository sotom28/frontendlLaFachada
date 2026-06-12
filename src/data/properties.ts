export type Property = {
  id: number
  title: string
  location: string
  beds: number
  baths: number
  area: number
  tone: string
}

export const properties: Property[] = [
  {
    id: 1,
    title: 'Villa Moderna de Lujo',
    location: 'Ciudad Central',
    beds: 4,
    baths: 3,
    area: 320,
    tone: 'tone-a',
  },
  {
    id: 2,
    title: 'Apartamento Contemporaneo',
    location: 'Zona Residencial',
    beds: 2,
    baths: 2,
    area: 145,
    tone: 'tone-b',
  },
  {
    id: 3,
    title: 'Penthouse Elegante',
    location: 'Centro Premium',
    beds: 3,
    baths: 3,
    area: 280,
    tone: 'tone-c',
  },
  {
    id: 4,
    title: 'Casa Familiar Espaciosa',
    location: 'Barrio Verde',
    beds: 4,
    baths: 3,
    area: 310,
    tone: 'tone-d',
  },
  {
    id: 5,
    title: 'Condominio Premium',
    location: 'Zona Exclusiva',
    beds: 3,
    baths: 2,
    area: 210,
    tone: 'tone-e',
  },
  {
    id: 6,
    title: 'Villa con Vista al Mar',
    location: 'Costa Azul',
    beds: 5,
    baths: 4,
    area: 420,
    tone: 'tone-f',
  },
]
