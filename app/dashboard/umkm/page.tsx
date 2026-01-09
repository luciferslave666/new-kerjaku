import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function DashboardUMKM() {
    // 1. Cek Login
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session_kerjaku")
    if(!sessionCookie) redirect("/login")
    
    const session = JSON.parse(sessionCookie.value)

    // 2. Ambil data UMKM & Lowongannya dari Database
    const umkmData = await prisma.umkm.findUnique({
        where: { userId: session.userId },
        include: { 
            lowongan: {
                orderBy: { created_at: 'desc' } // Urutkan dari yang terbaru
            } 
        }
    })

    if (!umkmData) return <div>Error: Data UMKM tidak ditemukan</div>

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* Header Dashboard */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard UMKM</h1>
                    <p className="text-gray-500">Halo, {umkmData.nama_usaha} ({umkmData.pemilik})</p>
                </div>
                <Link 
                    href="/dashboard/umkm/buat-lowongan" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow"
                >
                    + Pasang Lowongan Baru
                </Link>
            </div>

            {/* Statistik Singkat */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm">Total Lowongan</h3>
                    <p className="text-2xl font-bold text-gray-800">{umkmData.lowongan.length}</p>
                </div>
                {/* Nanti bisa ditambah statistik pelamar disini */}
            </div>

            {/* Daftar Lowongan */}
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Lowongan Aktif Anda</h2>
            
            {umkmData.lowongan.length === 0 ? (
                <div className="bg-white p-8 text-center rounded-xl shadow">
                    <p className="text-gray-500">Belum ada lowongan yang dipasang.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {umkmData.lowongan.map((job) => (
                        <div key={job.id} className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{job.judul}</h3>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                        {job.tipe_pekerjaan}
                                    </span>
                                </div>
                                <span className="text-sm font-semibold text-gray-600">
                                    Rp {job.gaji?.toLocaleString('id-ID')}
                                </span>
                            </div>
                            <p className="text-gray-600 mt-2 text-sm line-clamp-2">{job.deskripsi}</p>
                            <div className="mt-4 pt-4 border-t flex justify-between text-sm">
                                <span className="text-gray-400">Diposting: {new Date(job.created_at).toLocaleDateString()}</span>
                                <Link 
        href={`/dashboard/umkm/lowongan/${job.id}`}
        className="text-blue-600 font-medium hover:underline bg-blue-50 px-3 py-1 rounded"
    >
        Lihat Pelamar &rarr;
    </Link> 
                                {/* Nanti angka 0 diganti jumlah real */}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}