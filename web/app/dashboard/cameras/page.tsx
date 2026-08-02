import { redirect } from "next/navigation";

export default function CamerasIndexPage() {
  redirect("/dashboard/cameras/all");
}
