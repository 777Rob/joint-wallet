import express from 'express';
import { utils } from '@vite/vitejs';
import { graphqlHTTP } from 'express-graphql';
import { WS_RPC } from '@vite/vitejs-ws';
import { BigNumber } from 'bignumber.js';
import { accountBlock, account } from '@vite/vitejs';
import schema from './schema';
import { ContractEvent, JointAccount, Account } from './generated/schematypes';
import * as abi from '@vite/vitejs-abi';
import { ViteAPI } from '@vite/vitejs';
import { JointAccountContract } from '../frontend/src/contracts/JointAccounts';
import _ from 'lodash';
var app = express();

const network = 'testnet';

const providerWsURLs = {
	localnet: 'wss://localhost:23457',
	testnet: 'https://483d-82-73-166-141.eu.ngrok.io',
	mainnet: 'wss://node.vite.net/gvite/ws', // or 'wss://node-tokyo.vite.net/ws'
};

let WS_service = new WS_RPC(providerWsURLs[network]);
let provider = new ViteAPI(WS_service, () => {
	console.log('Connected');
});

const getContractEvents = async ({ input }) => {
	const {
		contractAddress,
		contractAbi,
		eventName = 'allEvents',
		fromHeight = 0,
		toHeight = 0,
	} = input;

	let contractEventsFormated = [];

	const filteredAbi =
		eventName === 'allEvents'
			? contractAbi
			: contractAbi.filter((a) => {
					return a.name === eventName;
			  });

	let logs = await provider.request('ledger_getVmLogsByFilter', {
		addressHeightRange: {
			[contractAddress.toString()]: {
				fromHeight: fromHeight.toString(),
				// fromHeight: fromHeight.toString(),
				toHeight: toHeight.toString(),
			},
		},
	});

	if (logs) {
		console.log(logs);

		for (let log of logs) {
			log = log.vmlog;

			for (let abiItem of filteredAbi) {
				if (abiItem.type == 'event') {
					let dataHex = utils._Buffer.from(log.data, 'base64').toString('hex');
					let returnValues = abi.decodeLog(abiItem, dataHex, log.topics);

					let contractEvent: ContractEvent = {
						returnValues: returnValues,
						fromHeight: fromHeight,
						contractAddress: contractAddress,
						toHeight: toHeight,
						event: abiItem.name,
						eventName: abiItem.name,
						raw: {
							data: dataHex,
							topics: log.topics,
						},
						accountBlockHeight: log.accountBlockHeight,
						accountBlockHash: log.accountBlockHash,
						logAddress: log.address,
					};
					// contractEventsFormated.push(contractEvent);
					break;
				}
			}
		}
	}

	return contractEventsFormated;
};
const getUsersJointAccounts = async ({ userAddress, fromHeight = 0, toHeight = 0 }) => {
	console.log('CALL');
	let userJointAccounts = [];
	const contractAddress = JointAccountContract.address[network];
	const logEvents = ['AccountCreated', 'MemberAdded'];
	const filteredAbi = JointAccountContract.abi.filter((event) => _.includes(logEvents, event.name));

	let logs = await provider.request('ledger_getVmLogsByFilter', {
		addressHeightRange: {
			[userAddress.toString()]: {
				fromHeight: fromHeight.toString(),
				toHeight: toHeight.toString(),
			},
		},
	});

	if (logs) {
		for (let log of logs) {
			let vmLog = log.vmlog;
			let topics = vmLog.topics;
			for (let abiItem of filteredAbi) {
				let signature = abi.encodeLogSignature(abiItem);
				if (abiItem.type === 'event' && signature === topics[0]) {
					let dataHex;
					if (vmLog.data) {
						dataHex = utils._Buffer.from(vmLog.data, 'base64').toString('hex');
					}
					let returnValues = abi.decodeLog(abiItem, dataHex, topics);
					console.log(returnValues);
				}
			}
		}
	}

	// console.log(logs);

	console.log(await getAccount({ address: contractAddress }));
	const balanceInfo: any = await provider.getBalanceInfo(contractAddress);
	const tokensInContract = _.keys(balanceInfo.balance.balanceInfoMap);
	for (const tokenId of tokensInContract) {
		const accountId = 0;
		await provider.queryContractState({
			address: contractAddress,
			abi: JointAccountContract.abi,
			methodName: 'balanceOf',
			params: [accountId, tokenId],
		});
	}

	console.log(_.keys(balanceInfo.balance.balanceInfoMap));
	const balanceTokens = balanceInfo;
	// const block = await accountBlock.queryContractState({
	// 	address: userAddress,
	// 	abi: JointAccountContract.abi,
	// 	methodName: 'balanceOf',
	// 	params: [userAddress],
	// }).accountBlock;

	// const tx = vcInstance.signAndSendTx([{ block }]);
	// console.log(tx);

	// const methodAbi = JointAccountContract.abi.filter((abiElement) => abiElement.name == 'isMember');
	// const block = accountBlock.createAccountBlock('callContract', {
	// 	address: connectedAccount,
	// 	abi: methodAbi,
	// 	toAddress,
	// 	params,
	// 	tokenId,
	// 	amount,
	// }).accountBlock;

	// return contractEventsFormated;
};

const getAccount = async ({ address, fromHeight = 0, toHeight = 0 }) => {
	const balanceInfo: any = await provider.getBalanceInfo(address);

	let accountBalances: any = [];
	if (balanceInfo.balance.balanceInfoMap) {
		accountBalances = Object.values(balanceInfo.balance.balanceInfoMap).map((tokenInfo: any) => {
			return {
				name: tokenInfo.tokenInfo.tokenName,
				symbol: tokenInfo.tokenInfo.tokenSymbol,
				decimals: tokenInfo.tokenInfo.decimals,
				tokenId: tokenInfo.tokenInfo.tokenId,
				totalSupply: tokenInfo.tokenInfo.totalSupply,
				maxSupply: tokenInfo.tokenInfo.maxSupply,
				index: tokenInfo.tokenInfo.index,
				owner: tokenInfo.tokenInfo.owner,
				balance: tokenInfo.balance,
			};
		});
	}

	const account = {
		address: address,
		balances: accountBalances.filter((balanceInfo) => new BigNumber(balanceInfo.balance).gt(0)),
	};
	return account;
};

var root = {
	ContractEvents: getContractEvents,
	Account: getAccount,
	UsersJointAccounts: getUsersJointAccounts,
	// jointAccount: async (id) => {
	// 	const balances = account();
	// },
};

app.use(
	'/graphql',
	graphqlHTTP({
		schema: schema,
		rootValue: root,
		graphiql: true,
	})
);

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
