/* eslint-disable */

import fetch from 'cross-fetch'
import assert from 'assert'
import { Account, RestClient, TESTNET_URL, FAUCET_URL, FaucetClient } from "./first_transaction"
import { userAgent } from './userAgent'
import { useRangeHopCallbacks } from 'state/mint/v3/hooks'

export class TokenClient {
    restClient: RestClient

    constructor(restClient: RestClient) {
        this.restClient = restClient
    }

    async submitTransactionHelper(account: string, payload: Record<string, any>) {
        const txn_request = await this.restClient.generateTransaction(account.address(), payload)
        const signed_txn = await this.restClient.signTransaction(account, txn_request)
        const res = await this.restClient.submitTransaction(signed_txn)
        await this.restClient.waitForTransaction(res["hash"])
    }

    //:!:>section_1
    /** Creates a new collection within the specified account */
    async createCollection(account: Account, name: string, description: string, uri: string) {
        const payload: { function: string; arguments: string[]; type: string; type_arguments: any[] } = {
            type: "script_function_payload",
            function: "0x1::Token::create_unlimited_collection_script",
            type_arguments: [],
            arguments: [
                Buffer.from(name).toString("hex"),
                Buffer.from(description).toString("hex"),
                Buffer.from(uri).toString("hex"),
            ]
        }
        await this.submitTransactionHelper(account, payload)
    }
    //<:!:section_1

    //:!:>section_2
    async createToken(
        account: Account,
        collection_name: string,
        name: string,
        description: string,
        supply: number,
        uri: string) {
        const payload: { function: string; arguments: any[]; type: string; type_arguments: any[] } = {
            type: "script_function_payload",
            function: "0x1::Token::create_unlimited_token_script",
            type_arguments: [],
            arguments: [
                Buffer.from(collection_name).toString("hex"),
                Buffer.from(name).toString("hex"),
                Buffer.from(description).toString("hex"),
                true,
                supply.toString(),
                Buffer.from(uri).toString("hex")
            ]
        }
        await this.submitTransactionHelper(account, payload)
    }
    //<:!:section_2

    //:!:>section_4
    async offerToken(
        account: Account,
        receiver: string,
        creator: string,
        collection_name: string,
        token_name: string,
        amount: number) {
        const payload: { function: string; arguments: string[]; type: string; type_arguments: any[] } = {
            type: "script_function_payload",
            function: "0x1::TokenTransfers::offer_script",
            type_arguments: [],
            arguments: [
                receiver,
                creator,
                Buffer.from(collection_name).toString("hex"),
                Buffer.from(token_name).toString("hex"),
                amount.toString()
            ]
        }
        await this.submitTransactionHelper(account, payload)
    }
    //<:!:section_4

    //:!:>section_5
    async claimToken(
        account: Account,
        sender: string,
        creator: string,
        collection_name: string,
        token_name: string) {
        const payload: { function: string; arguments: string[]; type: string; type_arguments: any[] } = {
            type: "script_function_payload",
            function: "0x1::TokenTransfers::claim_script",
            type_arguments: [],
            arguments: [
                sender,
                creator,
                Buffer.from(collection_name).toString("hex"),
                Buffer.from(token_name).toString("hex"),
            ]
        }
        await this.submitTransactionHelper(account, payload)
    }
    //<:!:section_5

    async cancelTokenOffer(
        account: Account,
        receiver: string,
        creator: string,
        token_creation_num: number) {
        const payload: { function: string; arguments: string[]; type: string; type_arguments: any[] } = {
            type: "script_function_payload",
            function: "0x1::TokenTransfers::cancel_offer_script",
            type_arguments: [],
            arguments: [
                receiver,
                creator,
                token_creation_num.toString()
            ]
        }
        await this.submitTransactionHelper(account, payload)
    }

    //:!:>section_3
    async tableItem(handle: string, keyType: string, valueType: string, key: any): Promise<any> {
        const response = await fetch(`${this.restClient.url}/tables/${handle}/item`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "key_type": keyType,
                "value_type": valueType,
                "key": key
            })
        })

        if (response.status == 404) {
            return null
        } else if (response.status != 200) {
            assert(response.status == 200, await response.text())
        } else {
            return await response.json()
        }
    }

    async getTokenBalance(owner: string, creator: string, collection_name: string, token_name: string): Promise<number> {
        const token_store = await this.restClient.accountResource(creator, "0x1::Token::TokenStore")

        const token_id = {
            creator: creator,
            collection: collection_name,
            name: token_name,
        }

        const token = await this.tableItem(
            token_store["data"]["tokens"]["handle"],
            "0x1::Token::TokenId",
            "0x1::Token::Token",
            token_id,
        )
        return token["value"]
    }

    async getTokenData(creator: string, collection_name: string, token_name: string): Promise<any> {
        const collections = await this.restClient.accountResource(creator, "0x1::Token::Collections")

        const token_id = {
            creator: creator,
            collection: collection_name,
            name: token_name,
        }

        return await this.tableItem(
            collections["data"]["token_data"]["handle"],
            "0x1::Token::TokenId",
            "0x1::Token::TokenData",
            token_id,
        )
    }
    //<:!:section_3
}


export async function mintPOAP() {
    const restClient = new RestClient(TESTNET_URL)
    const client = new TokenClient(restClient)
    const faucet_client = new FaucetClient(FAUCET_URL, restClient)

    const accountAddress = await (window as any).aptos.account()

    console.log(accountAddress)

    const root = new Account()

    const collection_name = "Aptos POAP"
    const token_name = "Aptos Hack #1"

    console.log("\n=== Addresses ===")
    console.log(`Root ${root.address()}. Key Seed: ${Buffer.from(root.signingKey.secretKey).toString("hex").slice(0, 64)}`)
    console.log(`User: ${accountAddress}`)

    console.log("Funding root...")

    await faucet_client.fundAccount(root.address(), 10_000_000)

    console.log("\n=== Initial Balances ===")
    console.log(`Root: ${await restClient.accountBalance(root.address())}`)
    console.log(`User: ${await restClient.accountBalance(accountAddress)}`)

    console.log("\n=== Creating Collection and Token ===")

    await client.createCollection(root, collection_name, "Aptos POAP", "https://aptos.dev")
    await client.createToken(root, collection_name, token_name, "Aptos Hackathon #1", 1, "https://aptos.dev/img/nyan.jpeg")

    let token_balance = await client.getTokenBalance(root.address(), root.address(), collection_name, token_name)
    console.log(`Root's token balance: ${token_balance}`)
    const token_data = await client.getTokenData(root.address(), collection_name, token_name)
    console.log(`Root's token data: ${JSON.stringify(token_data)}`)

    console.log("\n=== Transferring the token to User ===")
    await client.offerToken(root, accountAddress, root.address(), collection_name, token_name, 1)
    //await client.claimToken(accountAddress, root.address(), root.address(), collection_name, token_name)

    // Gets the address of the account signed into the wallet

    // Create a transaction dictionary
    const transaction = {
        type: "script_function_payload",
        function: "0x1::TokenTransfers::claim_script",
        type_arguments: [],
        arguments: [
            root.address(),
            root.address(),
            Buffer.from(collection_name).toString("hex"),
            Buffer.from(token_name).toString("hex"),
        ]
    }
    // Send transaction to the extension to be signed and submitted to chain
    const response = await (window as any).aptos.signAndSubmitTransaction(transaction)
    token_balance = await client.getTokenBalance(root.address(), root.address(), collection_name, token_name)
    console.log(`root's token balance: ${token_balance}`)
    token_balance = await client.getTokenBalance(accountAddress, root.address(), collection_name, token_name)
    console.log(`users's token balance: ${token_balance}`)
}
