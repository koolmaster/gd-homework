import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import Page from "../components/Page";
import { DateFilter, defaultDateFilterOptions, DateFilterHelpers } from "@gooddata/sdk-ui-filters";
import { modifyAttribute } from "@gooddata/sdk-model";
import ContentChart from "../components/ContentChart";
import SideBar from "../components/SideBar";

import * as Md from "../md/full";

import styles from "./Home.module.scss";

const Home = () => {
    defaultDateFilterOptions.absoluteForm = {
        localIdentifier: "ABSOLUTE_FORM",
        type: "absoluteForm",
        from: "2016-01-01",
        to: "2020-12-31",
        name: "Select year",
        visible: true,
    };
    const { i18n } = useTranslation();
    const [state, setState] = useState({
        selectedFilterOption: defaultDateFilterOptions.allTime,
        titleDate: "All Time",
        isYear: false,
        excludeCurrentPeriod: false,
    });
    const [noData, setNoData] = useState(false);
    const monthDate = modifyAttribute(Md.DateDatasets.Date.Month.Short, (a) => a.alias("Month"));

    const onApply = (selectedFilterOption, excludeCurrentPeriod) => {
        setState({
            selectedFilterOption,
            titleDate: DateFilterHelpers.getDateFilterTitle(selectedFilterOption, "en-US", "dd/MM/yyyy"),
            isYear: selectedFilterOption.localIdentifier === "ABSOLUTE_FORM",
            excludeCurrentPeriod,
        });
    };

    const checkData = async (getExportedData) => {
        try {
            const result = await getExportedData({
                format: "xlsx",
                includeFilterContext: true,
                mergeHeaders: true,
                title: "CustomTitle",
            });
            if (result.uri) {
                setNoData(false);
            }
        } catch (error) {
            setNoData(true);
        }
    };

    return (
        <Page mainClassName="s-home">
            <h2>{i18n.t('my.dashboard')} - {state.titleDate}</h2>
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
                <ContentChart
                    selectedFilter={state.selectedFilterOption}
                    excludeCurrentPeriod={state.excludeCurrentPeriod}
                    checkData={checkData}
                    dateDataSet={Md.DateDatasets.Date.ref}
                    productCategory={Md.ProductCategory}
                    revenue={Md.Revenue}
                    trend={state.isYear ? Md.DateMonthYear.Short : Md.DateMonth.Short}
                />
                <SideBar
                    noData={noData}
                    monthDate={monthDate}
                    revenue={Md.Revenue}
                    productCategory={Md.ProductCategory}
                />
            </div>
        </Page>
    );
};

export default Home;
