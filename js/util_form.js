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
    formRef.getComponent("combOptimizationWell").component.logic = [
        {
            name: "COclick",
            trigger: {
              type: "event",
              event: "calculateCombinations",
            },
            actions: [
                {
                name: "showCO",
                type: "property",
                property: {
                    label: "Hidden",
                    value: "hidden",
                    type: "boolean",
                },
                state: false,
                },
            ],
        }
    ];
    formRef.getComponent("combOptimizationWell").component.hidden = true;    
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
 * Hides the loading overlay if no analysis import is requested and analysis is complete.
 */
function hideLoadingOverlay() {
    if(!analysisImportRequested && analysisComplete) document.getElementById("overlayloading").style.display = "none";
}
/**
 * @function processAnalysisQuery
 * @returns {void}
 * Processes analysis GET query parameters from the URL and updates the form data accordingly.
 * e.g. ?n=1.585&jo2=0.4327&jo4=1.1224&jo6=1.0071&RE=Sm&sample_id=Record%201887%20(10.1016/j.jallcom.2026.186989)
 *      ?RE=Er&sample_id=Er_fEXP_Hrabovsky2025&input=Reference%20data%20for%20Er%20-%20see%20www.loms.cz%20documentation%20for%20more%20details%2C%2C%2C%2C%2C%2C%2C%0D%0Aref_index_type%2Csellmeier%2C%2C%2C%2C%2C%2C%0D%0Asellmeier_A%2C1%2C%2C%2C%2C%2C%2C%0D%0Asellmeier_B1%2C2.644%2C%2C%2C%2C%2C%2C%0D%0Asellmeier_C1%2C0.0222%2C%2C%2C%2C%2C%2C%0D%0Asellmeier_B2%2C0.085%2C%2C%2C%2C%2C%2C%0D%0Asellmeier_C2%2C0.091%2C%2C%2C%2C%2C%2C%0D%0AData%20source%3A%20oscillator%20strength%20(fexp)%20for%20calculation%20of%20JO2%2C%20JO4%20and%20JO6%20parameters%20and%20radiative%20properties%20Hrabovsky%20(2024)%2C%2C%2C%2C%2C%2C%0D%0Aexcited_state%2Cu2%2Cu4%2Cu6%2Cfexp%2Cmean_peak_wl_nm%2Crefractive_index%2Cbarycenter%0D%0A4I15%2F2%2C0%2C0%2C0%2C0%2C0%2C%2C109%0D%0A4I13%2F2%2C0.0194984%2C0.1173353%2C1.4316383%2C0.00000219974%2C1520%2C%2C6570%0D%0A4I11%2F2%2C0.0281916%2C0.0003049%2C0.3952644%2C0.000000848%2C974%2C%2C10202%0D%0A4I9%2F2%2C0.1181329%2C0%2C0.0099097%2C0.000000623%2C801%2C%2C12412%0D%0A4F9%2F2%2C0%2C0.5353863%2C0.4617945%2C0.000003799%2C655%2C%2C15237%0D%0A4S3%2F2%2C0%2C0%2C0.2211363%2C0.000000681%2C544%2C%2C18359%0D%0A2H11%2F2%2C0.712554%2C0.4123647%2C0.0924666%2C0.00001714%2C521%2C%2C19110%0D%0A4F7%2F2%2C0%2C0.1468776%2C0.6265381%2C0.000002636%2C489%2C%2C20448%0D%0A4F5%2F2%2C0%2C0%2C0.2232101%2C0%2C453.0216544%2C%2C22074%0D%0A4F3%2F2%2C0%2C0%2C0.1272004%2C0%2C445.990545%2C%2C22422%0D%0A2H9%2F2%2C0%2C0.0189597%2C0.2255537%2C0%2C408.0799837%2C%2C24505%0D%0A4G11%2F2%2C0.918357%2C0.5260874%2C0.117176%2C0%2C377.4154589%2C%2C26496%0D%0A4G9%2F2%2C0%2C0.2415402%2C0.1234371%2C0%2C363.9275056%2C%2C27478%0D%0A2K15%2F2%2C0.0219741%2C0.004095%2C0.0757543%2C0%2C359.6992914%2C%2C27801%0D%0A2G7%2F2%2C0%2C0.0174109%2C0.1163147%2C0%2C357.4109153%2C%2C27979%0D%0A2P3%2F2%2C0%2C0%2C0.0172%2C0%2C315.9258206%2C%2C31653%0D%0A2K13%2F2%2C0.0032%2C0.0029%2C0.0152%2C0%2C302.2517757%2C%2C33085%0D%0A4G5%2F2%2C0%2C0%2C0.0026%2C0%2C299.4998353%2C%2C33389%0D%0A2P1%2F2%2C0%2C0%2C0%2C0%2C298.9268526%2C%2C33453%0D%0A4G7%2F2%2C0%2C0.0334%2C0.0029%2C0%2C293.9274587%2C%2C34022%0D%0A2D5%2F2%2C0%2C0%2C0.0228%2C0%2C287.3563218%2C%2C34800%0D%0A
 */
function processAnalysisQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    const cjo = urlParams.get("cjo");
    
    if(cjo && queryImportComplete && !analysisComplete && progressPercent == 0) {
        analysisImportRequested = cjo;
        formRef.emit("calculateCombinations"); //calcCombinations();
        formRef.getComponent("combOptimizationWell").component.logic = []; 
        formRef.getComponent("combOptimizationWell").component.hidden = false;
        analysisImportRequested = false;
        setTimeout(() => {
            const el = document.querySelector('#chartTableContainer');
            if (!el) return;
            const y = el.getBoundingClientRect().top;
            window.scrollTo({
              top: y,
              behavior: 'instant'
            });
          }, 200);
    }
    if (queryImportComplete) return;
    if(!cjo) analysisComplete = true;
    queryImportComplete = true;
    userLoginOverride = true;
    
    const sampleId = urlParams.get("sample_id") || "";
    const input = urlParams.get("input");
    
    if(input) {
        formRef.data.sampleName = sampleId;
        let inputStr = decodeURIComponent(input);
        if (!inputStr) return;
        let arrImport = CSVToArray(inputStr, ",");
        var panel = formRef.getComponent("dataImportPanel");
        panel.collapsed = true;
        importArrayCSV(arrImport);      
        return;
    }
    const n = urlParams.get("n");
    const jo2 = urlParams.get("jo2");
    const jo4 = urlParams.get("jo4");
    const jo6 = urlParams.get("jo6");
    if (n && jo2) {
        formRef.data.sampleName = sampleId;
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
            const el = document.querySelector('.formio-component-downloadReportJO');
            if (!el) return;
            const y = el.getBoundingClientRect().top - 104;
            window.scrollTo({
              top: y,
              behavior: 'instant'
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
                if(progressPercent >= 100) {
                    progressPercent = 0;
                    hideProgressBar();
                    document.getElementById("overlayloading").style.display = "none";
                    analysisComplete = true;
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