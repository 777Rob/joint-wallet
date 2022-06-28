import { RefreshIcon } from '@heroicons/react/outline';
import { useCallback, useEffect, useState } from 'react';
import Cafe from '../contracts/Cafe';
import { connect } from '../utils/globalContext';
import { useTitle } from '../utils/hooks';
import { shortenAddress } from '../utils/strings';
import { CoffeeBuyEvent, State } from '../utils/types';
import { getPastEvents } from '../utils/viteScripts';
import { ImPlus } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
import { MdAccountBalanceWallet } from 'react-icons/md';
type Props = State & {};

const JointAccountCard = ({ name, address }: { name?: string; address?: string }) => {
	const navigate = useNavigate();

	return (
		<button onClick={() => navigate('/app/wallet/dashboard')} className="select-card">
			<div className="flex justify-center items-center text-gray-500">
				<MdAccountBalanceWallet className="text-6xl text-skin-medlight" />
			</div>
			<div className="text-center mt-4">
				<h1 className="font-bold text-gray-700 text">{name}</h1>
				<h1 className="font-bold text-gray-700 text pb-5">0x023xsw..4dc7</h1>

				<button className="py-2 w-40 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-skin-highlight rounded-md hover:bg-skin-medlight focus:outline-none focus:ring focus:bg-skin-lowlight focus:ring-opacity-80">
					Go to wallet
				</button>
			</div>
		</button>
	);
};

const Wallets = [
	{
		address: '0X',
		name: 'BAT MOBILE',
		id: 420,
	},
	{
		address: '0X',
		name: 'BAT MOBILE',
		id: 420,
	},
	{
		address: '0X',
		name: 'BAT MOBILE',
		id: 420,
	},
];

const WalletSelect = ({ i18n, viteApi, networkType, setState }: Props) => {
	// <div class="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 xl:grid-cols-4">
	const navigate = useNavigate();

	return (
		<div className="flex-col items-center lg:py-12 lg:flex lg:justify-center">
			<h1 className="text-2xl font-semibold text-center text-gray-800 capitalize  dark:text-white mt-4">
				Looks like you have a vite joint wallet already.
			</h1>

			<p className=" mb-10 text-center text-gray-500 dark:text-gray-300">
				Click on a card to get started
			</p>
			<div className="bg-skin-foreground lg:mx-8 lg:max-w-7xl lg:shadow-lg lg:rounded-lg p-8">
				<div className="bg-skin-foreground px-12 grid grid-cols-1 gap-8 mt-4 xl:mt-8 md:grid-cols-2 xl:grid-cols-4 lg:mx-8 ">
					{Wallets.map((wallet) => (
						<JointAccountCard name={wallet.name} />
					))}
					<button onClick={() => navigate('/app/create')} className="select-card">
						<div className="flex justify-center items-center text-gray-500">
							<ImPlus className="text-6xl text-skin-medlight" />
						</div>
						<div className="text-center mt-4">
							<h1 className="font-bold text-gray-700 text">Create a new Joint Wallet</h1>
						</div>
					</button>
				</div>
			</div>
		</div>
	);
};

export default connect(WalletSelect);
