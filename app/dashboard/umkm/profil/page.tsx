import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { updateProfileUMKM } from "@/app/actions/profile"
import Link from "next/link"

export default async function EditProfilUMKM() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session_kerjaku")
  if (!sessionCookie) redirect("/login")
  const session = JSON.parse(sessionCookie.value)

  const umkm = await prisma.umkm.findUnique({
    where: { userId: session.userId }
  })

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Link href="/dashboard/umkm" className="text-blue-600 mb-4 block">&larr; Kembali</Link>
      <h1 className="text-2xl font-bold mb-6">Edit Profil Usaha</h1>

      <form action={updateProfileUMKM} className="bg-white p-6 rounded-xl shadow space-y-4">
        
        {/* Logo Preview */}
        <div className="flex items-center gap-4">
            {umkm?.logo ? (
                <img src={umkm.logo} alt="Logo" className="w-20 h-20 rounded-lg object-cover border" />
            ) : (
                <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500">No Logo</div>
            )}
            <div>
                <label className="block text-sm font-medium text-gray-700">Logo Usaha</label>
                <input name="logo" type="file" accept="image/*" className="text-sm text-gray-500 mt-1" />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Nama Usaha</label>
            <input name="nama_usaha" defaultValue={umkm?.nama_usaha} type="text" required className="w-full p-2 border rounded" />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Nama Pemilik</label>
            <input name="pemilik" defaultValue={umkm?.pemilik} type="text" required className="w-full p-2 border rounded" />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Deskripsi Singkat Usaha</label>
            <textarea name="deskripsi" defaultValue={umkm?.deskripsi || ""} rows={3} placeholder="Jelaskan usaha Anda..." className="w-full p-2 border rounded"></textarea>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
            <textarea name="alamat" defaultValue={umkm?.alamat} rows={2} required className="w-full p-2 border rounded"></textarea>
        </div>

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
            Simpan Profil UMKM
        </button>

      </form>
    </div>
  )
}