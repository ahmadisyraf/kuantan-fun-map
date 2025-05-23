"use client";

import React from "react";
import { toast } from "sonner";

type ToastStatus = "loading" | "success" | "error";

interface ToastProps {
  id: string | number;
  title: string;
  description?: string;
  status: ToastStatus;
  button?: {
    label: string;
    onClick: () => void;
  };
}

function Toast({ title, status }: ToastProps) {
  const getBgColor = () => {
    if (status === "loading") return "bg-white";
    if (status === "success") return "bg-green-200";
    return "bg-red-200";
  };

  return (
    <div
      className={`w-full border-2 border-black p-4 rounded-lg shadow-[0_6px_0_rgba(0,0,0,1)] ${getBgColor()}`}
    >
      <span className="text-sm font-semibold flex flex-row items-center gap-3">
        {title}
      </span>
    </div>
  );
}

export function customToast(props: Omit<ToastProps, "id">) {
  return toast.custom((id) => <Toast {...props} id={id} />);
}

export async function toastPromise<T>(
  promiseFn: () => Promise<T>,
  {
    loading,
    success,
    error,
  }: {
    loading: string;
    success: (data: T) => string;
    error: string | ((err: unknown) => string);
  }
): Promise<T | undefined> {
  const id = customToast({
    title: loading,
    status: "loading",
  });

  try {
    const res = await promiseFn();
    toast.dismiss(id);

    customToast({
      title: success(res),
      status: "success",
      button: {
        label: "Close",
        onClick: () => toast.dismiss(),
      },
    });

    return res;
  } catch (err) {
    toast.dismiss(id);

    customToast({
      title: typeof error === "function" ? error(err) : error,
      status: "error",
      button: {
        label: "Close",
        onClick: () => toast.dismiss(),
      },
    });

    return undefined;
  }
}
