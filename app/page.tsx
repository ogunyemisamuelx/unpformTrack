import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Redirect to appropriate dashboard
  if (session.user.isAdmin) {
    redirect("/admin");
  } else {
    redirect("/profile");
  }
}
