import axios, { AxiosProgressEvent, isAxiosError } from "axios"
import { User } from "./user"

const BASE_API_URL = import.meta.env.BASE_API_URL

export const ACCESS_TOKEN_STORAGE_KEY = "accessToken"

export interface RequestOptions {
  method: string
  url: string
  query?: Record<string, string>
  body?: object
  headers?: Record<string, string>
}

export interface RequestFileOptions extends RequestOptions {
  file: File
  progress_function?: (progressEvent: AxiosProgressEvent) => void
}

export interface Response {
  ok: boolean
  status: number
  body?: object
}

export interface RefreshResponse {
  access_token: string
  refresh_token: string
}

export type OnErrorFunction = () => void

export default class PiktidApiClient {
  private base_url: string
  private onError: OnErrorFunction
  private onErrorUnauthorized: OnErrorFunction

  constructor(onError: OnErrorFunction, onErrorUnauthorized: OnErrorFunction) {
    this.onError = onError
    this.onErrorUnauthorized = onErrorUnauthorized
    this.base_url = BASE_API_URL + "/api"
  }

  private delay = async (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private removeUserData(): void {
    localStorage.removeItem("current_user")
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
  }

  private async requestInternal(options: RequestOptions): Promise<Response> {
    let query = new URLSearchParams(options.query || {}).toString()
    if (query !== "") {
      query = "?" + query
    }

    let response
    try {
      response = await axios(this.base_url + options.url + query, {
        method: options.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY),
          ...options.headers,
        },
        withCredentials: options.url === "/tokens",
        data: options.body ? JSON.stringify(options.body) : null,
      })
    } catch (error: unknown) {
      console.error(error)
      if (isAxiosError(error)) {
        response = {
          ok: false,
          status: error.response?.status || 500,
          data: error.response?.data || "Unexpected error",
        }
      } else {
        response = {
          ok: false,
          status: 500,
          data: "Unexpected error",
        }
      }
    }

    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      body: response.data,
    }
  }

  async request(options: RequestOptions): Promise<Response> {
    const response = await this.requestInternal(options)

    if (response.status === 401 && options.url !== "/tokens") {
      const refreshResponse = await this.put("/tokens", {
        access_token: localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY),
      })
      const body = refreshResponse.body as RefreshResponse

      if (refreshResponse.ok) {
        localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, body.access_token)
        return await this.requestInternal(options)
      } else {
        this.removeUserData()
        this.onErrorUnauthorized()
      }
    }

    return response
  }

  async get(url: string, query?: Record<string, string>, options: Partial<RequestOptions> = {}): Promise<Response> {
    return this.request({ method: "GET", url, query, ...options })
  }

  async post(url: string, body: object | undefined, options: Partial<RequestOptions> = {}): Promise<Response> {
    return this.request({ method: "POST", url, body, ...options })
  }

  async put(url: string, body: object | undefined, options: Partial<RequestOptions> = {}): Promise<Response> {
    return this.request({ method: "PUT", url, body, ...options })
  }

  async delete(url: string, options: Partial<RequestOptions> = {}): Promise<Response> {
    return this.request({ method: "DELETE", url, ...options })
  }

  async getUser(accessToken: string) {
    const response = await this.get("/me", undefined, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })

    if (!response.ok) {
      this.removeUserData()
      this.onErrorUnauthorized()
      return null
    }

    return response.body as User
  }

  async login(username: string, password: string): Promise<User | null> {
    const response = await this.post("/tokens", undefined, {
      headers: {
        Authorization: "Basic " + window.btoa(username + ":" + password),
      },
    })

    const body = response.body as RefreshResponse

    if (!response.ok) {
      this.removeUserData()
      this.onErrorUnauthorized()
      // await this.delay(2000)
      throw new Error("asdasd")
    }

    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, body.access_token)
    return await this.getUser(body.access_token)
  }

  async logout(): Promise<boolean> {
    const response = await this.delete("/tokens")
    return response.ok
  }

  async checkToken() {
    const refreshResponse = await this.put("/tokens", {
      access_token: localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY),
    })
    if (refreshResponse.ok) {
      const body = refreshResponse.body as RefreshResponse
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, body.access_token)
      return true
    } else {
      this.removeUserData()
      return false
    }
  }
}
