
import * as ethers from 'ethers';
import ERC20Abi from './ERC20Abi';

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
}
