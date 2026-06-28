// SPDX-License-Identifier: MIT
pragma solidity >=0.8.25 <0.9.0;

import {FHE, euint32, ebool, InEuint32} from "@fhenixprotocol/cofhe-contracts/FHE.sol";

contract CipherAlpha {
    struct EncryptedPortfolio {
        euint32 portfolioValue;
        euint32 investmentBudget;
        euint32 riskPreference;      // 1 - 100
        euint32 liquidityPct;        // 0 - 100
        euint32 diversificationPct;  // 0 - 100
        euint32 expectedApy;         // 0 - 100
        euint32 maxDrawdown;         // 0 - 100
        euint32 timeHorizon;         // Months
        
        // Calculated encrypted metrics
        euint32 riskScore;
        euint32 diversificationScore;
        euint32 liquidityScore;
        euint32 yieldExposure;
        euint32 portfolioHealth;
        bool isCalculated;
    }

    // Map owner addresses to their encrypted portfolios
    mapping(address => EncryptedPortfolio) private userPortfolios;

    // Events
    event PortfolioUpdated(address indexed user);
    event AnalyticsCalculated(address indexed user);
    event DecryptionRequested(address indexed user);

    /**
     * @notice Store client-side encrypted portfolio metrics in the smart contract.
     */
    function updatePortfolio(
        InEuint32 calldata _portfolioValue,
        InEuint32 calldata _investmentBudget,
        InEuint32 calldata _riskPreference,
        InEuint32 calldata _liquidityPct,
        InEuint32 calldata _diversificationPct,
        InEuint32 calldata _expectedApy,
        InEuint32 calldata _maxDrawdown,
        InEuint32 calldata _timeHorizon
    ) public {
        EncryptedPortfolio storage portfolio = userPortfolios[msg.sender];
        
        portfolio.portfolioValue = FHE.asEuint32(_portfolioValue);
        portfolio.investmentBudget = FHE.asEuint32(_investmentBudget);
        portfolio.riskPreference = FHE.asEuint32(_riskPreference);
        portfolio.liquidityPct = FHE.asEuint32(_liquidityPct);
        portfolio.diversificationPct = FHE.asEuint32(_diversificationPct);
        portfolio.expectedApy = FHE.asEuint32(_expectedApy);
        portfolio.maxDrawdown = FHE.asEuint32(_maxDrawdown);
        portfolio.timeHorizon = FHE.asEuint32(_timeHorizon);
        portfolio.isCalculated = false;

        emit PortfolioUpdated(msg.sender);
    }

    /**
     * @notice Perform homomorphic analytics on the stored encrypted values.
     * Computes Risk Score, Diversification, Liquidity, APY, and overall Portfolio Health.
     */
    function computeAnalytics() public {
        EncryptedPortfolio storage portfolio = userPortfolios[msg.sender];
        require(euint32.unwrap(portfolio.portfolioValue) != bytes32(0), "Portfolio data not initialized");

        // 1. Risk Score = (maxDrawdown * riskPreference) / 100
        euint32 riskProd = portfolio.maxDrawdown.mul(portfolio.riskPreference);
        portfolio.riskScore = riskProd.div(FHE.asEuint32(100));

        // 2. Diversification & Liquidity copy directly (homomorphic assignment)
        portfolio.diversificationScore = portfolio.diversificationPct;
        portfolio.liquidityScore = portfolio.liquidityPct;
        portfolio.yieldExposure = portfolio.expectedApy;

        // 3. Portfolio Health = (diversification * 30 + liquidity * 30 + (100 - riskScore) * 40) / 100
        euint32 scale100 = FHE.asEuint32(100);
        euint32 dTerm = portfolio.diversificationPct.mul(FHE.asEuint32(30));
        euint32 lTerm = portfolio.liquidityPct.mul(FHE.asEuint32(30));
        euint32 safetyVal = scale100.sub(portfolio.riskScore);
        euint32 sTerm = safetyVal.mul(FHE.asEuint32(40));

        euint32 totalHealthSum = dTerm.add(lTerm).add(sTerm);
        portfolio.portfolioHealth = totalHealthSum.div(scale100);
        portfolio.isCalculated = true;

        emit AnalyticsCalculated(msg.sender);
    }

    /**
     * @notice Request decryption of computed analytics scores.
     * Starts the asynchronous CoFHE decryption process on the Fhenix Sepolia network.
     */
    function requestDecryption() public {
        EncryptedPortfolio storage portfolio = userPortfolios[msg.sender];
        require(portfolio.isCalculated, "Analytics must be calculated first");

        FHE.decrypt(portfolio.riskScore);
        FHE.decrypt(portfolio.diversificationScore);
        FHE.decrypt(portfolio.liquidityScore);
        FHE.decrypt(portfolio.yieldExposure);
        FHE.decrypt(portfolio.portfolioHealth);

        emit DecryptionRequested(msg.sender);
    }

    /**
     * @notice Fetch the decrypted analytics values once CoFHE MPC threshold validation is completed.
     * Returns 0 for any value not yet decrypted by the protocol.
     */
    function getAnalyticsDecrypted() public view returns (
        uint32 riskScore,
        uint32 diversificationScore,
        uint32 liquidityScore,
        uint32 yieldExposure,
        uint32 portfolioHealth
    ) {
        EncryptedPortfolio storage portfolio = userPortfolios[msg.sender];
        if (!portfolio.isCalculated) return (0, 0, 0, 0, 0);

        (uint256 r, bool rDec) = FHE.getDecryptResultSafe(portfolio.riskScore);
        (uint256 d, bool dDec) = FHE.getDecryptResultSafe(portfolio.diversificationScore);
        (uint256 l, bool lDec) = FHE.getDecryptResultSafe(portfolio.liquidityScore);
        (uint256 y, bool yDec) = FHE.getDecryptResultSafe(portfolio.yieldExposure);
        (uint256 h, bool hDec) = FHE.getDecryptResultSafe(portfolio.portfolioHealth);

        return (
            rDec ? uint32(r) : 0,
            dDec ? uint32(d) : 0,
            lDec ? uint32(l) : 0,
            yDec ? uint32(y) : 0,
            hDec ? uint32(h) : 0
        );
    }

    /**
     * @notice Homomorphically compare two encrypted AI strategy scores on-chain.
     * Returns an encrypted boolean ebool indicating if strategy A's score is higher than strategy B's.
     */
    function compareStrategies(
        InEuint32 calldata _strategyA,
        InEuint32 calldata _strategyB
    ) public returns (ebool) {
        euint32 a = FHE.asEuint32(_strategyA);
        euint32 b = FHE.asEuint32(_strategyB);
        return a.gt(b);
    }
}
