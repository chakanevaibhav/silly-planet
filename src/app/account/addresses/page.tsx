import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AddressList } from "./AddressList";

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin?callbackUrl=/account/addresses");
  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: "desc" },
  });

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-4">
      <h1 className="text-2xl font-medium mb-3">Your Addresses</h1>
      <AddressList addresses={addresses} />
    </div>
  );
}
