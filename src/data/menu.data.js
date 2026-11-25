const menu = [
  { id: 1, nama: 'Nasi Goreng Kambing', harga: 18000, kategori: 'makanan', tersedia: true },
  { id: 2, nama: 'Es Teh Manis', harga: 5000, kategori: 'minuman', tersedia: true },
  { id: 3, nama: 'Keripik Pisang', harga: 8000, kategori: 'camilan', tersedia: false },
  { id: 4, nama: 'Soto Ayam Lamongan', harga: 15000, kategori: 'makanan', tersedia: true },
  { id: 5, nama: 'Kopi Susu Gula Aren', harga: 12000, kategori: 'minuman', tersedia: true }
];

export const menuDb = {
  async findAll(filterKategori) {
    if (!filterKategori) return [...menu];
    return menu.filter((item) => item.kategori === filterKategori);
  },

  async findById(id) {
    return menu.find((item) => item.id === id) ?? null;
  },

  async findByNama(nama) {
    return menu.find((item) => item.nama.toLowerCase() === nama.toLowerCase()) ?? null;
  },

  async create(baru) {
    const data = { id: menu.length ? Math.max(...menu.map((item) => item.id)) + 1 : 1, ...baru };
    menu.push(data);
    return data;
  },

  async update(id, perubahan) {
    const item = menu.find((data) => data.id === id);
    if (!item) return null;
    Object.assign(item, perubahan);
    return item;
  },

  async remove(id) {
    const index = menu.findIndex((item) => item.id === id);
    if (index === -1) return null;
    return menu.splice(index, 1)[0];
  }
};

export default menuDb;
