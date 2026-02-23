package com.himanshu.service;

import com.himanshu.model.Asset;
import com.himanshu.model.Coin;
import com.himanshu.model.User;

import java.util.List;

public interface AssetService {
    Asset createAsset(User user, Coin coin, double quantity);

    Asset getAssetById(Long assetId);

    Asset getAssetByUserAndId(Long userId, Long assetId);

    List<Asset> getUsersAssets(Long userId);

    Asset updateAsset(Long assetId, double quantity) throws Exception;

    /**
     * Finds an asset by user ID and coin ID.
     * 
     * @param userId The ID of the user.
     * @param coinId The ID of the coin.
     * @return The found Asset.
     * @throws Exception If asset not found.
     */
    Asset findAssetByUserIdAndCoinId(Long userId, String coinId) throws Exception;

    void deleteAsset(Long assetId);

}
