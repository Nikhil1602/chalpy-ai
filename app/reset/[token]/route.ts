import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function GET(req: Request, context: { params: Promise<{ token: string }> }) {

    const params = await context.params;
    const token = params.token;

    const user = await prisma.user.findFirst({
        where: {
            resetToken: token,
        },
    });


    if (!user) {
        return redirect("/invalid");
    }

    return redirect(`/reset/${token}/form`);

}
