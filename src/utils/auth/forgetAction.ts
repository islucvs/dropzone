"use server";

import db from "@/lib/db";
import { User } from "@/types/user";
import { Message } from "@/types/message";
import crypto from "crypto";
import { ResetPassword } from "@/utils/email/ResetPassword";

async function sendEmail(user: User, token: string) {
  const confirmEmail = new ResetPassword();
  await confirmEmail.execute(user.name, user.email, token);
}

export async function forgetAction(formData: FormData): Promise<Message> {
  const entries = Array.from(formData.entries());

  const data = Object.fromEntries(entries) as {
    email: string;
  };

  if (!data.email) {
    return { success: false, message: "Informe um e-mail" };
  }

  const user = await db.user.findFirst({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    return { success: false, message: "E-mail informado não foi encontrado" };
  }

  const token: string = crypto.randomBytes(32).toString("hex");

  // Use findFirst instead of findUnique
  const existingToken = await db.passwordResetToken.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (existingToken) {
    await db.passwordResetToken.update({
      where: {
        id: existingToken.id, // Use the token's id for update
      },
      data: {
        token,
        email: user.email,
      },
    });
  } else {
    await db.passwordResetToken.create({
      data: {
        userId: user.id,   // direct FK
        email: user.email,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60), // e.g. +1h
      },
    });
  }

  await sendEmail(user, token);

  return {
    success: true,
    message: "Enviamos um link de redefinição de senha para o seu e-mail",
  };
}