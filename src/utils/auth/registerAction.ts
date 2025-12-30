"use server";

import { Message } from "@/types/message";
import db from "@/lib/db";
import { hashSync } from "bcrypt-ts";

export default async function registerAction(
  formData: FormData,
  isAdmin: boolean = false
): Promise<Message> {
  const entries = Array.from(formData.entries());

  const data = Object.fromEntries(entries) as {
    name: string;
    username: string;
    email: string;
    password: string;
  };

  if (!data.name || !data.email || !data.password) {
    return { success: false, message: "Preencha todos os campos" };
  }

  if (data.password.length < 8) {
    return {
      success: false,
      message: "A senha deve ter pelo menos 8 caracteres",
    };
  }

  const findUser = await db.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (findUser) {
    return { success: false, message: "This email is already in use!" };
  }

  const findUsername = await db.user.findUnique({
    where: {
      username: data.username,
    },
  });

  if (findUsername) {
    return { success: false, message: "This username is already in use!" };
  }

  await db.user.create({
    data: {
      username: data.username,
      email: data.email,
      name: data.name,
      password: hashSync(data.password),
    },
  });

  return {
    success: true,
    message: isAdmin
      ? "Usuário cadastrado com sucesso!"
      : "Enviamos um e-mail com o código de confirmação",
  };
}
