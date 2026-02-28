import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {

    const { token, password } = await req.json();

    const user = await prisma.user.findFirst({
        where: {
            resetToken: token,
            resetTokenExpiry: { gt: new Date() },
        },
    });

    if (!user) return Response.json({ error: "Invalid token" });

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashed,
            resetToken: null,
            resetTokenExpiry: null,
        },
    });

    return Response.json({ ok: true });
}
