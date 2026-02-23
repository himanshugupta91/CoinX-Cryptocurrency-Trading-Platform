package com.himanshu.repository;

import com.himanshu.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssetsRepository extends JpaRepository<Asset, Long> {
   /**
    * Finds assets by user ID.
    * 
    * @param userId The user ID.
    * @return List of assets.
    */
   List<Asset> findByUserId(Long userId);

   /**
    * Finds an asset by user ID and coin ID.
    * 
    * @param userId The user ID.
    * @param coinId The coin ID.
    * @return The found asset.
    */
   Asset findByUserIdAndCoinId(Long userId, String coinId);

   /**
    * Finds an asset by ID and user ID.
    * 
    * @param assetId The asset ID.
    * @param userId  The user ID.
    * @return The found asset.
    */
   Asset findByIdAndUserId(Long assetId, Long userId);

   // Optional<Assets> findByUserIdAndSymbolAndPortfolioId(Long userId,String
   // symbol, Long portfolioId);
}
