import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { updateStatusLamaran } from "@/app/actions/apply"
import Link from "next/link"

export default async function DetailPelamarPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const lowonganId = parseInt(id)

    // 1. Ambil Data Lowongan + Daftar Pelamar
    const lowongan = await prisma.lowongan.findUnique({
        where: { id: lowonganId },
        include: {
            lamaran: {
                include: { pelamar: true }, // Join ke tabel Pelamar agar nama muncul
                orderBy: { tanggal_lamar: 'desc' }
            }
        }
    })

    if (!lowongan) return notFound()

    return (
        <div className="p-8 max-w-5xl mx-auto">
             <div className="mb-6">
                <Link href="/dashboard/umkm" className="text-blue-600 hover:underline text-sm">&larr; Kembali ke Dashboard</Link>
                <h1 className="text-2xl font-bold text-gray-800 mt-2">Pelamar: {lowongan.judul}</h1>
                <p className="text-gray-500">Total Pelamar: {lowongan.lamaran.length} orang</p>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden border">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pelamar</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Melamar</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {lowongan.lamaran.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                    Belum ada pelamar yang masuk.
                                </td>
                            </tr>
                        ) : (
                            lowongan.lamaran.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{item.pelamar.nama_lengkap}</div>
                                        <div className="text-sm text-gray-500">{item.pelamar.pendidikan_akhir || "Pendidikan -"}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(item.tanggal_lamar).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${item.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 
                                              item.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                                              'bg-yellow-100 text-yellow-800'}`}>
                                            {item.status === 'APPLIED' ? 'Menunggu' : 
                                             item.status === 'ACCEPTED' ? 'Diterima' : 'Ditolak'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {item.status === 'APPLIED' && (
                                            <div className="flex justify-end gap-2">
                                                {/* Tombol Terima */}
                                                <form action={async () => {
                                                    'use server'
                                                    await updateStatusLamaran(item.id, "ACCEPTED")
                                                }}>
                                                    <button className="text-green-600 hover:text-green-900 border border-green-600 px-3 py-1 rounded hover:bg-green-50 transition">
                                                        Terima
                                                    </button>
                                                </form>

                                                {/* Tombol Tolak */}
                                                <form action={async () => {
                                                    'use server'
                                                    await updateStatusLamaran(item.id, "REJECTED")
                                                }}>
                                                    <button className="text-red-600 hover:text-red-900 border border-red-600 px-3 py-1 rounded hover:bg-red-50 transition">
                                                        Tolak
                                                    </button>
                                                </form>
                                            </div>
                                        )}
                                        {item.status !== 'APPLIED' && (
                                            <span className="text-gray-400">Selesai</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}