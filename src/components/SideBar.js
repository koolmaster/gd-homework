import React, { useState } from "react";
import { useTranslation } from 'react-i18next';

import { mapValues, groupBy, sortBy } from "lodash";
import { useExecution, useDataView } from "@gooddata/sdk-ui";

import styles from "./SideBar.module.scss";

export const SideBar = ({ noData, monthDate, revenue, productCategory }) => {
    const [sideBar, setSideBar] = useState({});
    const [sort, setSort] = useState("MAX");
    const [isLoading, setIsLoading] = useState(true);
    const { i18n } = useTranslation();
    const configEx = {
        seriesBy: [revenue],
        slicesBy: [productCategory, monthDate],
    };
    const onLoading = () => {
        setIsLoading(true);
    };
    const onSuccess = (data) => {
        const result = data
            .data()
            .series()
            .firstForMeasure(revenue)
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
    return (
        <div className={styles.sideBar}>
            {isLoading && <div>loading....</div>}
            {noData ? (
                <div>N/A</div>
            ) : (
                <>
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
                            <select defaultValue={sort} onChange={(e) => setSort(e.target.value)}>
                                <option value="MAX">
                                    {i18n.t('maximum.revenue')}
                                </option>
                                <option value="MIN">{i18n.t('minimum.revenue')}</option>
                            </select>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default SideBar;
