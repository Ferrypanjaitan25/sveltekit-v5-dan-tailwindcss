<script>
  import { page } from '$app/stores';
  import { studentsStore } from '$lib/stores/students';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import Notification from '$lib/components/Notification.svelte';
  import jsPDF from 'jspdf';

  let student = null;
  let errorMessage = '';
  let successMessage = '';

  let prodiOptions = [
    'Sistem Informasi',
    'Teknik Informatika',
    'Sarjana Terapan Rekayasa Perangkat Lunak',
    'Teknik Komputer',
    'Teknik Elektro',
    'Informatika',
    'Teknik Bioproses',
    'Metalurgi',
    'Manajemen Rekayasa'
  ];

  onMount(() => {
    const id = +$page.params.id;
    studentsStore.subscribe(data => {
      student = data.find(s => s.id === id);
    });
  });

  function handleEdit() {
    errorMessage = '';
    successMessage = '';

    if (!student.nim || !student.nama || !student.email || !student.noHp || !student.prodi) {
      errorMessage = 'Mohon lengkapi semua field!';
      return;
    }

    const nimLength = student.nim.trim().length;
    if (nimLength < 8 || nimLength > 10) {
      errorMessage = 'NIM harus terdiri dari 8 hingga 10 karakter!';
      return;
    }

    const noHpPattern = /^\d{11,13}$/;
    if (!noHpPattern.test(student.noHp)) {
      errorMessage = 'Nomor HP harus terdiri dari 11 hingga 13 angka!';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(student.email)) {
      errorMessage = 'Format email tidak valid! Contoh: nama@example.com';
      return;
    }

    const confirmEdit = confirm('Simpan perubahan data ini?');
    if (confirmEdit) {
      studentsStore.update(data =>
        data.map(s => s.id === student.id ? student : s)
      );
      successMessage = 'Data berhasil diperbarui!';
      setTimeout(() => goto('/'), 1000);
    }
  }

  function downloadPDF() {
    if (!student) return;

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    const logo = new Image();
    logo.src = '/logo-del.png';

    logo.onload = () => {
      doc.addImage(logo, 'PNG', 10, 10, 30, 30);

      doc.setFontSize(16);
      doc.text('Detail Mahasiswa', 148.5, 20, null, null, 'center');

      doc.setFontSize(12);
      doc.text(`NIM        : ${student.nim}`, 20, 50);
      doc.text(`Nama       : ${student.nama}`, 20, 60);
      doc.text(`Prodi      : ${student.prodi}`, 20, 70);
      doc.text(`Email      : ${student.email}`, 20, 80);
      doc.text(`No. HP     : ${student.noHp}`, 20, 90);

      doc.save(`Detail-${student.nim}.pdf`);
    };

    logo.onerror = () => {
      alert('Gagal memuat logo. Pastikan logo-del.png ada di folder static.');
    };
  }
</script>

{#if student}
  <div class="p-6 max-w-xl mx-auto space-y-4">
    <h1 class="text-2xl font-bold text-center">Detail Mahasiswa</h1>

    {#if errorMessage}
      <Notification message={errorMessage} type="error" />
    {/if}

    {#if successMessage}
      <Notification message={successMessage} type="success" />
    {/if}

    <form on:submit|preventDefault={handleEdit} class="space-y-4">
      <input
        bind:value={student.nim}
        class="w-full border p-2 rounded"
        placeholder="NIM"
        minlength="8"
        maxlength="10"
        required
      />
      <input
        bind:value={student.nama}
        class="w-full border p-2 rounded"
        placeholder="Nama Lengkap"
        required
      />
      <select bind:value={student.prodi} class="w-full border p-2 rounded" required>
        <option value="">Pilih Program Studi</option>
        {#each prodiOptions as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
      <input
        bind:value={student.email}
        class="w-full border p-2 rounded"
        placeholder="Email"
        required
      />
      <input
        bind:value={student.noHp}
        class="w-full border p-2 rounded"
        placeholder="No HP"
        required
      />

      <div class="flex gap-4">
        <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Simpan Perubahan
        </button>
        <button type="button" on:click={downloadPDF} class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          ⬇️ Download Data
        </button>
      </div>
    </form>
  </div>
{:else}
  <p class="text-center mt-6 text-gray-500">Data mahasiswa tidak ditemukan.</p>
{/if}
