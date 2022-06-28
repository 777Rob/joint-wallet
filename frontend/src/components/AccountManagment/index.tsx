import { RefreshIcon } from '@heroicons/react/outline';
import { useCallback, useContext, useEffect, useState } from 'react';
import Cafe from 'contracts/Cafe';
import { connect } from 'utils/globalContext';
import { useTitle } from 'utils/hooks';
import { shortenAddress } from 'utils/strings';
import { CoffeeBuyEvent, State } from 'utils/types';
import { getPastEvents } from 'utils/viteScripts';
import { useGlobalContext } from 'utils/hooks';
type Props = {};

const JointAccount = ({}: Props) => {
	return <div></div>;
};

const AccountManagment = ({}: Props) => {
	const context = useGlobalContext();
	const { i18n } = context.state;
	console.log(i18n);

	const userAccounts = [];
	return (
		<div className="m-12 bg-skin-foreground rounded-2xl shadow-lg p-6">
			<div className="flex justify-between">
				<div>
					<h6 className="text-4xl font-bold ">Manage your account</h6>
					<p className="text-xl font-light">
						A Joint Account allows to hold funds between multiple addresses
					</p>
				</div>

				<div>
					<button className="primarybtn">Create joint account</button>
				</div>
			</div>

			<p>Accounts</p>
		</div>
	);
};

export default AccountManagment;
