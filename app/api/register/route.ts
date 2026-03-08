import { htmlTemplate } from "@/lib/constants";
import { resend } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
        return NextResponse.json({ ok: false, error: "MISSING_FIELDS" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { email: email },
    });

    if (user) {
        return NextResponse.json({ ok: false, error: "USER_EXISTS" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashed,
            verificationToken: token,
            verificationTokenExpiry: expiry,
        },
    });

    const verifyUrl = `${process.env.NEXTAUTH_URL}/verify/${token}`;

    const templateDetails = {
        title: "Verify Your Account",
        name: name,
        description: "Click the button below to verify your account. If you did not request this verification, you can safely ignore this email.",
        link: verifyUrl,
        linkText: "Click to verify your account"
    }

    const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM!,
        to: [email],
        subject: 'Verify your account',
        html: htmlTemplate(templateDetails)
    });

    if (error) {
        return NextResponse.json({ ok: false, error }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "Account created successfully. Please check your email to verify your account.", data }, { status: 200 });

}
