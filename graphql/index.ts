import express from 'express';
import { utils } from '@vite/vitejs';
import { graphqlHTTP } from 'express-graphql';
import { WS_RPC } from '@vite/vitejs-ws';
import { BigNumber } from 'bignumber.js';
import { accountBlock, account, ViteAPI } from '@vite/vitejs';
import schema from './schema';

import { ContractEvent, JointAccount, Account } from './generated/schematypes';
import * as abi from '@vite/vitejs-abi';
import { JointAccountContract } from '../frontend/src/contracts/JointAccounts';
import _ from 'lodash';
import cors from 'cors';
var app = express();
app.use(cors());

const network = 'testnet';

const providerWsURLs = {
	localnet: 'wss://localhost:23457',
	testnet: 'wss://localhost:23457',
	mainnet: 'wss://node.vite.net/gvite/ws', // or 'wss://node-tokyo.vite.net/ws'
};

let allJointAccounts: JointAccount[] = [];

// type JointAccount = {
// 	members: string[];
// 	approvalThreshold: number;
// 	isStatic: boolean;
// 	isMemberOnlyDeposit: boolean;
// 	// motions: [Motion];
// 	// balances: [TokenInfoAccount];
// };
const updateJointAccounts = async () => {
	const accountsCreatedRequest = await provider.queryContractState({
		address: JointAccountContract.address[network],
		abi: JointAccountContract.abi,
		methodName: 'getAccountsLength',
		params: [],
	});
	let accountsCreatedNumber = 0;
	accountsCreatedNumber = parseInt(accountsCreatedRequest[0]);
	console.log(accountsCreatedNumber);
	const accendingNumberArray = _.fill(Array(accountsCreatedNumber), 1).map((item, index) => index);

	allJointAccounts = await Promise.all(
		accendingNumberArray.map(async (item) => {
			const accountConfig = await provider.queryContractState({
				address: JointAccountContract.address[network],
				abi: JointAccountContract.abi,
				methodName: 'accounts',
				params: [item],
			});
			const accountMembers = await provider.queryContractState({
				address: JointAccountContract.address[network],
				abi: JointAccountContract.abi,
				methodName: 'getMembers',
				params: [item],
			});

			return {
				approvalThreshold: accountConfig[0],
				isStatic: accountConfig[1] == 1,
				id: item,
				name: 'Wallet',
				isMemberOnlyDeposit: accountConfig[2] == 1,
				members: accountMembers[0].map((memberAddress) => {
					return {
						address: memberAddress,
					};
				}),
			};
		})
	);
};

let WS_service = new WS_RPC('http://localhost:23457');
let provider = new ViteAPI(WS_service, async () => {
	console.log('Connected to Vite node');
	await updateJointAccounts();
	// TODO: Subscribe to contract events and update jointAccounts
});

const getContractEvents = async ({ input }: any) => {
	const {
		contractAddress,
		contractAbi,
		eventName = 'allEvents',
		fromHeight = 0,
		toHeight = 0,
	} = input;

	let contractEventsFormated: ContractEvent[] = [];

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
				toHeight: toHeight.toString(),
			},
		},
	});

	if (logs) {
		console.log(logs);

		for (let log of logs) {
			log = log.vmlog;

			for (let abiItem of filteredAbi) {
				try {
					if (abiItem.type == 'event') {
						let dataHex = utils._Buffer.from(log.data, 'base64').toString('hex');
						let returnValues = abi.decodeLog(abiItem.toString(), dataHex, log.topics);
						let contractEvent: ContractEvent = {};
						contractEvent = {
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
						contractEventsFormated.push(contractEvent);
						break;
					}
				} catch (e) {
					console.log(e);
				}
			}
		}
	}

	return contractEventsFormated;
};
const getUsersJointAccounts = async ({
	userAddress,
	fromHeight = 0,
	toHeight = 0,
	update = true,
}) => {
	update && (await updateJointAccounts());
	const userAccounts = allJointAccounts.filter((account: JointAccount) => {
		{
			if (
				_.includes(
					account.members?.map((member) => member.address),
					userAddress
				)
			) {
				return account;
			}
		}
	});
	return userAccounts;
};

export const getPastEvents = async (
	contractAddress: string,
	contractAbi: any[],
	eventName: string = 'allEvents',
	{
		fromHeight = 0,
		toHeight = 0,
	}: {
		filter?: Object;
		fromHeight?: Number;
		toHeight?: Number;
	}
) => {
	let result: any[] = [];
	let logs = await provider.request('ledger_getVmLogsByFilter', {
		addressHeightRange: {
			[contractAddress!]: {
				fromHeight: fromHeight.toString(),
				toHeight: toHeight.toString(),
			},
		},
	});
	const filteredAbi =
		eventName === 'allEvents'
			? contractAbi
			: contractAbi.filter((a: any) => {
					return a.name === eventName;
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
					let item = {
						returnValues: returnValues,
						event: abiItem.name,
						raw: {
							data: dataHex,
							topics: topics,
						},
						signature: signature,
						accountBlockHeight: log.accountBlockHeight,
						accountBlockHash: log.accountBlockHash,
						address: log.address,
					};
					result.push(item);
					break;
				}
			}
		}
	}
	return result;
};

const getJointAccountMontions = async ({
	jointAccountId,
	fromHeight = 0,
	toHeight = 0,
	update = true,
}) => {
	update && (await updateJointAccounts());

	const input = {
		contractAddress: JointAccountContract.address[network],
		contractAbi: JointAccountContract.abi,
		eventName: 'MotionCreated',
		fromHeight: 0,
		toHeight: 0,
	};

	const events = await getPastEvents(
		JointAccountContract.address[network],
		JointAccountContract.abi,
		'MotionCreated',
		{ fromHeight: 0, toHeight: 0 }
	);
	const approvalThreshold = allJointAccounts[jointAccountId].approvalThreshold;
	const results = await Promise.all([events, approvalThreshold]);
	const event = results[0].pop().returnValues;

	console.log(events);
	console.log(results);
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
	JointAccountMotions: getJointAccountMontions,
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
