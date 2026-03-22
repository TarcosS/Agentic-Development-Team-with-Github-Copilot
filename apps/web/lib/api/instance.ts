const DEFAULT_BASE_URL = "http://localhost:8000";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? DEFAULT_BASE_URL;

export interface ApiError {
  status: number;
  message: string;
  data?: unknown;
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
}

/**
 * Parses a fetch Response into the expected type T.
 * Returns null for 204 No Content or zero-length responses.
 * Throws an ApiError for non-2xx responses.
 */
async function parseResponse<T>(response: Response): Promise<T | null> {
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  if (!response.ok) {
    let errorData: unknown;

    if (isJson) {
      try {
        errorData = await response.json();
      } catch {
        errorData = undefined;
      }
    }

    const error: ApiError = {
      status: response.status,
      message:
        (errorData as { message?: string })?.message ??
        response.statusText ??
        "Request failed",
      data: errorData,
    };

    throw error;
  }

  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return null;
  }

  if (isJson) {
    return response.json() as Promise<T>;
  }

  // For non-JSON responses (e.g. plain text), callers should type T as string.
  return response.text() as Promise<unknown> as Promise<T>;
}

class ApiInstance {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor(
    baseUrl: string = BASE_URL,
    defaultHeaders: Record<string, string> = {}
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...defaultHeaders,
    };
  }

  private buildHeaders(overrides?: HeadersInit): Headers {
    const headers = new Headers(this.defaultHeaders);

    if (overrides) {
      const overrideHeaders = new Headers(overrides);
      overrideHeaders.forEach((value, key) => {
        headers.set(key, value);
      });
    }

    return headers;
  }

  private resolveUrl(
    path: string,
    params?: Record<string, string | number | boolean | undefined | null>
  ): string {
    const base = path.startsWith("http") ? "" : this.baseUrl;
    const fullPath = `${base}${path.startsWith("/") ? path : `/${path}`}`;
    const url = new URL(fullPath);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return url.toString();
  }

  async request<T>(
    method: string,
    path: string,
    options: RequestOptions = {}
  ): Promise<T | null> {
    const { body, params, headers: headersOverride, ...rest } = options;

    const url = this.resolveUrl(path, params);
    const headers = this.buildHeaders(headersOverride);

    const init: RequestInit = {
      method,
      headers,
      ...rest,
    };

    if (body !== undefined) {
      init.body = JSON.stringify(body);
    }

    const response = await fetch(url, init);
    return parseResponse<T>(response);
  }

  get<T>(path: string, options?: RequestOptions): Promise<T | null> {
    return this.request<T>("GET", path, options);
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T | null> {
    return this.request<T>("POST", path, { ...options, body });
  }

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T | null> {
    return this.request<T>("PUT", path, { ...options, body });
  }

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T | null> {
    return this.request<T>("PATCH", path, { ...options, body });
  }

  delete<T>(path: string, options?: RequestOptions): Promise<T | null> {
    return this.request<T>("DELETE", path, options);
  }

  withHeaders(headers: Record<string, string>): ApiInstance {
    return new ApiInstance(this.baseUrl, {
      ...this.defaultHeaders,
      ...headers,
    });
  }
}

export { ApiInstance };
