package com.himanshu.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO to represent a single data point in a market chart.
 * Contains timestamp and price information.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketChartData {
    private long timestamp;
    private double price;

}
