import { redirect } from "next/navigation";

export default function CamerasIncidentsRedirectPage() {
  redirect("/dashboard/cameras/engagement?tab=incidents");
}
