import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { resend } from "@/lib/mail";
import { htmlTemplate } from "@/lib/constants";

export async function POST(req: Request) {

    const { email } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ ok: true, message: "If an account with that email exists, a password reset email has been sent." }, { status: 200 });

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 30); // 30 min

    await prisma.user.update({
        where: { email },
        data: {
            resetToken: token,
            resetTokenExpiry: expiry,
        },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset/${token}`;

    const templateDetails = {
        title: "Reset Your Password",
        description: "Click the button below to reset your password. If you did not request a password reset, you can safely ignore this email.",
        link: resetUrl,
        name: user.name as string,
        linkText: "Click to reset your password"
    }

    const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM!,
        to: [email],
        subject: 'Reset your password',
        html: htmlTemplate(templateDetails)
    });

    if (error) {
        return NextResponse.json({ ok: false, error }, { status: 500 });
    }

    return NextResponse.json({ ok: true, data }, { status: 200 });
}
