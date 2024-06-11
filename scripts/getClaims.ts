import {compile, NetworkProvider} from '@ton/blueprint';
import {promptUserFriendlyAddress, promptInt} from "../wrappers/ui-utils";
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

        const resourceId = await promptInt("Enter resource ID to get claims for", ui);

        const claims = await jettonMinterContract.getClaims(provider.sender().address!, resourceId);
        ui.write(`Claims for resource ID ${resourceId}: ${JSON.stringify(claims)}`);

    } catch (e: any) {
        ui.write(e.message);
        return;
    }
}
