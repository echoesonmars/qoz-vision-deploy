import { redirect } from "next/navigation";

export default function CamerasDevicesRedirectPage() {
  redirect("/dashboard/cameras/all");
}
