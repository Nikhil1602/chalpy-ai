import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function GET(req: Request, context: { params: Promise<{ token: string }> }) {

    const params = await context.params;
    const token = params.token;

    const user = await prisma.user.findFirst({
        where: {
            verificationToken: token,
            verificationTokenExpiry: { gt: new Date() },
        },
    });

    if (!user) return redirect("/invalid");

    await prisma.user.update({
        where: { id: user.id },
        data: {
            emailVerified: new Date(),
            verificationToken: null,
            verificationTokenExpiry: null,
        },
    });

    return redirect("/auth?verified=true");
}
