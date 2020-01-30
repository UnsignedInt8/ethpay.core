
import * as ethers from 'ethers';
import ERC20Abi from './ERC20Abi';
import Metamask from './Metamask';
import Contracts from './Contracts';

export default class Payment {
    /**
     * build ERC20 transfering ABI
     * @param to receiptor address
     * @param amount wei/min usd unit
     * @returns hex ABI string
     */
    public static buildErc20TransferABI(to: string, value: string) {
        const coder = new ethers.utils.AbiCoder();
        const amount = coder.encode(['uint256'], [value]);
        const erc20 = new ethers.utils.Interface(ERC20Abi);
        const abi = erc20.functions.transfer.encode([to, amount]);
        return abi;
    }

    public static parseUnits(value: string, unit: string | number) {
        return ethers.utils.parseUnits(value, unit);
    }

    /**
     * Send ETH tx
     * @param param 
     * @returns Tx hash, or empty string if failed
     */
    public static async send({ to, value, currency, data }: { to: string, value?: number | string, data?: string, currency: 'eth' | 'usdc' | 'usdt' | 'dai' | 'sai' | 'pax' | 'tusd' | 'gusd' | 'usdx' | 'husd' | 'usdk' }) {
        if (!Metamask.hasWeb3()) {
            return '';
        }

        let [from] = await Metamask.enable();
        if (!from) return '';

        let hash: string;

        if (currency === "eth") {
            hash = await Metamask.sendTransaction({
                to,
                from,
                gas: "0x5208",
                value: ethers.utils.parseEther(`${value || 0}`).toHexString(),
                data
            });
        } else {
            const contract = Contracts[currency] as { addr: string, decimals: number };

            if (!contract) {
                return '';
            }

            hash = await Metamask.sendTransaction({
                to: contract.addr,
                from,
                gas: "0x186A0",
                value: "0x00",
                data: Payment.buildErc20TransferABI(
                    to,
                    ethers.utils
                        .parseUnits(`${value || 0}`, contract.decimals)
                        .toHexString()
                )
            });
        }

        return hash;
    }
}
