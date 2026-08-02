import { handleStorageUploadPost } from "@/lib/storage-upload-handler";

export const maxDuration = 300;
export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleStorageUploadPost(request, "incidents");
}
