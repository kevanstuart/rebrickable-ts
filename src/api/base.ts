export class BaseApi {
  public fetchOptions: RequestInit
  public time = 2000

  constructor (token: string) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `key ${token}`
    })

    this.fetchOptions = {
      headers,
      credentials: 'omit',
      method: 'GET'
    }
  }

  public setTimeOut (time: number): void {
    this.time = time
  }

  public async fetchApi<T> (url: string, method?: string): Promise<T> {
    const signal = AbortSignal.timeout(this.time)
    this.fetchOptions.signal = signal

    if (method !== undefined) this.fetchOptions.method = method

    try {
      const response = await fetch(url, this.fetchOptions)
      if (!response.ok) return await Promise.reject(response)
      return await response.json() as T
    } catch (e: unknown) {
      return await Promise.reject(e)
    }
  }
}
