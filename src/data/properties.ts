export type Property = {
  id: number
  title: string
  location: string
  price: string
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
    price: '$850,000',
    beds: 4,
    baths: 3,
    area: 320,
    tone: 'tone-a',
  },
  {
    id: 2,
    title: 'Apartamento Contemporaneo',
    location: 'Zona Residencial',
    price: '$425,000',
    beds: 2,
    baths: 2,
    area: 145,
    tone: 'tone-b',
  },
  {
    id: 3,
    title: 'Penthouse Elegante',
    location: 'Centro Premium',
    price: '$1,200,000',
    beds: 3,
    baths: 3,
    area: 280,
    tone: 'tone-c',
  },
  {
    id: 4,
    title: 'Casa Familiar Espaciosa',
    location: 'Barrio Verde',
    price: '$675,000',
    beds: 4,
    baths: 3,
    area: 310,
    tone: 'tone-d',
  },
  {
    id: 5,
    title: 'Condominio Premium',
    location: 'Zona Exclusiva',
    price: '$950,000',
    beds: 3,
    baths: 2,
    area: 210,
    tone: 'tone-e',
  },
  {
    id: 6,
    title: 'Villa con Vista al Mar',
    location: 'Costa Azul',
    price: '$1,500,000',
    beds: 5,
    baths: 4,
    area: 420,
    tone: 'tone-f',
  },
]
