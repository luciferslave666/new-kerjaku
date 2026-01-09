'use server'

import { writeFile } from "fs/promises";
import path from "path";

export async function saveFile(file: File, folderName: string = "uploads"): Promise<string | null> {
  if (!file || file.size === 0) return null;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Buat nama file unik (pake timestamp) biar gak bentrok
    const fileName = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;
    
    // Tentukan lokasi simpan (di folder public/uploads)
    const filePath = path.join(process.cwd(), "public", folderName, fileName);
    
    // Tulis file ke folder
    await writeFile(filePath, buffer);
    
    // Kembalikan URL yang bisa diakses browser
    return `/${folderName}/${fileName}`;
  } catch (error) {
    console.error("Gagal upload file:", error);
    return null;
  }
}