import { connect } from '../utils/globalContext';
import { useTitle } from '../utils/hooks';
import { State } from '../utils/types';
import ViteLogo from './ViteLogo';
import { PlusIcon } from '@heroicons/react/solid';
import ViteConnectButton from '../containers/ViteConnectButton';
type Props = State & {};

const options = [
	{
		logo: <ViteLogo className="h-20 fill-blue-500" />,
	},
];

const LandingSignedOut = ({ i18n }: Props) => {
	useTitle('');
	return (
		<div className="py-12">
			<div className="max-w-7xl mb-12 mx-auto px-4 sm:px-6 lg:px-8 text-center ">
				<h2 className="h-12 text-4xl font-bold font-sans decoration-neutral-700">Welcome</h2>
				<h3 className="text-xl font-sans decoration-neutral-600 h-7">
					Connect your wallet to get started.
				</h3>
			</div>
			<div className="flex mx-auto">
				{options.map((option) => (
					<button className="mx-auto p-6 shadow-xl rounded-lg dark:bg-skin-foreground items-center flex justify-center">
						{option.logo}
						<ViteConnectButton />
					</button>
				))}
			</div>
			{/* <button className="py-3 px-6 my-10 bg-gray-700 justify-center text-xl font-semibold hover:bg-gray-800 text-white rounded-lg ml-auto mr-auto flex">
				<PlusIcon className="h-7 w-7" /> <p className="">Load more</p>
			</button> */}
		</div>
	);
};

export default connect(LandingSignedOut);
