import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"

export async function POST(req: Request) {

    const { email, password, name } = await req.json();

    if (!email || !password)
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const exists = await prisma.user.findUnique({ where: { email } });

    if (exists)
        return NextResponse.json({ error: "User already exists" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: { email, name, password: hashed },
    });

    return NextResponse.json({ success: true });
}
