'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce'; // Opsional, tapi kita pakai native timeout aja biar ga perlu install lib baru

export default function SearchFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Fungsi saat user mengetik (Search)
  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    replace(`${pathname}?${params.toString()}`);
  }

  // Fungsi saat user memilih filter (Dropdown)
  function handleFilter(tipe: string) {
    const params = new URLSearchParams(searchParams);
    if (tipe) {
      params.set('tipe', tipe);
    } else {
      params.delete('tipe');
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border mb-8 flex flex-col md:flex-row gap-4">
      
      {/* Input Pencarian */}
      <div className="flex-1">
        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Cari Posisi</label>
        <input
          type="text"
          placeholder="Cari: Barista, Admin, Supir..."
          className="w-full border p-2 rounded-lg"
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get('q')?.toString()}
        />
      </div>

      {/* Dropdown Filter */}
      <div className="w-full md:w-1/3">
        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tipe Pekerjaan</label>
        <select
          className="w-full border p-2 rounded-lg bg-white"
          onChange={(e) => handleFilter(e.target.value)}
          defaultValue={searchParams.get('tipe')?.toString()}
        >
          <option value="">Semua Tipe</option>
          <option value="Part-time">Part-time</option>
          <option value="Freelance">Freelance</option>
          <option value="Harian">Harian / Lepas</option>
        </select>
      </div>

    </div>
  );
}