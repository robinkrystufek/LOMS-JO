// form functions
function changeRE() {
    switch (currentTab) {
        case 0:
        ref_REDB = elementJson.Er;
        ref_REDB_transitions = transitionsElementJson.Er;
        break;
        case 1:
        ref_REDB = elementJson.Dy;
        ref_REDB_transitions = transitionsElementJson.Dy;
        break;
        case 2:
        ref_REDB = elementJson.Eu;
        ref_REDB_transitions = transitionsElementJson.Eu;
        break;
        case 3:
        ref_REDB = elementJson.Gd;
        ref_REDB_transitions = transitionsElementJson.Gd;
        break;
        case 4:
        ref_REDB = elementJson.Ho;
        ref_REDB_transitions = transitionsElementJson.Ho;
        break;
        case 5:
        ref_REDB = elementJson.Nd;
        ref_REDB_transitions = transitionsElementJson.Nd;
        break;
        case 6:
        ref_REDB = elementJson.Pm;
        ref_REDB_transitions = transitionsElementJson.Pm;
        break;
        case 7:
        ref_REDB = elementJson.Pr;
        ref_REDB_transitions = transitionsElementJson.Pr;
        break;
        case 8:
        ref_REDB = elementJson.Sm;
        ref_REDB_transitions = transitionsElementJson.Sm;
        break;
        case 9:
        ref_REDB = elementJson.Tb;
        ref_REDB_transitions = transitionsElementJson.Tb;
        break;
        case 10:
        ref_REDB = elementJson.Tm;
        ref_REDB_transitions = transitionsElementJson.Tm;
        break;
    }
    re_edit = listRE[currentTab];
    elementTransitionArrayTemplate = [];
    for (var i = 0; i < ref_REDB.length; i++) {
        elementTransitionArrayTemplate.push({
        excitedStateRow: ref_REDB[i],
        u2: ref_REDB[i].u2.toPrecision(5),
        u4: ref_REDB[i].u4.toPrecision(5),
        u6: ref_REDB[i].u6.toPrecision(5),
        integratedCrossSectionCm2: "",
        meanPeakWavelengthNm: ref_REDB[i].wavelength.toPrecision(5),
        barycenter: ref_REDB[i].barycenter.toPrecision(5),
        refractiveIndex: "",
        fExp: "",
        sExp: "",
        fCalc: "",
        sCalc: "",
        });
    }
}
function clearInput() {
    formRef.data.radioIndexCalc = "direct";
    formRef.data.const_sellmeier = "";
    formRef.data.a_sellmeier = "";
    formRef.data.b_sellmeier = "";
    formRef.data.c_sellmeier = "";
    formRef.data.d_sellmeier = "";
}
function processChange(event) {
    if (event.changed && event.changed.component.key === "tabs" && currentTab != event.changed.instance.currentTab) {
        document.getElementById("overlayloading").style.display = "block";
        currentTab = event.changed.instance.currentTab;
        clearInput();
        changeRE();
        formRef.data.dataGrid = elementTransitionArrayTemplate;
        formRef.triggerChange();
        formRef.triggerRedraw();
    }
    if (event.changed && event.changed.component.key === "radioInputType" && event.changed.value == "JO") {
        form.data.radioIndexCalc = "sellmeier";
        formRef.triggerChange();
        formRef.triggerRedraw();
    }
}
function processTabQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    re_edit = urlParams.get("RE");
    if (re_edit == null) re_edit = "Er";
    currentTab = listRE.indexOf(re_edit);
    if (currentTab === -1) currentTab = 0;
    ref_REDB = elementJson[re_edit];
    ref_REDB_transitions = transitionsElementJson[re_edit];
    changeRE();
}    
// chart functions
function getOptions(labelGraphList, seriesJO, seriesName, seriesColor) {
    const multiplier = 1.1;
    const baseline = seriesJO[0].y;
    const values = seriesJO.map((a) => a.y);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(max - baseline, baseline - min);
    const minSeries = -(range * multiplier);
    const maxSeries = range * multiplier;
    const options = {
        colors: [seriesColor],
        tooltip: {
        x: {
            formatter: function (value) {
            return labelGraphList[value - 1];
            },
            show: true,
        },
        y: {
            formatter: function (value) {
            if (value !== undefined) return (value + baseline).toPrecision(4);
            else return "";
            },
            show: true,
        },
        },
        yaxis: {
        min: minSeries,
        max: maxSeries,
        tickAmount: 4,
        labels: {
            formatter: function (value) {
            if (seriesName.includes("/")) {
                return (value + baseline).toPrecision(2);
            } else {
                return (value + baseline).toPrecision(2) + " cm²";
            }
            },
        },
        },
        xaxis: {
        categories: seriesJO.map((a) => a.x),
        tickAmount: 0,
        labels: {
            formatter: function (value) {
            return "";
            },
        },
        },
        series: [
        { name: seriesName, data: seriesJO.map((a) => a.y - baseline) },
        ],
        chart: {
        animations: {
            enabled: true,
            easing: "easeinout",
            speed: 1,
            dynamicAnimation: {
            enabled: true,
            speed: 350,
            },
        },
        height: 460,
        type: "radar",
        id: "areachart" + seriesName.replace("/", ""),
        },
        dataLabels: {
        enabled: false,
        },
        stroke: {
        curve: "smooth",
        width: 2,
        },
        grid: {
        padding: {
            right: 30,
            left: 20,
        },
        },
        title: {
        text: seriesName,
        align: "left",
        },
        fill: {
        fillOpacity: 0,
        opacity: 0,
        colors: "rgba(42, 158, 251, 0)",
        },
        markers: {
        fillOpacity: 0,
        strokeOpacity: 0,
        colors: "rgba(42, 158, 251, 0)",
        strokeColors: "rgba(42, 158, 251, 0)",
        },
    };
    return options;
}
async function renderGraph(seriesData, labelGraphList) {
    const chartIds = ["#chart1", "#chart2", "#chart3", "#chart4", "#chart5", "#chart6"];
    const chartOptions = [
        getOptions(labelGraphList, seriesData.jo2, "JO2", "rgb(255, 71, 125)"),
        getOptions(labelGraphList, seriesData.jo4, "JO4", "rgb(125, 255, 71)"),
        getOptions(labelGraphList, seriesData.jo6, "JO6", "rgb(71, 125, 255)"),
        getOptions(labelGraphList, seriesData.jo2jo4, "JO2/JO4", "rgb(155, 71, 175)"),
        getOptions(labelGraphList, seriesData.jo2jo6, "JO2/JO6", "rgb(175, 155, 71)"),
        getOptions(labelGraphList, seriesData.jo4jo6, "JO4/JO6", "rgb(71, 175, 155)")
    ];
    for (let i = 0; i < chartIds.length; i++) {
        const chartElement = document.querySelector(chartIds[i]);
        if (chartElement) {
            chartElement.innerHTML = "";
            window[`chart${i+1}`] = new ApexCharts(chartElement, chartOptions[i]);
            await renderGraphAsync(window[`chart${i+1}`]).then(() => {
                progressPercent += 10;
                updateProgressBar(progressPercent);
                if(progressPercent == 100) {
                    document.getElementById("overlayloading").style.display = "none";
                    progressPercent = 0;
                    hideProgressBar();
                }
            });
        }
    }
}
function renderGraphAsync(element) {
    return new Promise(resolve => setTimeout(() => {
        element.render();
        resolve();
    }));
}