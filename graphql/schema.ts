var { buildSchema } = require('graphql');

var schema = buildSchema(`
type Query {
	Account(address: String!): Account
	ContractEvents(input: contractInput): [ContractEvent]
	UsersJointAccounts(userAddress: String, update: Boolean): [JointAccount]
	JointAccountMotions(accountId: Int): [Motion]
	JointAccount(accountId: Int): JointAccount
}
type Mutation{
	GetMockAccount: Account
}

input contractInput {
	contractAddress: String!
	contractAbi: [ContractAbiInput]!
	eventName: String
	fromHeight: Int
	toHeight: Int
}

type NewAccountBlock {
	hash: String
	height: Int
	heightStr: String
	removed: Boolean
}

type ContractFunctionInputType {
	internalType: String
	name: String
	type: String
}
input ContractFunctionInputInputType {
	internalType: String
	name: String
	indexed: Boolean
	anonymous: Boolean
	type: String
}

type ContractAbiElement {
	inputs: [ContractFunctionInputType]
	name: String
	outputs: [ContractFunctionInputType]
	stateMutability: String
	type: String
}

input ContractAbiInput {
	inputs: [ContractFunctionInputInputType]
	name: String
	outputs: [ContractFunctionInputInputType]
	indexed: Boolean
	anonymous: Boolean
	stateMutability: String
	type: String
}

type ReturnValues {
	from: String
	to: String
	num: String
}

type Raw {
	data: String
	topics: [String]
}

type ContractEvent {
	contractAddress: String
	contractAbi: [ContractAbiElement]
	eventName: String
	fromHeight: Int
	toHeight: Int
	returnValues: ReturnValues
	event: String
	raw: Raw
	accountBlockHeight: String
	accountBlockHash: String
	logAddress: String
}

type TokenInfo {
	name: String
	contractAddress: String
	totalSupply: String
	decimals: Int
	owner: String
	tokenId: String
	maxSupply: String
	index: Int
}

type TokenInfoAccount {
	balance: String
	name: String
	symbol: String
	totalSupply: String
	decimals: Int
	owner: String
	tokenId: String
	maxSupply: String
	index: Int
}

type Account {
	address: String
	balances: [TokenInfoAccount]
}

type Vote {
	accountId: Int
	motionId: Int
	voter: String
	vote: Boolean
}

enum MotionType {
	TRANSFER
	ADD_MEMBER
	REMOVE_MEMBER
	CHANGE_THRESHOLD
}

type Voter {
	address: String
	voted: Boolean
}

type Motion {
	accountId: Int
	index: Int
	type: MotionType
	tokenId: String
	transferAmount: Int
	to: String
	destinationAccount: Int
	threshold: Int
	approved: Boolean
	proposer: String
	voteCount: Int
	votes: [Voter]
	active: Boolean
}

type JointAccount {
	members: [Account]
	approvalThreshold: Int
	id: Int
	name: String
	isStatic: Boolean
	isMemberOnlyDeposit: Boolean
	motions: [Motion]
	balances: [TokenInfoAccount]

}

`);
export default schema;
