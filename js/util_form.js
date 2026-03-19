// form functions
/**
 * @function changeRE
 * @returns {void}
 * Updates the active rare-earth reference data based on the currently selected tab.
 * Also rebuilds the transition row template, assigns MD correction values,
 * and updates the tooltip for the MD correction mode selector.
 */
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
    let correctionL2Slist = "";
    for (var i = 0; i < ref_REDB.length; i++) {
        const indexL2S = ref_REDB_transitions.findIndex(element => (element.groundState == ref_REDB[0].excitedState)&&(element.excitedState == ref_REDB[i].excitedState));
        let correctionL2S = 0;
        if (indexL2S != undefined && indexL2S != -1) {
            correctionL2S = ref_REDB_transitions[indexL2S].l2s;
            if(correctionL2S != 0) correctionL2Slist += ref_REDB[i].excitedStateFormatted + " ";
        }
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
        correctionL2S: correctionL2S
        });
        ref_REDB[i].correctionL2S = correctionL2S;
    }
    if (formRef!=0) formRef.getComponent("radioCorrectionMD").component.tooltip = "Choose which MD correction type to use. FED is the default correction, for FED+FMD the magnetic correction is implemented for: " + correctionL2Slist;
}
/**
 * @function clearInput
 * @returns {void}
 * Clears calculated or derived form input fields when switching away from a populated state.
 * Also hides the transitions result area and restores event-driven logic for showing it again.
 */
function clearInput() {
    if(formRef.data.radioIndexCalc == "direct") {
        formRef.data.const_sellmeier = "";
        formRef.data.a_sellmeier = "";
        formRef.data.b_sellmeier = "";
        formRef.data.c_sellmeier = "";
        formRef.data.d_sellmeier = "";
    }
    formRef.getComponent("transitionsWell").component.logic = [
        {
          name: "COclick",
          trigger: {
            type: "event",
            event: "calculateTransitions",
          },
          actions: [
            {
              name: "showTransitions",
              type: "property",
              property: {
                label: "Hidden",
                value: "hidden",
                type: "boolean",
              },
              state: false
            }
          ]
        }
    ];
    formRef.getComponent("transitionsWell").component.hidden = true;
}
/**
 * @function processChange
 * @param {Object} event - Form.io change event object.
 * @returns {void}
 * Handles form change events related to tab switching and input mode selection.
 * On tab change, updates active rare-earth data, refreshes the transition grid,
 * and redraws the form. On input type change, resets index calculation mode as needed.
 */
function processChange(event) {
    if (event.changed && event.changed.component.key === "tabs") {
        document.getElementById("overlayloading").style.display = "block";
        currentTab = event.changed.instance.currentTab;
        const urlParams = new URLSearchParams(window.location.search);
        if (listRE.indexOf(urlParams.get("RE")) != event.changed.instance.currentTab && formRef.data.radioInputType != "JO") clearInput();
        changeRE();
        formRef.data.dataGrid = elementTransitionArrayTemplate;
        formRef.triggerChange();
        formRef.triggerRedraw();
    }
    if (event.changed && event.changed.component.key === "radioInputType") {
        if(event.changed.value == "JO") formRef.data.radioIndexCalc = "sellmeier";
        else clearInput();        
    }
}
/**
 * @function processTabQuery
 * @returns {void}
 * Changes rare earth ion tab based on GET query from the URL.
 * e.g. ?RE=Sm
 */
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
/**
 * @function processAnalysisQuery
 * @returns {void}
 * Processes analysis GET query parameters from the URL and updates the form data accordingly.
 * e.g. ?n=1.585&jo2=0.4327&jo4=1.1224&jo6=1.0071&RE=Sm&sample_id=Record%201887%20(10.1016/j.jallcom.2026.186989)
 */
function processAnalysisQuery() {
    userLoginOverride = true;
    const urlParams = new URLSearchParams(window.location.search);
    const sampleId = urlParams.get("sample_id");
    if (sampleId) formRef.data.sampleName = sampleId;
    const n = urlParams.get("n");
    const jo2 = urlParams.get("jo2");
    const jo4 = urlParams.get("jo4");
    const jo6 = urlParams.get("jo6");
    if (n && jo2 && jo4 && jo6) {
        formRef.data.radioInputType = "JO";
        formRef.data.jo2 = jo2;
        formRef.data.jo4 = jo4;
        formRef.data.jo6 = jo6;
        formRef.data.radioIndexCalc = "sellmeier";
        formRef.data.const_sellmeier = n;
        formRef.data.a_sellmeier = 0;
        formRef.data.b_sellmeier = 0;
        formRef.data.c_sellmeier = 0;
        formRef.data.d_sellmeier = 0;
        formRef.emit("calculateTransitions");
        formRef.getComponent("transitionsWell").component.logic = []; 
        formRef.getComponent("transitionsWell").component.hidden = false;
        const panel = formRef.getComponent("transitionsSummary");
        panel.collapsed = false;
        panel.redraw();
        setTimeout(() => {
            const el = document.querySelector('.formio-component-showMore');
            if (!el) return;
            el.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }, 200);
    }
}    
// chart functions
/**
 * @function getOptions
 * @param {Array<string>} labelGraphList - Labels used for tooltip lookup and graph categories.
 * @param {Array<Object>} seriesJO - Series data objects with x/y values.
 * @param {string} seriesName - Display name of the plotted series.
 * @param {string} seriesColor - CSS color used for the series.
 * @returns {Object}
 * Builds and returns ApexCharts radar chart configuration for a single JO-derived series.
 * The chart is normalized relative to the first y-value, which is used as the baseline.
 */
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
/**
 * @function renderGraph
 * @param {Object} seriesData - Object containing all JO series datasets to plot.
 * @param {Array<string>} labelGraphList - Labels used for graph tooltips.
 * @returns {Promise<void>}
 * Renders up to six ApexCharts radar graphs into predefined chart containers.
 * Also updates the loading progress bar as each chart finishes rendering.
 */
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
/**
 * @function renderGraphAsync
 * @param {Object} element - ApexCharts instance to render.
 * @returns {Promise<void>}
 * Wraps chart rendering in a Promise so graphs can be rendered sequentially with await.
 */
function renderGraphAsync(element) {
    return new Promise(resolve => setTimeout(() => {
        element.render();
        resolve();
    }));
}