import { addToast } from "@heroui/react";

import { queryClient } from "./react-query";

import { getAddressList, getUserInfo } from "@/services";
import { useBillingAddressStore, useUserStore } from "@/store";
import { useWalletStore } from "@/store";
import { getWalletInfo } from "@/services/wallet";

export async function handleAuthSuccess(
  redirect: string,
  resMessage?: string,
  router?: ReturnType<typeof import("next/navigation").useRouter>,
) {
  const [user, wallet, billing] = await Promise.all([
    getUserInfo(),
    getWalletInfo(),
    getAddressList(2).then((res) => res[0] || {}),
  ]);

  useUserStore.getState().setUser(user);
  useWalletStore.getState().setWallet(wallet);
  useBillingAddressStore.getState().setBillingAddress(billing);
  queryClient.setQueryData(["userInfo"], user);
  queryClient.setQueryData(["walletInfo"], wallet);
  queryClient.setQueryData(["billingAddress"], billing);

  window.location.reload();
  if (resMessage) {
    addToast({ title: resMessage, timeout: 1000, color: "success" });
  }

  router?.push(redirect);
}
