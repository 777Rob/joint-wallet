import { ReactNode, useEffect, useMemo, useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

import { SunIcon, MoonIcon, DesktopComputerIcon } from '@heroicons/react/outline';
import A from 'components/A';
import { NetworkTypes, State } from '../utils/types';
import { prefersDarkTheme } from '../utils/misc';
import { connect, setStateType } from '../utils/globalContext';
import ViteConnectButton from './ViteConnectButton';
import ViteLogo from '../assets/ViteLogo';
import { PROD } from '../utils/constants';
import DropdownButton from '../components/DropdownButton';
import Settings from '../components/SettingsSelect';
import { Language } from '../components/SettingsSelect/Language';
import LandingSignedOut from '../pages/LandingSignedOut';
import TabsTheme from 'components/Tabs/TabsTheme';

const client = new ApolloClient({
	uri: 'http://localhost:4000/graphql',
	cache: new InMemoryCache(),
});
type Props = State & {
	noPadding?: boolean;
	children: ReactNode;
};

const PageContainer = ({
	noPadding,
	networkType,
	languageType,
	i18n,
	vcInstance,
	setState,
	children,
}: Props) => {
	const [theme, themeSet] = useState(localStorage.theme);

	useEffect(() => {
		import(`../i18n/${languageType}.ts`).then((translation) => {
			setState({ i18n: translation.default });
		});
	}, [setState, languageType]);

	const networkTypes = useMemo(() => {
		const arr: [NetworkTypes, string][] = [
			['mainnet', i18n?.mainnet],
			['testnet', i18n?.testnet],
		];
		!PROD && arr.push(['localnet', i18n?.localnet]);
		return arr;
	}, [i18n]);

	const languages = [
		['English', 'en'],
		// ['English', 'en'],
	];

	const themes: [typeof SunIcon, string][] = [
		[SunIcon, i18n?.light],
		[MoonIcon, i18n?.dark],
		[DesktopComputerIcon, i18n?.system],
	];

	const AvailableNetworks = Avnetworks(networkTypes, setState);

	// if (vcInstance) {
	return !i18n ? null : (
		<ApolloProvider client={client}>
			<div className="min-h-screen flex flex-col">
				<header>
					<div className="absolute right-0 m-2"></div>
				</header>
				<div className="absolute right-1 w-60 h-8 mt-14 flex">
					{/* <Tabs tabs={TabsTheme} size="xs" /> */}
					<TabsTheme />
					<DropdownButton
						buttonJsx={<p>{i18n[networkType]}</p>}
						dropdownJsx={<AvailableNetworks />}
					/>
				</div>

				<div className="flex-1 flex flex-col sm:flex-row">
					<main className="flex-1">{children}</main>
				</div>
				<footer className="fx mt-16 justify-end gap-2 bottom-0 h-16 p-4 bg-skin-foreground text-skin-muted text-sm">
					<A href="https://twitter.com/vitelabs" className="brightness-button">
						Twitter
					</A>
					<A href="https://github.com/vitelabs/vite-express" className="brightness-button">
						GitHub
					</A>
					<A href="https://discord.gg/AEnScAQA" className="brightness-button">
						Discord
					</A>
				</footer>
			</div>
		</ApolloProvider>
	);
	// } else {
	// 	return !i18n ? null : <LandingSignedOut />;
	// }
};

export default connect(PageContainer);
function Avnetworks(networkTypes: [NetworkTypes, string][], setState: setStateType) {
	return () => {
		return (
			<>
				{networkTypes.map(([networkType, label]) => {
					const active = (localStorage.networkType || 'testnet') === networkType;
					return (
						<button
							key={networkType}
							className={`fx px-2 w-full text-skin-primary font-bold h-7 bg-skin-foreground brightness-button ${
								active ? 'text-skin-highlight' : ''
							}`}
							onMouseDown={(e) => e.preventDefault()}
							onClick={() => {
								localStorage.networkType = networkType;
								setState({ networkType });
							}}
						>
							{label}
						</button>
					);
				})}
			</>
		);
	};
}
