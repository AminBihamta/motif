"use server";

import { auth, signOut } from "@/auth";
import { deleteUserAccountData } from "../lib/delete-user-account";

export async function deleteAccountAction() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("You must be signed in to delete your account.");
  }

  await deleteUserAccountData(userId, session.user?.email);
  await signOut({ redirectTo: "/signin" });
}
