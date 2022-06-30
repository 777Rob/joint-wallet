import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from '../utils/globalContext';
import { useTitle } from '../utils/hooks';
import { State } from '../utils/types';
import LabelCard from 'components/LabelCard';
import { useParams } from 'react-router-dom';
import { useJointAccountQuery } from 'graphql/generated/useJointAccount';
import { JointAccountContract } from 'contracts/JointAccounts';
import { PlusCircleIcon } from '@heroicons/react/solid';
import { MessageIcon } from 'assets/MessageIcon';
import { LikeFilledIcon } from 'assets/LikeFilledIcon';
import { LikeIcon } from 'assets/LikeIcon';
import { PieChartIcon } from 'assets/PieChartIcon';
import { UserIcon } from 'assets/UserIcon';

type Props = State & {};
const JointWalletDashboard = ({ i18n, vcInstance, callContract }: Props) => {
	const [signee, setSignee] = useState('');
	const { id } = useParams();
	const accountId = id !== undefined ? parseInt(id) : 420;
	const { data, loading } = useJointAccountQuery({
		variables: {
			accountId: accountId,
		},
	});
	const [deposit, setDeposit] = useState({
		amount: 0,
		viteTokenId: 'tti_5649544520544f4b454e6e40',
	});

	const UsersIcon = (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5  text-skin-primary"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
		</svg>
	);
	const navigate = useNavigate();
	console.log(id, 'p');
	console.log(data);
	return loading ? (
		<div>loading....</div>
	) : (
		<div className="grid gap-4 mx-4 mt-4 grid-cols-6">
			<LabelCard svgIcon={UsersIcon} className="col-span-3" title="Members">
				<div className="space-y-2 mt-3 ">
					{data?.JointAccount?.members?.map((user) => (
						<div className="flex justify-between bg-skin-base  rounded-xl items-center p-3">
							<div className="flex items-center">
								<UserIcon />
								<div>
									{/* <p className="text-lg font-semibold">{user.name}</p> */}
									<p className="text-sm font-bold ml-2">{user?.address}</p>
								</div>
							</div>
							<div className="cursor-pointer bg-skin-highlight text-white p-2 rounded-2xl">
								{MessageIcon}
							</div>
						</div>
					))}
					<div className="flex items-center justify-center">
						<button
							className="primarybtn  justify-self-center"
							onClick={() => navigate(`/app/wallet/${id}/motions`)}
						>
							Add signee
						</button>
					</div>
				</div>
			</LabelCard>
			<LabelCard svgIcon={UsersIcon} className="col-span-3" title="Motions">
				<div className="space-y-2 mt-3">
					{data?.JointAccount?.motions?.map((motion) => {
						let votedUp =
							((motion &&
								motion.votes &&
								motion?.votes.filter(
									(vote) => vcInstance && vote?.address === vcInstance.accounts[0]
								)) ||
								[])[0] !== [];

						console.log(votedUp);
						return (
							<div className="flex justify-between bg-skin-base  rounded-xl items-center p-3">
								<div className="flex">
									<div className="flex items-center">
										<div
											className={`object-cover w-8 h-8 mx-2 rounded-full 
										${motion?.approved === true && 'bg-green-500'} 
										${motion?.approved === false && 'bg-orange-500'}`}
										/>
										<div>
											<p className="text-sm font-semibold">Proposer: {motion?.proposer}</p>
											<p className="text-sm -mt-1 ">Type: {motion?.type}</p>
										</div>
									</div>
								</div>

								<div className="flex">
									<div className="cursor-pointer">
										{votedUp ? (
											<div
												onClick={async () => {
													await callContract(JointAccountContract, 'cancelVote', [
														motion?.accountId,
														motion?.index,
													]);
												}}
											>
												<LikeFilledIcon />
											</div>
										) : (
											<div
												onClick={async () => {
													await callContract(JointAccountContract, 'voteMotion', [
														motion?.accountId,
														motion?.index,
													]);
												}}
											>
												<LikeIcon />
											</div>
										)}
									</div>
									{/* <div className="cursor-pointer">
										{motion.userVotedDown ? <DislikeFilledIcon /> : <DislikeIcon />}
									</div> */}
								</div>
							</div>
						);
					})}
					<div className="flex  items-center justify-center">
						<button
							className="primarybtn  justify-self-center"
							onClick={() => navigate(`/app/wallet/${id}/motions`)}
						>
							Create motion
						</button>
					</div>
				</div>
			</LabelCard>
			<LabelCard title="Account Statistic" svgIcon={PieChartIcon} className="col-span-3">
				<p className="text-xl font-bold">
					Approval Threshold: {data?.JointAccount?.approvalThreshold || 'Error fetching data'}
				</p>
				<p className="text-xl font-bold">
					Members: {data?.JointAccount?.members?.length || 'Error fetching data'}
				</p>
				<p className="text-xl font-bold">
					Motions: {data?.JointAccount?.motions?.length || 'Error fetching data'}
				</p>
			</LabelCard>
			<LabelCard title="Token balances" svgIcon={PieChartIcon} className="col-span-3">
				{data?.JointAccount?.balances?.map((balance) => (
					<div className="flex justify-between bg-skin-base  rounded-xl items-center p-3">
						<div className="flex items-center">
							<div className="ml-4">
								<p className="text-gray-500  ml-2 text-xs font-extralight">Token Balance</p>
								<p className="text-md font-bold ml-2">{balance?.balance}</p>
								<p className="text-gray-500  ml-2 text-xs font-extralight">Token Symbol</p>
								<p className=" text-bold  ml-2">{balance?.symbol}</p>
							</div>
							<div className="ml-4">
								<p className="text-gray-500  ml-2 text-xs font-extralight">Token name</p>
								<p className="text-md font-bold ml-2">{balance?.name}</p>
								<p className="text-gray-500  ml-2 text-xs font-extralight">Token ID</p>
								<p className="text-sm font-bold ml-2">{balance?.tokenId}</p>
							</div>
						</div>
					</div>
				))}
			</LabelCard>
			<LabelCard title="Deposit" svgIcon={<PlusCircleIcon />} className="col-span-3">
				<div>
					<div>
						<p className="text-gray-500   text-xs font-extralight">Deposit amount</p>
						<input
							value={deposit.amount}
							className="text-input"
							onChange={(e) => setDeposit({ ...deposit, amount: parseInt(e.target.value) })}
						/>
					</div>
					<div>
						<p className="text-gray-500 text-xs font-extralight">Token ID</p>
						<input
							className="text-input"
							value={deposit.viteTokenId}
							onChange={(e) => setDeposit({ ...deposit, viteTokenId: e.target.value })}
						/>
					</div>
					<div className="flex justify-center ">
						<button
							className="primarybtn mt-2"
							onClick={async () =>
								await callContract(JointAccountContract, 'deposit', [
									deposit.amount,
									deposit.viteTokenId,
									accountId,
								])
							}
						>
							Deposit
						</button>
					</div>
				</div>
			</LabelCard>
		</div>
	);
};

export default connect(JointWalletDashboard);
