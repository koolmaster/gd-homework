import React, { useState } from "react";
import { mapValues, groupBy, sortBy } from "lodash";
import Page from "../components/Page";
import { DateFilter, defaultDateFilterOptions, DateFilterHelpers } from "@gooddata/sdk-ui-filters";
import { modifyMeasure, modifyAttribute } from "@gooddata/sdk-model";
import { LineChart } from "@gooddata/sdk-ui-charts";

import { useExecution, useDataView, useExecutionDataView } from "@gooddata/sdk-ui";

import * as Md from "../md/full";

import styles from "./Home.module.scss";

const Home = () => {
    const [state, setState] = useState({
        selectedFilterOption: defaultDateFilterOptions.allTime,
        titleDate: "",
        excludeCurrentPeriod: false,
    });
    const [sideBar, setSideBar] = useState({});
    const [sort, setSort] = useState("MAX");
    const [isLoading, setIsLoading] = useState(true);
    const revenueClothing = modifyMeasure(Md.RevenueClothing, (m) =>
        m.format("#,##0").title("Revenue Clothing"),
    );
    const revenueElectronic = modifyMeasure(Md.RevenueElectronic, (m) =>
        m.format("#,##0").title("Revenue Electronic"),
    );
    const revenueHome = modifyMeasure(Md.RevenueHome, (m) => m.format("#,##0").title("Revenue Home"));
    const revenueOutdoor = modifyMeasure(Md.RevenueOutdoor, (m) =>
        m.format("#,##0").title("Revenue Outdoor"),
    );
    const measures = [revenueClothing, revenueElectronic, revenueHome, revenueOutdoor];
    const monthDate = modifyAttribute(Md.DateDatasets.Date.Month.Short, (a) => a.alias("Month"));

    const dateFilter = DateFilterHelpers.mapOptionToAfm(
        state.selectedFilterOption,
        Md.DateDatasets.Date.ref,
        state.excludeCurrentPeriod,
    );

    const configEx = {
        seriesBy: [Md.Revenue],
        slicesBy: [Md.ProductCategory, monthDate],
    };
    const onLoading = () => {
        setIsLoading(true);
    };
    const onSuccess = (data) => {
        const result = data
            .data()
            .series()
            .firstForMeasure(Md.Revenue)
            .dataPoints()
            .map((dataPoint) => {
                const temp = {
                    name: dataPoint.sliceDesc.headers[0].attributeHeaderItem.name,
                    value: dataPoint.formattedValue(),
                };
                return temp;
            });
        const sortResult = mapValues(groupBy(result, "name"), (v) =>
            sortBy(v, [
                function (o) {
                    return Number(o.value.replace(/(^\$|,)/g, ""));
                },
            ]),
        );
        setIsLoading(false);
        setSideBar(sortResult);
    };
    useDataView(
        {
            execution: useExecution(configEx),
            onLoading: onLoading,
            onSuccess: onSuccess,
        },
        [],
    );

    const onApply = (selectedFilterOption, excludeCurrentPeriod) => {
        setState({
            selectedFilterOption,
            titleDate: DateFilterHelpers.getDateFilterTitle(selectedFilterOption, "en-US", "dd/MM/yyyy"),
            excludeCurrentPeriod,
        });
    };

    return (
        <Page>
            <h2>My Dashboard {state.titleDate}</h2>
            <div className={styles.filterBar}>
                <DateFilter
                    excludeCurrentPeriod={state.excludeCurrentPeriod}
                    selectedFilterOption={state.selectedFilterOption}
                    filterOptions={defaultDateFilterOptions}
                    customFilterName="Data filter"
                    dateFilterMode="active"
                    dateFormat="MM/dd/yyyy"
                    onApply={onApply}
                />
            </div>
            <div className={styles.wrapperChart}>
                <div className={styles.contentChart}>
                    <LineChart
                        measures={measures}
                        trendBy={Md.DateMonth.Short}
                        filters={dateFilter ? [dateFilter] : []}
                    />
                </div>
                <div className={styles.sideBar}>
                    {isLoading && <div>loading....</div>}
                    {!isLoading && (
                        <>
                            <ul className={styles.listTotal}>
                                {Object.keys(sideBar)?.map((data, idx) => {
                                    const root =
                                        sort === "MAX"
                                            ? sideBar[data][sideBar[data].length - 1]
                                            : sideBar[data][0];
                                    return (
                                        <li key={idx}>
                                            <p>{root.name}</p>
                                            <p>{root.value}</p>
                                        </li>
                                    );
                                })}
                            </ul>
                            <select onChange={(e) => setSort(e.target.value)}>
                                <option value="">Calculation Selector</option>
                                <option value="MAX">Maximum Revenue across different products</option>
                                <option value="MIN">Minimum Revenue across different products</option>
                            </select>
                        </>
                    )}
                </div>
            </div>
        </Page>
    );
};

export default Home;
