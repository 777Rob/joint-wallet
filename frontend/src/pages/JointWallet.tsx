import { connect } from "../utils/globalContext";
import { useTitle } from "../utils/hooks";
import { State } from "../utils/types";
import ButtonCard from "components/ButtonCard";
import Tabs, { TabsProps } from "../components/Tabs";
import { FaWallet } from "react-icons/fa";
import { IconType } from "react-icons";
import { Outlet, useParams } from "react-router-dom";

type Props = State & {};

const tabs = [
  { name: "Overview", link: "/app/wallet/dashboard" },
  { name: "Motions", link: "/app/wallet/motions" },
  { name: "Transaction history", link: "/app/wallet/history" },
];

const JointWallet = ({ i18n }: Props) => {
  const { id } = useParams();
  console.log(id);
  return (
    <div>
      <Tabs
        tabs={tabs}
        onTabChange={(newTab: string) => {
          console.log("newTab");
          console.log(newTab);
        }}
      />
      <Outlet />
      {/* <div className="bg-skin-foreground lg:mx-8 lg:max-w-7xl lg:shadow-lg lg:rounded-lg p-8"></div> */}
    </div>
  );
};

export default connect(JointWallet);
