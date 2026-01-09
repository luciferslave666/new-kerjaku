import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Cari Kerja Part-time <br /> 
            <span className="text-blue-600">Jadi Lebih Mudah</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Platform penghubung antara Mahasiswa/Pelajar dengan UMKM lokal. 
            Temukan penghasilan tambahan atau dapatkan karyawan terbaik untuk usahamu sekarang.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/register"
              className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Mulai Mencari Kerja
            </Link>
            <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900">
              Masuk sebagai Mitra UMKM <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Solusi Kami</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Mengapa memilih KerjaKu?
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3">
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="font-bold text-gray-900">🚀 Cepat & Mudah</h3>
                <p className="mt-2 text-gray-600">Proses pelamaran tanpa ribet, langsung terhubung dengan pemilik usaha.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="font-bold text-gray-900">📍 UMKM Terverifikasi</h3>
                <p className="mt-2 text-gray-600">Lowongan berasal dari mitra UMKM yang jelas dan terpercaya.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="font-bold text-gray-900">💸 Transparan</h3>
                <p className="mt-2 text-gray-600">Informasi gaji dan deskripsi pekerjaan ditampilkan secara jelas.</p>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  );
}