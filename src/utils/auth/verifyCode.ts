"use server";

import { Message } from "@/types/message";
import db from "@/lib/db";

export default async function verifyCodeAction(
  formData: FormData
): Promise<Message> {
  const entries = Array.from(formData.entries());
  const data = Object.fromEntries(entries) as { code: string };

  if (!data.code) {
    return {
      success: false,
      message: "Por favor, insira o código de confirmação",
    };
  }

  // Find the reset/confirmation token
  const resetToken = await db.passwordResetToken.findUnique({
    where: { token: data.code },
  });

  if (!resetToken) {
    return { success: false, message: "Código inválido" };
  }

  // Check expiration
  if (resetToken.expires < new Date()) {
    return { success: false, message: "Código expirado" };
  }

  // Confirm the user
  await db.user.update({
    where: { id: resetToken.userId },
    data: {
      confirmed: true,
      confirmCode: null,
    },
  });

  // Invalidate/delete the token so it can't be reused
  await db.passwordResetToken.delete({
    where: { id: resetToken.id },
  });

  return {
    success: true,
    message: "E-mail confirmado com sucesso!",
  };
}
