const products: { title: string; category: string }[] = []

export const searchProducts = (query: string) =>
  products.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()),
  )
