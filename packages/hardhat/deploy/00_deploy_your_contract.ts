import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployPredictionMarket: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("PredictionMarket", {
    from: deployer,
    args: [], // No constructor arguments needed
    log: true,
    autoMine: true,
  });

  console.log("✅ PredictionMarket deployed!");
};

export default deployPredictionMarket;

deployPredictionMarket.tags = ["PredictionMarket"];
