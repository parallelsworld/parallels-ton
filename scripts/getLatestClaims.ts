import {compile, NetworkProvider} from '@ton/blueprint';
import {promptUserFriendlyAddress} from "../wrappers/ui-utils";
import {checkJettonMinter} from "./JettonMinterChecker";

export async function run(provider: NetworkProvider) {
    const isTestnet = provider.network() !== 'mainnet';

    const ui = provider.ui();

    const jettonMinterCode = await compile('JettonMinter');

    const jettonMinterAddress = await promptUserFriendlyAddress("Enter the address of the jetton minter", ui, isTestnet);

    try {
        const {
            jettonMinterContract,
        } = await checkJettonMinter(jettonMinterAddress, jettonMinterCode, null, provider, ui, isTestnet, false);

        const claims = await jettonMinterContract.getLatestClaims(provider.sender().address!);
        ui.write(`Latest claims: ${JSON.stringify(claims)}`);

    } catch (e: any) {
        ui.write(e.message);
        return;
    }
}
