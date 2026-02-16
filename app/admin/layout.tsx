// app/admin/sidebar.tsx

import { db } from "@/lib/db";
import SidebarLayout from "@/app/admin/sidebar";

export default async function AdminServerLayout({ children }: { children: React.ReactNode }) {
  const pendingCount = await db.enquiry.count({
    where: { status: "PENDING" }
  });

  const recentEnquiries = await db.enquiry.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
    include: { business: { select: { name: true } } }
  });

  const admin = await db.user.findFirst({
    where: { role: "ADMIN" }
  });

  const dynamicData = {
    pendingCount,
    adminName: admin?.name || "Super Admin",
    adminEmail: admin?.email || "admin@justdial.com",
    notifications: recentEnquiries.map(enq => ({
      title: `New Enquiry for ${enq.business.name}`,
      time: enq.createdAt,
      userName: enq.name
    }))
  };

  return (
    <SidebarLayout data={dynamicData}>
      {children}
    </SidebarLayout>
  );
}