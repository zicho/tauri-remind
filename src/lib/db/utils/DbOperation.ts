export type DbOperation<T> = {
  result: T | null;
  success: boolean;
  message?: string;
};

export function successfulOperation<T>({ data }: { data: T }): DbOperation<T> {
  return {
    result: data,
    success: true,
  };
}

export function failedOperation<T>({
  message = "Database operation failed",
  error,
}: {
  message?: string;
  error?: unknown;
} = {}): DbOperation<T> {
  const errorMessage =
    error && typeof error === "object" && "message" in error
      ? (error as { message: string }).message
      : "Unknown error";

  return {
    result: null,
    success: false,
    message: errorMessage || message,
  };
}
