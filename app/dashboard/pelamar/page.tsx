import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import SearchFilter from "@/app/components/SearchFilter" // Import Komponen Baru

// Tambahkan prop searchParams
export default async function DashboardPelamar({
    searchParams,
}: {
    searchParams?: Promise<{ q?: string; tipe?: string }>;
}) {
    // 1. Cek Login & Session
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session_kerjaku")
    if(!sessionCookie) redirect("/login")
    const session = JSON.parse(sessionCookie.value)

    // 2. Ambil Parameter Pencarian dari URL
    const params = await searchParams; // Await params (Next.js 15)
    const query = params?.q || "";
    const filterTipe = params?.tipe || "";

    // 3. Query Lowongan dengan FILTER
    const lowonganList = await prisma.lowongan.findMany({
        where: { 
            status: 'OPEN',
            // Filter Judul (Case Insensitive di MySQL default)
            judul: {
                contains: query 
            },
            // Filter Tipe (Jika ada yang dipilih)
            tipe_pekerjaan: filterTipe ? { equals: filterTipe } : undefined
        },
        include: { umkm: true },
        orderBy: { created_at: 'desc' }
    })

    // 4. Ambil Riwayat Lamaran (Tetap sama seperti sebelumnya)
    const riwayatLamaran = await prisma.lamaran.findMany({
        where: { pelamar: { userId: session.userId } },
        include: { lowongan: { include: { umkm: true } } },
        orderBy: { tanggal_lamar: 'desc' }
    })

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Lowongan Tersedia</h1>
                    <p className="text-gray-500">Temukan pekerjaan yang cocok untukmu.</p>
                </div>
            </div>

            {/* --- KOMPONEN PENCARIAN & FILTER --- */}
            <SearchFilter />

            {/* Grid Lowongan */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {lowonganList.length > 0 ? (
                    lowonganList.map((job) => (
                        <div key={job.id} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border border-gray-100 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-bold uppercase">
                                        {job.tipe_pekerjaan}
                                    </span>
                                    <span className="text-sm text-gray-400">{new Date(job.created_at).toLocaleDateString()}</span>
                                </div>
                                
                                <h3 className="font-bold text-xl text-gray-800 mb-1">{job.judul}</h3>
                                <p className="text-gray-600 text-sm mb-4 font-medium">{job.umkm.nama_usaha}</p>
                                
                                <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                                    {job.deskripsi}
                                </p>
                            </div>

                            <div>
                                <p className="font-bold text-green-600 text-lg mb-4">
                                    Rp {job.gaji?.toLocaleString('id-ID')}
                                </p>
                                <Link 
                                    href={`/lowongan/${job.id}`} 
                                    className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Lihat Detail
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 text-center py-20 bg-white rounded-xl border border-dashed">
                        <p className="text-gray-500 text-lg">🔍 Tidak ditemukan lowongan dengan kata kunci tersebut.</p>
                        <a href="/dashboard/pelamar" className="text-blue-600 hover:underline mt-2 inline-block">Reset Pencarian</a>
                    </div>
                )}
            </div>

            {/* Riwayat Lamaran */}
            <div className="border-t pt-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Riwayat Lamaran Saya</h2>
                <div className="bg-white rounded-xl shadow border overflow-hidden">
                    {riwayatLamaran.length === 0 ? (
                        <p className="p-8 text-center text-gray-500">Anda belum melamar pekerjaan apapun.</p>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {riwayatLamaran.map((item) => (
                                <div key={item.id} className="p-6 flex flex-col md:flex-row justify-between items-center hover:bg-gray-50 transition">
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-800">{item.lowongan.judul}</h4>
                                        <p className="text-gray-600 text-sm">{item.lowongan.umkm.nama_usaha}</p>
                                    </div>
                                    <span className={`px-4 py-2 rounded-full text-sm font-bold border
                                        ${item.status === 'ACCEPTED' ? 'bg-green-100 text-green-700 border-green-200' : 
                                          item.status === 'REJECTED' ? 'bg-red-100 text-red-700 border-red-200' : 
                                          'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                                        {item.status === 'ACCEPTED' ? '🎉 Diterima' : item.status === 'REJECTED' ? '❌ Ditolak' : '⏳ Menunggu'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}