"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUsers() {
    try {
        return await (prisma as any).user.findMany({
            orderBy: { createdAt: "desc" }
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export async function updateUserRole(userId: string, role: string) {
    try {
        await (prisma as any).user.update({
            where: { id: userId },
            data: { role }
        });
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Error updating user role:", error);
        return { error: "Failed to update role" };
    }
}

export async function deleteUser(userId: string) {
    try {
        await (prisma as any).user.delete({
            where: { id: userId }
        });
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Error deleting user:", error);
        return { error: "Failed to delete user" };
    }
}
