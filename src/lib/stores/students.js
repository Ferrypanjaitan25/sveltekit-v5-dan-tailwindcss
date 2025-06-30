import { writable } from 'svelte/store';

export const studentsStore = writable([
  {
    id: 1,
    nim: '12345001',
    nama: 'Andi Saputra',
    prodi: 'Sistem Informasi',
    email: 'andi@example.com',
    noHp: '081234567890'
  },
  {
    id: 2,
    nim: '12345002',
    nama: 'Rina Oktaviani',
    prodi: 'Teknik Informatika',
    email: 'rina@example.com',
    noHp: '082112345678'
  }
]);
