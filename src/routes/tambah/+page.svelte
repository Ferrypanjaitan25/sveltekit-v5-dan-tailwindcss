<script>
  import { studentsStore } from '$lib/stores/students';
  import { goto } from '$app/navigation';
  import Notification from '$lib/components/Notification.svelte';
  import { get } from 'svelte/store'; // untuk mengambil data saat ini dari store

  let nim = '', nama = '', email = '', noHp = '', prodi = '';
  let prodiOptions = [
    'Sistem Informasi', 'Teknik Informatika', 'Sarjana Terapan Rekayasa Perangkat Lunak',
    'Teknik Komputer', 'Teknik Elektro', 'Informatika', 'Teknik Bioproses',
    'Metalurgi', 'Manajemen Rekayasa'
  ];

  let errorMessage = '';
  let successMessage = '';

  function handleSubmit() {
    const nimLength = nim.trim().length;
    errorMessage = '';
    successMessage = '';

    if (!nim || !nama || !email || !noHp || !prodi) {
      errorMessage = 'Mohon lengkapi semua field!';
      return;
    }

    const noHpPattern = /^\d{11,13}$/;
    if (!noHpPattern.test(noHp)) {
      errorMessage = 'Nomor HP harus terdiri dari 11 hingga 13 angka!';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      errorMessage = 'Format email tidak valid! Contoh: nama@example.com';
      return;
    }

    const existingStudents = get(studentsStore);
    const isDuplicateNim = existingStudents.some(student => student.nim === nim);

    if (isDuplicateNim) {
      errorMessage = 'NIM sudah terdaftar. Gunakan NIM lain.';
      return;
    }

    if (nimLength < 8 || nimLength > 10) {
    alert('NIM harus terdiri dari 8 hingga 10 karakter!');
    return;
  }

    // Simpan jika lolos validasi
    studentsStore.update(data => [
      ...data,
      {
        id: Date.now(),
        nim,
        nama,
        email,
        noHp,
        prodi
      }
    ]);

    successMessage = 'Data mahasiswa berhasil ditambahkan!';
    setTimeout(() => goto('/'), 1000); // redirect setelah 1 detik
  }
</script>

<div class="p-6 max-w-xl mx-auto space-y-4">
  <h1 class="text-2xl font-bold">Tambah Mahasiswa</h1>

  {#if errorMessage}
    <Notification message={errorMessage} type="error" />
  {/if}

  {#if successMessage}
    <Notification message={successMessage} type="success" />
  {/if}

  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <input
  bind:value={nim}
  class="w-full border p-2 rounded"
  placeholder="NIM"
  minlength="8"
  maxlength="10"
  required
/>

    <input bind:value={nama} class="w-full border p-2 rounded" placeholder="Nama Lengkap" />
    <select bind:value={prodi} class="w-full border p-2 rounded">
      <option value="">Pilih Program Studi</option>
      {#each prodiOptions as option}
        <option value={option}>{option}</option>
      {/each}
    </select>
    <input bind:value={email} class="w-full border p-2 rounded" placeholder="Email" />
    <input bind:value={noHp} class="w-full border p-2 rounded" placeholder="No HP" />
    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Simpan</button>
  </form>
</div>
