import React from "react";
import { LineChart } from "@gooddata/sdk-ui-charts";
import { DateFilterHelpers } from "@gooddata/sdk-ui-filters";

import styles from "./ContentChart.module.scss";

export const ContentChart = ({
    selectedFilter,
    excludeCurrentPeriod,
    dateDataSet,
    productCategory,
    revenue,
    trend,
    checkData
}) => {
    
    const dateFilter = DateFilterHelpers.mapOptionToAfm(
        selectedFilter,
        dateDataSet,
        excludeCurrentPeriod,
    );

    return (
        <div className={styles.contentChart}>
            <LineChart
                measures={[revenue]}
                trendBy={trend}
                segmentBy={productCategory}
                filters={dateFilter ? [dateFilter] : []}
                onExportReady={(getExportedData) => {
                    checkData(getExportedData);
                }}
            />
        </div>
    );
};

export default ContentChart;
