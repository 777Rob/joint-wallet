import { Outlet, useNavigate } from 'react-router-dom';
import ViteLogo from '../assets/ViteLogo';
import { connect } from '../utils/globalContext';
import { State } from '../utils/types';
import { shortenAddress } from 'utils/strings';
import LandingSignedOut from 'pages/LandingSignedOut';
import { MdAccountBalanceWallet, MdAccountCircle } from 'react-icons/md';

type Props = State & {
	// children: React.ReactNode;
};

const AppHome = ({ i18n, vcInstance, callContract, setState }: Props) => {
	const navigate = useNavigate();
	// console.log(children);

	return vcInstance ? (
		<div className="">
			<div className="fixed left bg-skin-foreground h-screen w-72 border-x px-4 py-8  border-r dark:bg-gray-800 dark:border-gray-600">
				<h2
					className="text-3xl font-semibold flex justify-center cursor-pointer"
					onClick={() => navigate('/')}
				>
					<ViteLogo className="fill-blue-500 h-20 center" />
				</h2>
				<div className="flex flex-col items-center mt-6 -mx-2">
					<MdAccountCircle size="60px" />
					<h4 className="mx-2 mt-2 font-medium text-gray-800 dark:text-gray-200 hover:underline">
						Current user:
					</h4>
					<p className="mx-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:underline">
						{shortenAddress('vite_b90249add6e99b9a473c4d975fa74a0f2ccd4b3cc432493e60')}
					</p>
				</div>
				<div className="relative mt-6">
					<span className="absolute inset-y-0 left-0 flex items-center pl-3">
						<svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
							<path
								d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							></path>
						</svg>
					</span>

					<input
						type="text"
						className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
						placeholder="Search"
					/>
				</div>

				<div className="outline-btn" onClick={() => navigate('/app/select')}>
					<svg
						className="w-5 h-5"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>

					<span className="mx-4 font-medium">Accounts</span>
				</div>

				<div onClick={() => navigate('/app/settings')} className="outline-btn">
					<svg
						className="w-5 h-5"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M10.3246 4.31731C10.751 2.5609 13.249 2.5609 13.6754 4.31731C13.9508 5.45193 15.2507 5.99038 16.2478 5.38285C17.7913 4.44239 19.5576 6.2087 18.6172 7.75218C18.0096 8.74925 18.5481 10.0492 19.6827 10.3246C21.4391 10.751 21.4391 13.249 19.6827 13.6754C18.5481 13.9508 18.0096 15.2507 18.6172 16.2478C19.5576 17.7913 17.7913 19.5576 16.2478 18.6172C15.2507 18.0096 13.9508 18.5481 13.6754 19.6827C13.249 21.4391 10.751 21.4391 10.3246 19.6827C10.0492 18.5481 8.74926 18.0096 7.75219 18.6172C6.2087 19.5576 4.44239 17.7913 5.38285 16.2478C5.99038 15.2507 5.45193 13.9508 4.31731 13.6754C2.5609 13.249 2.5609 10.751 4.31731 10.3246C5.45193 10.0492 5.99037 8.74926 5.38285 7.75218C4.44239 6.2087 6.2087 4.44239 7.75219 5.38285C8.74926 5.99037 10.0492 5.45193 10.3246 4.31731Z"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<span className="mx-4 font-medium">Settings</span>
				</div>
			</div>
			<div className="ml-72">
				<div className="pt-12">
					<Outlet />
				</div>
			</div>
		</div>
	) : (
		<LandingSignedOut />
	);
};

export default connect(AppHome);
