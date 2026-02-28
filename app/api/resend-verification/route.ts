import { htmlTemplate } from "@/lib/constants";
import { resend } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ ok: false, error: "MISSING_EMAIL" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    // Always return same response (security best practice)
    if (!user || user.emailVerified) {
        return NextResponse.json({ ok: true, message: "If an account with that email exists and is not verified, a new verification email has been sent." }, { status: 200 });
    }

    // Generate new token
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.user.update({
        where: { email },
        data: {
            verificationToken: token,
            verificationTokenExpiry: expiry,
        },
    });

    const verifyUrl = `${process.env.NEXTAUTH_URL}/verify/${token}`;

    const templateDetails = {
        title: "Verify Your Account",
        description: "Click the button below to verify your account. If you did not request this verification, you can safely ignore this email.",
        link: verifyUrl,
        name: user.name as string,
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

    return NextResponse.json({ ok: true, message: "Verification email sent successfully", data }, { status: 200 });
}
