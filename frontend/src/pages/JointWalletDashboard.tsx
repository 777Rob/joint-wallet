import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from '../utils/globalContext';
import { useTitle } from '../utils/hooks';
import { State } from '../utils/types';
import LabelCard from 'components/LabelCard';
import { useParams } from 'react-router-dom';
type Props = State & {};
const ChartIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-6 w-6"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		strokeWidth={2}
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
		/>
	</svg>
);

const UsersIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5"
		viewBox="0 0 20 20"
		fill="currentColor"
	>
		<path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
	</svg>
);

const UserAddIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-6 w-6"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		strokeWidth={2}
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
		/>
	</svg>
);

const PieChartIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-6 w-6"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		strokeWidth={2}
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
		/>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
		/>
	</svg>
);

const SpeedomeetreIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
		fill="currentColor"
		className="h-9 w-9 dark:text-gray-800"
	>
		<path d="M425.706,142.294A240,240,0,0,0,16,312v88H160V368H48V312c0-114.691,93.309-208,208-208s208,93.309,208,208v56H352v32H496V312A238.432,238.432,0,0,0,425.706,142.294Z"></path>
		<rect width="32" height="32" x="80" y="264"></rect>
		<rect width="32" height="32" x="240" y="128"></rect>
		<rect width="32" height="32" x="136" y="168"></rect>
		<rect width="32" height="32" x="400" y="264"></rect>
		<path d="M297.222,335.1l69.2-144.173-28.85-13.848L268.389,321.214A64.141,64.141,0,1,0,297.222,335.1ZM256,416a32,32,0,1,1,32-32A32.036,32.036,0,0,1,256,416Z"></path>
	</svg>
);

const users = [
	{
		avatar:
			'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
		name: 'Dexter',
		wallet: 'vite_420',
	},
	{
		avatar:
			'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
		name: 'Dexter',
		wallet: 'vite_420',
	},
	{
		avatar:
			'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
		name: 'Dexter',
		wallet: 'vite_420',
	},
	{
		avatar:
			'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
		name: 'Dexter',
		wallet: 'vite_420',
	},
];

const motions = [
	{
		proposerName: 'Dexter',
		proposerWallet: 'vite_420',
		userVotedUp: false,
		userVotedDown: false,
		votes: 3,
		votesNeedToPass: 5,
		proposal: "Let's move funds",
		status: 'passed',
	},
	{
		proposerName: 'Dexter',
		proposerWallet: 'vite_420',
		userVotedUp: false,
		userVotedDown: false,
		votes: 3,
		votesNeedToPass: 5,
		proposal: "Let's move funds",
		status: 'failed',
	},
	{
		proposerName: 'Dexter',
		proposerWallet: 'vite_420',
		userVotedUp: false,
		userVotedDown: false,
		votes: 3,
		votesNeedToPass: 5,
		proposal: "Let's move funds",
		status: 'pending',
	},
	{
		proposerName: 'Dexter',
		proposerWallet: 'vite_420',
		userVotedUp: true,
		userVotedDown: true,
		votes: 3,
		votesNeedToPass: 5,
		proposal: "Let's move funds",
		status: 'passed',
	},
];

const LikeIcon = () => {
	return (
		<svg
			className="h-8 w-8 text-green-500"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
		</svg>
	);
};

const LikeFilledIcon = () => {
	return (
		<svg
			className="h-8 w-8 text-green-500"
			viewBox="0 0 24 24"
			fill="#2bd95a"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			{' '}
			<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
		</svg>
	);
};

const DislikeIcon = () => {
	return (
		<svg
			className="h-8 w-8 text-red-500"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			{' '}
			<path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
		</svg>
	);
};

const DislikeFilledIcon = () => {
	return (
		<svg
			className="h-8 w-8 text-red-500"
			viewBox="0 0 24 24"
			fill="#e8472e"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
		</svg>
	);
};

const MessageIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-6 w-6"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		strokeWidth={2}
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
		/>
	</svg>
);

const JointWalletDashboard = ({ i18n }: Props) => {
	const [signee, setSignee] = useState('');
	const { id } = useParams();

	const navigate = useNavigate();
	console.log(id, 'p');
	return (
		<div className="grid gap-4 mx-4 mt-4 grid-cols-6">
			<LabelCard title="Inflow" svgIcon={PieChartIcon} className="col-span-2">
				<p className="text-2xl font-bold">3789.9856 ETH</p>
				<p className="text-xl font-light">$ 112,274,98.83 </p>
			</LabelCard>
			<LabelCard title="Inflow" svgIcon={PieChartIcon} className="col-span-2">
				<p className="text-2xl font-bold">3789.9856 ETH</p>
				<p className="text-xl font-light">$ 112,274,98.83 </p>
			</LabelCard>
			<LabelCard title="Inflow" svgIcon={PieChartIcon} className="col-span-2">
				<p className="text-2xl font-bold">3789.9856 ETH</p>
				<p className="text-xl font-light">$ 112,274,98.83 </p>
			</LabelCard>
			<LabelCard svgIcon={UsersIcon} className="col-span-3" title="Members">
				<div className="space-y-2 mt-3 ">
					{users.map((user) => (
						<div className="flex justify-between bg-skin-base  rounded-xl items-center p-3">
							<div className="flex">
								<img
									className="object-cover w-12 h-12 mx-2 rounded-full"
									src={user.avatar}
									alt="avatar"
								/>
								<div>
									<p className="text-lg font-semibold">{user.name}</p>
									<p className="text-md -mt-2">{user.wallet}</p>
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
					{motions.map((motion) => (
						<div className="flex justify-between bg-skin-base  rounded-xl items-center p-3">
							<div className="flex">
								<div className="flex items-center">
									<div
										className={`object-cover w-8 h-8 mx-2 rounded-full 
										${motion.status === 'passed' && 'bg-green-500'} 
										${motion.status === 'failed' && 'bg-red-500'} 
										${motion.status === 'pending' && 'bg-orange-500'}`}
									/>
									<div>
										<p className="text-md font-semibold">{motion.proposerName}</p>
										<p className="text-sm -mt-2">{motion.proposerWallet}</p>
										<p className="text-md -mt-1 ">{motion.proposal}</p>
									</div>
								</div>
							</div>

							<div className="flex">
								<div className="cursor-pointer">
									{motion.userVotedUp ? <LikeFilledIcon /> : <LikeIcon />}
								</div>
								<div className="cursor-pointer">
									{motion.userVotedDown ? <DislikeFilledIcon /> : <DislikeIcon />}
								</div>
							</div>
						</div>
					))}
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
		</div>
	);
};

export default connect(JointWalletDashboard);
