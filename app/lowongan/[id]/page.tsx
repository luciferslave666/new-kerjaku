import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { applyLamaran } from "@/app/actions/apply" // Import fungsi tadi

export default async function DetailLowonganPage({ params }: { params: Promise<{ id: string }> }) {
    // 1. Ambil ID dari URL
    const { id } = await params
    const lowonganId = parseInt(id)

    // 2. Ambil detail lowongan + Info UMKM
    const job = await prisma.lowongan.findUnique({
        where: { id: lowonganId },
        include: { umkm: true }
    })

    if (!job) return notFound() // Tampilkan 404 jika tidak ada

    // 3. Cek Status Pelamar (Apakah sudah melamar?)
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session_kerjaku")
    
    let isApplied = false
    let isLoggedIn = !!sessionCookie

    if (sessionCookie) {
        const session = JSON.parse(sessionCookie.value)
        // Cari ID Pelamar
        const pelamar = await prisma.pelamar.findUnique({ where: { userId: session.userId } })
        
        if (pelamar) {
            // Cek di tabel lamaran
            const cekLamaran = await prisma.lamaran.findFirst({
                where: { lowonganId: lowonganId, pelamarId: pelamar.id }
            })
            if (cekLamaran) isApplied = true
        }
    }

    // --- LOGIC TOMBOL APPLY (Server Action Wrapper) ---
    async function handleApply() {
        'use server'
        await applyLamaran(lowonganId)
    }

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white min-h-screen shadow-sm mt-10 rounded-xl">
            {/* Header */}
            <div className="border-b pb-6 mb-6">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                    {job.tipe_pekerjaan}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mt-4">{job.judul}</h1>
                <p className="text-xl text-gray-600 mt-1">di {job.umkm.nama_usaha}</p>
                <p className="text-gray-400 text-sm mt-1">{job.umkm.alamat}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Kolom Kiri: Deskripsi */}
                <div className="md:col-span-2 space-y-6">
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-3">Deskripsi Pekerjaan</h2>
                        <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {job.deskripsi}
                        </div>
                    </section>
                </div>

                {/* Kolom Kanan: Info Gaji & Tombol Action */}
                <div className="bg-gray-50 p-6 rounded-xl h-fit border">
                    <p className="text-gray-500 text-sm mb-1">Gaji / Upah</p>
                    <p className="text-2xl font-bold text-green-600 mb-6">
                        Rp {job.gaji?.toLocaleString('id-ID')}
                    </p>

                    {isLoggedIn ? (
                        isApplied ? (
                            <button disabled className="w-full bg-gray-400 text-white py-3 rounded-lg font-bold cursor-not-allowed">
                                ✅ Sudah Dilamar
                            </button>
                        ) : (
                            <form action={handleApply}>
                                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl">
                                    Lamar Sekarang 🚀
                                </button>
                            </form>
                        )
                    ) : (
                        <a href="/login" className="block text-center w-full bg-gray-800 text-white py-3 rounded-lg font-bold hover:bg-gray-900">
                            Login untuk Melamar
                        </a>
                    )}

                    <p className="text-xs text-gray-400 mt-4 text-center">
                        Pastikan profil Anda sudah lengkap sebelum melamar.
                    </p>
                </div>
            </div>
        </div>
    )
}