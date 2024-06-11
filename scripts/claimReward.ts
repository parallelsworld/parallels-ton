import {compile, NetworkProvider} from '@ton/blueprint';
import {addressToString, promptUserFriendlyAddress, promptInt} from "../wrappers/ui-utils";
import {checkJettonMinter} from "./JettonMinterChecker";

export async function run(provider: NetworkProvider) {
    const isTestnet = provider.network() !== 'mainnet';

    const ui = provider.ui();

    const jettonMinterCode = await compile('JettonMinter');

    const jettonMinterAddress = await promptUserFriendlyAddress("Enter the address of the jetton minter", ui, isTestnet);

    try {
        const {
            jettonMinterContract,
            adminAddress,
        } = await checkJettonMinter(jettonMinterAddress, jettonMinterCode, null, provider, ui, isTestnet, true);

        if (!provider.sender().address!.equals(adminAddress)) {
            ui.write('You are not admin of this jetton minter');
            return;
        }

        const rewardId = await promptInt("Enter reward ID to claim", ui);

        await jettonMinterContract.claimReward(provider.sender(), rewardId);

        ui.write('Transaction sent');

    } catch (e: any) {
        ui.write(e.message);
        return;
    }
}
