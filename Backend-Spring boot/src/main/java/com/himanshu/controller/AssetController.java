package com.himanshu.controller;

import com.himanshu.exception.UserException;
import com.himanshu.model.Asset;
import com.himanshu.model.User;
import com.himanshu.service.AssetService;

import com.himanshu.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
public class AssetController {
    private final AssetService assetService;
    @Autowired
    private UserService userService;

    @Autowired
    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    /**
     * Retrieves an asset by its ID.
     * 
     * @param assetId The ID of the asset.
     * @return The asset details.
     */
    @GetMapping("/{assetId}")
    public ResponseEntity<Asset> getAssetById(@PathVariable Long assetId) {
        Asset asset = assetService.getAssetById(assetId);
        return ResponseEntity.ok().body(asset);
    }

    /**
     * Retrieves a specific asset for a user by coin ID.
     * 
     * @param coinId The ID of the coin.
     * @param jwt    The JWT token of the authenticated user.
     * @return The asset details.
     * @throws Exception If user or asset not found.
     */
    @GetMapping("/coin/{coinId}/user")
    public ResponseEntity<Asset> getAssetByUserIdAndCoinId(
            @PathVariable String coinId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);
        Asset asset = assetService.findAssetByUserIdAndCoinId(user.getId(), coinId);
        return ResponseEntity.ok().body(asset);
    }

    /**
     * Retrieves all assets belonging to the authenticated user.
     * 
     * @param jwt The JWT token of the authenticated user.
     * @return A list of assets owned by the user.
     * @throws UserException If user is not found.
     */
    @GetMapping()
    public ResponseEntity<List<Asset>> getAssetsForUser(
            @RequestHeader("Authorization") String jwt) throws UserException {
        User user = userService.findUserProfileByJwt(jwt);
        List<Asset> assets = assetService.getUsersAssets(user.getId());
        return ResponseEntity.ok().body(assets);
    }
}
