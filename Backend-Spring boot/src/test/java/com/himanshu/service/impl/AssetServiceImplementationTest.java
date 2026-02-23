package com.himanshu.service.impl;

import com.himanshu.model.Asset;
import com.himanshu.model.Coin;
import com.himanshu.model.User;
import com.himanshu.repository.AssetsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssetServiceImplementationTest {

    @Mock
    private AssetsRepository assetRepository;

    @InjectMocks
    private AssetServiceImplementation assetService;

    private User user;
    private Coin coin;
    private Asset asset;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);

        coin = new Coin();
        coin.setId("bitcoin");
        coin.setCurrentPrice(50000.0);

        asset = new Asset();
        asset.setId(1L);
        asset.setUser(user);
        asset.setCoin(coin);
        asset.setQuantity(1.0);
        asset.setBuyPrice(50000.0);
    }

    @Test
    void testCreateAsset() {
        when(assetRepository.save(any(Asset.class))).thenReturn(asset);

        Asset createdAsset = assetService.createAsset(user, coin, 1.0);

        assertNotNull(createdAsset);
        assertEquals(1.0, createdAsset.getQuantity());
        verify(assetRepository, times(1)).save(any(Asset.class));
    }

    @Test
    void testGetAssetById_Found() {
        when(assetRepository.findById(1L)).thenReturn(Optional.of(asset));

        Asset foundAsset = assetService.getAssetById(1L);

        assertNotNull(foundAsset);
        assertEquals(1L, foundAsset.getId());
    }

    @Test
    void testGetAssetById_NotFound() {
        when(assetRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> assetService.getAssetById(1L));
    }

    @Test
    void testGetAssetByUserAndId() {
        when(assetRepository.findByIdAndUserId(1L, 1L)).thenReturn(asset);

        Asset foundAsset = assetService.getAssetByUserAndId(1L, 1L);

        assertNotNull(foundAsset);
        assertEquals(1L, foundAsset.getId());
    }

    @Test
    void testGetUsersAssets() {
        when(assetRepository.findByUserId(1L)).thenReturn(Arrays.asList(asset));

        List<Asset> assets = assetService.getUsersAssets(1L);

        assertEquals(1, assets.size());
    }

    @Test
    void testUpdateAsset() throws Exception {
        when(assetRepository.findById(1L)).thenReturn(Optional.of(asset));
        when(assetRepository.save(any(Asset.class))).thenReturn(asset);

        Asset updatedAsset = assetService.updateAsset(1L, 2.0);

        assertEquals(3.0, updatedAsset.getQuantity()); // 1.0 + 2.0
    }

    @Test
    void testUpdateAsset_NotFound() {
        when(assetRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(Exception.class, () -> assetService.updateAsset(1L, 2.0));
    }

    @Test
    void testFindAssetByUserIdAndCoinId() throws Exception {
        when(assetRepository.findByUserIdAndCoinId(1L, "bitcoin")).thenReturn(asset);

        Asset foundAsset = assetService.findAssetByUserIdAndCoinId(1L, "bitcoin");

        assertNotNull(foundAsset);
    }

    @Test
    void testDeleteAsset() {
        doNothing().when(assetRepository).deleteById(1L);

        assetService.deleteAsset(1L);

        verify(assetRepository, times(1)).deleteById(1L);
    }
}
