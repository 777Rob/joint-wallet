import { useParams } from 'react-router-dom';
import { connect } from '../utils/globalContext';
import { useTitle } from '../utils/hooks';
import { State } from '../utils/types';
import LabelCard from 'components/LabelCard';
import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { JointAccountContract } from 'contracts/JointAccounts';
enum ActionTypes {
	AddMember,
	RemoveMember,
	TransferFunds,
	Threshold,
}

type Props = State & {};

const ActionOptions = [
	{ name: 'Transfer Funds', type: ActionTypes.TransferFunds },
	{ name: 'Add Member', type: ActionTypes.AddMember },
	{ name: 'Remove Member', type: ActionTypes.RemoveMember },
	{ name: 'Change Threshold', type: ActionTypes.Threshold },
];

const MotionIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5"
		viewBox="0 0 20 20"
		fill="currentColor"
	>
		<path
			fillRule="evenodd"
			d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z"
			clipRule="evenodd"
		/>
	</svg>
);

const TrashIcons = () => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="red">
			<path
				fillRule="evenodd"
				d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
				clipRule="evenodd"
			/>
		</svg>
	);
};

const NewMotionIcon = (
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
			d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"
		/>
	</svg>
);

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

const CornerIcon = ({ className }: { className?: string }) => {
	return (
		<svg
			width="34"
			height="35"
			viewBox="0 0 34 35"
			fill="none"
			className={className}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M12.7275 21.8701L21.2128 13.3848"
				stroke="#2C3857"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M6.89453 21.3398L20.6831 7.55126"
				stroke="#2C3857"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M18.5615 22.4004L21.7435 19.2184"
				stroke="#2C3857"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	);
};
const JointWalletMotions = ({ i18n, callContract, setState }: Props) => {
	useTitle('');
	const { id } = useParams();
	const [selected, setSelected] = useState(ActionOptions[0]);
	const [motionParams, setMotionParams] = useState({
		addressTo: '',
		viteTokenId: 'tti_5649544520544f4b454e6e40',
		amount: 1,
		address: '',
		newThreshold: 0,
		action: '',
	});

	// const [motionParams, setMotionParams] = useState({ address: '', action: '' });
	const [loading, setLoading] = useState(false);
	return (
		<div className="">
			<div className="grid gap-4 mx-4 mt-4 grid-cols-2">
				<LabelCard title="New Motion" svgIcon={NewMotionIcon}>
					<label className="text-xs font-medium text-gray-500">Motion purpose: </label>
					<Listbox value={selected} onChange={setSelected}>
						<div className="relative mt-1">
							<Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
								<span className="block truncate">{selected.name}</span>
								<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
									<SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
								</span>
							</Listbox.Button>
							<Transition
								as={Fragment}
								leave="transition ease-in duration-100"
								leaveFrom="opacity-100"
								leaveTo="opacity-0"
							>
								<Listbox.Options
									defaultValue="Select "
									className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
								>
									{ActionOptions.map((action) => (
										<Listbox.Option
											key={action.type}
											className={({ active }) =>
												`relative cursor-default hover:bg-skin-highlight rounded-lg hover:text-white select-none py-2 pl-10 pr-4 ${
													active ? 'bg-skin-highlight rounded-lg text-white' : ''
												}`
											}
											value={action}
										>
											{({ selected }) => (
												<>
													<span
														className={`block truncate ${
															selected ? 'font-medium  ' : 'font-normal'
														}`}
													>
														{action.name}
													</span>
													{selected ? (
														<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
															<CheckIcon className="h-5 w-5" aria-hidden="true" />
														</span>
													) : null}
												</>
											)}
										</Listbox.Option>
									))}
								</Listbox.Options>
							</Transition>
						</div>
					</Listbox>
					<div className="flex-col">
						<div className="text-xs font-medium text-gray-500"> Motion params: </div>
						<div className="text-xs font-medium text-gray-500">
							{' '}
							{selected == ActionOptions[0] && 'Address to'}
							{selected == ActionOptions[1] && 'Address Member'}
							{selected == ActionOptions[2] && 'Address Member'}
							{selected == ActionOptions[3] && 'Treshold amount'}
						</div>
					</div>

					{/* Transfer Funds */}

					{selected == ActionOptions[0] && (
						<div className="w-full space-y-1 border-y-2 border-x-2 rounded-xl p-2 focus:border-skin-lowlight">
							<input
								value={motionParams.addressTo}
								onChange={(e) => setMotionParams({ ...motionParams, addressTo: e.target.value })}
								placeholder="Amount to transfer"
								className="block w-full rounded-md border-gray-200 text-sm transition focus:border-blue-600 focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75"
							/>
							<div className="flex justify-end">
								<CornerIcon className="self-end" />
							</div>
						</div>
					)}

					{selected == ActionOptions[0] && (
						<>
							<div className="text-xs font-medium text-gray-500">Vite Token Id </div>
							<div className="w-full space-y-1 border-y-2 border-x-2 rounded-xl p-2 focus:border-skin-lowlight">
								<input
									value={motionParams.viteTokenId}
									onChange={(e) =>
										setMotionParams({ ...motionParams, viteTokenId: e.target.value })
									}
									placeholder="Vite token id"
									className="block w-full rounded-md border-gray-200 text-sm transition focus:border-blue-600 focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75"
								/>
								<div className="flex justify-end">
									<CornerIcon className="self-end" />
								</div>
							</div>
						</>
					)}
					{selected == ActionOptions[0] && (
						<>
							<div className="text-xs font-medium text-gray-500">Amount to transfer:</div>
							<div className="w-full space-y-1 border-y-2 border-x-2 rounded-xl p-2 focus:border-skin-lowlight">
								<input
									value={motionParams.amount}
									onChange={(e) =>
										setMotionParams({ ...motionParams, amount: parseInt(e.target.value) })
									}
									placeholder="Address to"
									className="block w-full rounded-md border-gray-200 text-sm transition focus:border-blue-600 focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75"
								/>
								<div className="flex justify-end">
									<CornerIcon className="self-end" />
								</div>
							</div>
						</>
					)}
					{selected == ActionOptions[3] && (
						<>
							<div className="text-xs font-medium text-gray-500">New approval treshold </div>
							<div className="w-full space-y-1 border-y-2 border-x-2 rounded-xl p-2 focus:border-skin-lowlight">
								<input
									value={motionParams.newThreshold}
									onChange={(e) =>
										setMotionParams({
											...motionParams,
											newThreshold: parseInt(e.target.value),
										})
									}
									placeholder="Address to"
									className="block w-full rounded-md border-gray-200 text-sm transition focus:border-blue-600 focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75"
								/>
								<div className="flex justify-end">
									<CornerIcon className="self-end" />
								</div>
							</div>
						</>
					)}

					{/* Add member */}
					{selected == ActionOptions[1] && (
						<>
							<label>Member Address</label>
							<div className="w-full space-y-1 border-y-2 border-x-2 rounded-xl p-2 focus:border-skin-lowlight">
								<input
									value={motionParams.address}
									onChange={(e) =>
										setMotionParams({ ...motionParams, address: e.target.value, action: 'Add' })
									}
									placeholder="Member you want to add address"
									className="block w-full rounded-md border-gray-200 text-sm transition focus:border-blue-600 focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75"
								/>
								<div className="flex justify-end">
									<CornerIcon className="self-end" />
								</div>
							</div>
						</>
					)}

					{/* Remove Member */}
					{selected == ActionOptions[2] && (
						<>
							<label>Member Address</label>
							<div className="w-full space-y-1 border-y-2 border-x-2 rounded-xl p-2 focus:border-skin-lowlight">
								<input
									value={motionParams.address}
									onChange={(e) =>
										setMotionParams({ ...motionParams, address: e.target.value, action: 'Remove' })
									}
									placeholder="Member you want to remove address"
									className="block w-full rounded-md border-gray-200 text-sm transition focus:border-blue-600 focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75"
								/>
								<div className="flex justify-end">
									<CornerIcon className="self-end" />
								</div>
							</div>
						</>
					)}
					<div className="mt-30">
						<button
							className="primarybtn bottom-1"
							onClick={async () => {
								// const ActionOptions = [
								// 	{ name: 'Transfer Funds', type: ActionTypes.TransferFunds },
								// 	{ name: 'Add Member', type: ActionTypes.AddMember },
								// 	{ name: 'Remove Member', type: ActionTypes.RemoveMember },
								// 	{ name: 'Change Threshold', type: ActionTypes.Threshold },
								// ];
								// promptTxConfirmationSet(true);
								setLoading(true);

								let option: any[] = [];
								let type = '';

								switch (selected) {
									case ActionOptions[0]:
										option = [
											id,
											motionParams.viteTokenId,
											motionParams.amount,
											motionParams.addressTo,
											id,
										];
										type = 'createTransferMotion';
										break;
									case ActionOptions[1]:
										option = [id, motionParams.address];
										type = 'createAddMemberMotion';
										break;
									case ActionOptions[2]:
										option = [id, motionParams.address];
										type = 'createRemoveMemberMotion';
										break;
									case ActionOptions[3]:
										option = [
											id,
											motionParams.viteTokenId,
											motionParams.addressTo,
											motionParams.amount,
										];
										type = 'createChangeThresholdMotion';
										break;
									case ActionOptions[4]:
										option = [id, motionParams.newThreshold];
										break;
									default:
										option = [];
										setState({ toast: 'Error' });
										break;
								}

								await callContract(JointAccountContract, type, option);
								setState({ toast: i18n.transactionConfirmed });
								setLoading(false);
							}}
						>
							Create motion
						</button>
					</div>
				</LabelCard>

				<LabelCard svgIcon={MotionIcon} title="My Motions" className="gap-4">
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

							<div className="flex items-center">
								<div className="cursor-pointer mr-4 text-center">
									<p className="font-bold">Votes</p>
									<p>
										{motion.votes}/{motion.votesNeedToPass}
									</p>
								</div>
								<div className="cursor-pointer">
									<TrashIcons />
								</div>
							</div>
						</div>
					))}{' '}
				</LabelCard>
			</div>
		</div>
	);
};

export default connect(JointWalletMotions);