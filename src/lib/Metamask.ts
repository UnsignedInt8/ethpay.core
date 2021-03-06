export default class Metamask {
  public static hasWeb3() {
    return typeof window?.['ethereum'] !== 'undefined';
  }

  public static isMetamask() {
    return window?.['ethereum']?.['isMetamask'] ?? false;
  }

  public static getProvider() {
    return window?.['ethereum'] || window?.['web3'];
  }

  public static async enable() {
    return await this.requestAccounts();
  }

  /**
   * Listening for all events specified in EIP 1193 .
   * @param event event name, like 'accountsChanged', 'chainChanged'
   * @param callback Callback
   */
  public static async on(event: string, callback: Function) {
    this.getProvider().on(event, callback)
  }

  /**
   * @returns Returns an array of accounts, currently only one account would be returned.
   */
  public static async requestAccounts() {
    try {
      // For old metamask
      const accounts = await window?.['ethereum'].enable();
      return accounts as string[];
    } catch (error) { }

    try {
      // You now have an array of accounts!
      // Currently only ever one:
      // ['0xFDEa65C8e26263F6d9A1B5de9555D2931A33b825']
      const accounts = await window?.['ethereum'].send('eth_requestAccounts');
      return accounts as string[];
    } catch (error) {
      return [];
    }
  }

  /**
   * Send transaction
   * @param params
   * @returns Returns a transaction hash if succeeded, empty string if failed.
   */
  public static async sendTransaction(params: {
    to: string;
    from: string;
    gas?: string;
    gasPrice?: string;
    value?: string;
    data?: string;
  }) {
    return new Promise<string>(resolve => {
      try {
        window?.['ethereum']?.send(
          {
            method: 'eth_sendTransaction',
            params: [params],
            from: params.from
          },
          (err: any, result: any) => {
            if (err) {
              resolve('');
              return;
            }

            resolve(result?.result ?? '');
          }
        );
      } catch (error) {
        resolve('');
      }
    });
  }

  /**
   * Get the balance of specified address
   * @param address
   * @returns Balance hex string in wei
   */
  public static async getBalance(address?: string) {
    let addr = address ?? (await this.requestAccounts()[0]);
    if (!addr) {
      return '0x00';
    }

    return new Promise<string>(resolve => {
      try {
        window?.['ethereum']?.send(
          { method: 'eth_getBalance', params: [addr, 'latest'] },
          (err: any, result: any) => {
            if (err) {
              resolve('0x00');
              return;
            }

            resolve(result?.result ?? '0x00');
          }
        );
      } catch {
        resolve('0x00');
      }
    });
  }
}
