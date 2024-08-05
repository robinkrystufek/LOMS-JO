function calcTranstions() {
    const selectedElement = ref_REDB_transitions;
    let jo2 = formRef.data.jo2;
    let jo4 = formRef.data.jo4;
    let jo6 = formRef.data.jo6;          
    if(formRef.data.radioInputType!="JO") {
        let iMtx = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        let sMtx = [0, 0, 0];
        for (let i = 0; i < formRef.data.dataGrid.length; i++) {
            const a = formRef.data.dataGrid[i];
            if (a.include) {
                iMtx[0][0] += 2 * Number(a.u2) * Number(a.u2);
                iMtx[0][1] += 2 * Number(a.u2) * Number(a.u4);
                iMtx[0][2] += 2 * Number(a.u2) * Number(a.u6);
                iMtx[1][0] += 2 * Number(a.u4) * Number(a.u2);
                iMtx[1][1] += 2 * Number(a.u4) * Number(a.u4);
                iMtx[1][2] += 2 * Number(a.u4) * Number(a.u6);
                iMtx[2][0] += 2 * Number(a.u6) * Number(a.u2);
                iMtx[2][1] += 2 * Number(a.u6) * Number(a.u4);
                iMtx[2][2] += 2 * Number(a.u6) * Number(a.u6);
                sMtx[0] += 2 * Number(a.u2) * Number(a.sExp);
                sMtx[1] += 2 * Number(a.u4) * Number(a.sExp);
                sMtx[2] += 2 * Number(a.u6) * Number(a.sExp);
            }
        }
        let outputMtx = math.multiply(math.inv(iMtx), sMtx);
        jo2 = outputMtx[0];
        jo4 = outputMtx[1];
        jo6 = outputMtx[2];
    }
    var reportString = "<table class='styled-table' style='width:100%'>";
    var exportCSVstring = "data:text/csv;charset=utf-8,Transition eState,Transition gState,Wavelength (nm),(ED),S(MD),A(ED),A(MD),Beta,Lifetime (ms)\n";
    reportString += "<thead><tr><th colspan='3'>Transition</th><th>Wavelength (nm)</th><th>S(ED)</th><th>S(MD)</th><th>A(ED)</th><th>A(MD)</th><th>Beta</th><th>Lifetime (ms)</th></tr></thead><tbody>";
    var currentEState = selectedElement[0].excitedState;
    var accumulatedA = 0;
    var accumulatedAlifetime = 0;
    var accumulationCount = 0;
    var tableTransitionsGen = [];
    for (var i = 0; i < selectedElement.length; i++) {
        const excited_state_index = ref_REDB.findIndex(element => element.excitedState == selectedElement[i].excitedState);
        const ground_state_index = ref_REDB.findIndex(element => element.excitedState == selectedElement[i].groundState);
        if (excited_state_index == undefined || ground_state_index == undefined) {
            console.log("State index not found", excited_state_index, ground_state_index);
            continue;
        }
        const excited_state_barycenter = formRef.data.dataGrid[excited_state_index].barycenter;
        const ground_state_barycenter = formRef.data.dataGrid[ground_state_index].barycenter;        
        if (excited_state_barycenter == undefined || ground_state_barycenter == undefined) {
            console.log("State value not found", excited_state_barycenter, ground_state_barycenter);
            continue;
        }
        selectedElement[i].wavenumber = excited_state_barycenter - ground_state_barycenter;
        const sellmeierN = Math.sqrt(
        formRef.data.const_sellmeier +
        (formRef.data.a_sellmeier *
            math.pow(10000 / selectedElement[i].wavenumber, 2)) /
        (math.pow(10000 / selectedElement[i].wavenumber, 2) -
            formRef.data.b_sellmeier) +
        (formRef.data.c_sellmeier *
            math.pow(10000 / selectedElement[i].wavenumber, 2)) /
        (math.pow(10000 / selectedElement[i].wavenumber, 2) -
            formRef.data.d_sellmeier)
        );
        const rowSMD = selectedElement[i].l2s * math.pow((constE * constH) / (4 * constPi * constM * constC), 2);
        const rowSED = selectedElement[i].u2 * jo2 + selectedElement[i].u4 * jo4 + selectedElement[i].u6 * jo6;
        const auxAED = (64* math.pow(constPi,4) *math.pow(constE,2))/(3*constH);
        const rowAED =
        (auxAED *
            sellmeierN *
            math.pow((sellmeierN * sellmeierN + 2)/3, 2) *
            rowSED) /
        ((2 * selectedElement[i].eState + 1) *
            math.pow(1 / selectedElement[i].wavenumber, 3));
        const rowAMD =
        (64 * math.pow(constPi, 4) * math.pow(sellmeierN, 3) * rowSMD) /
        (3 *
            constH *
            math.pow(1 / selectedElement[i].wavenumber, 3) *
            (2 * selectedElement[i].eState + 1));
        const rowAsum = rowAED + rowAMD;
        const rowWl = 1e7 / selectedElement[i].wavenumber;
        tableTransitionsGen.push({
            eState: selectedElement[i].excitedState,
            gState: selectedElement[i].groundState,
            wl: rowWl,
            rowSMD: rowSMD,
            rowSED: rowSED,
            rowAED: rowAED,
            rowAMD: rowAMD,
            beta: 0,
            tRad: 1000 / rowAsum,
        });
        if (currentEState == selectedElement[i].excitedState) {
            accumulatedA = accumulatedA + rowAsum;
            accumulationCount++;
        } 
        else {
            accumulatedAlifetime = 0;
            for (var j = 0; j < accumulationCount; j++) { // -1 correction is there because currently selected transition does not have the correct excited state anymore
                accumulatedAlifetime += tableTransitionsGen[i - 1 - j].rowAED + tableTransitionsGen[i - 1 - j].rowAMD;
                tableTransitionsGen[i - 1 - j].beta = (tableTransitionsGen[i - 1 - j].rowAED + tableTransitionsGen[i - 1 - j].rowAMD) / accumulatedA;
                tableTransitionsGen[i - 1 - j].tRad = 1000 / accumulatedAlifetime;
            }
            accumulatedA = rowAsum;
            currentEState = selectedElement[i].excitedState;
            accumulationCount = 1;
        }
    }
    accumulatedAlifetime = 0;
    for (var j = 0; j < accumulationCount; j++) {
        accumulatedAlifetime += tableTransitionsGen[i - 1 - j].rowAED + tableTransitionsGen[i - 1 - j].rowAMD;
        tableTransitionsGen[selectedElement.length - 1 - j].beta = (tableTransitionsGen[selectedElement.length - 1 - j].rowAED + tableTransitionsGen[selectedElement.length - 1 - j].rowAMD) / accumulatedA;
        tableTransitionsGen[i - 1 - j].tRad = 1000 / accumulatedAlifetime;
    }
    for (var i = 0; i < tableTransitionsGen.length; i++) {
        exportCSVstring +=
        tableTransitionsGen[i].eState +
        "," +
        tableTransitionsGen[i].gState +
        "," +
        tableTransitionsGen[i].wl.toFixed(1) +
        "," +
        tableTransitionsGen[i].rowSED.toPrecision(3) +
        "," +
        tableTransitionsGen[i].rowSMD.toPrecision(3) +
        "," +
        tableTransitionsGen[i].rowAED.toPrecision(3) +
        "," +
        tableTransitionsGen[i].rowAMD.toPrecision(3) +
        "," +
        tableTransitionsGen[i].beta.toPrecision(3) +
        "," +
        tableTransitionsGen[i].tRad.toPrecision(3) +
        "\n";
        reportString +=
        "<tr><td>" +
        tableTransitionsGen[i].eState +
        "</td><td>-</td><td>" +
        tableTransitionsGen[i].gState +
        "</td><td>" +
        tableTransitionsGen[i].wl.toFixed(1) +
        "</td><td>" +
        tableTransitionsGen[i].rowSED.toPrecision(3) +
        "</td><td>" +
        tableTransitionsGen[i].rowSMD.toPrecision(3) +
        "</td><td>" +
        tableTransitionsGen[i].rowAED.toPrecision(3) +
        "</td><td>" +
        tableTransitionsGen[i].rowAMD.toPrecision(3) +
        "</td><td>" +
        tableTransitionsGen[i].beta.toPrecision(3) +
        "</td><td>" +
        tableTransitionsGen[i].tRad.toPrecision(3) +
        "</td></tr>";
    }
    reportString += "</tbody></table>";
    formRef.getComponent("statTransitionsReport").component.content = reportString;
    linkTransitions = document.createElement("a");
    linkTransitions.setAttribute("href", encodeURI(exportCSVstring));
    if(formRef.data.sampleName != "") linkTransitions.setAttribute("download", formRef.data.sampleName + "_transitions_export.csv");
    else linkTransitions.setAttribute("download", "transitions_export.csv");
    document.body.appendChild(linkTransitions);
}
function calcCombinations() {
    document.getElementById("overlayloading").style.display = "block";
    showProgressBar();  
    calcCombinationsWorker();
} 
function calcCombinationsWorker() {
    const totalCombLimit = 10000000000;
    let countIncluded = 0;
    let reportString = "<table class='styled-table' style='width:100%'>";
    const countIncludedRows = ref_REDB.reduce((acc, _, i) => {
        if (formRef.data.dataGrid[i].include) {
            countIncluded++;
            acc.push(i);
        }
        return acc;
    }, []);
    let limitLowerComb = countIncluded - 1;
    let totalComb = 0;
    if (countIncluded > 4) {
        const limitedCombinations = new combinationsGen(countIncludedRows);
        let k = 0;
        let csvString = "data:text/csv;charset=utf-8,no,transitions_included,transitions_included_no,JO2,JO4,JO6\n";
        reportString += "<thead><tr><th></th><th colspan='" + countIncluded + "'>Transitions included</th><th>JO2</th><th>JO4</th><th>JO6</th><th>JO2/JO4</th><th>JO2/JO6</th><th>JO4/JO6</th></tr></thead><tbody>";
        var labelGraphList = [];
        var seriesData = {
            jo2: [],
            jo4: [],
            jo6: [],
            jo2jo4: [],
            jo2jo6: [],
            jo4jo6: []
        };
        var seriesDataY = {
            jo2: [],
            jo4: [],
            jo6: [],
            jo2jo4: [],
            jo2jo6: [],
            jo4jo6: []
        };
        //count target number of combinations
        var targetComb = 0;
        while (targetComb < totalCombLimit) {
            if (limitLowerComb < 4) break;
            targetComb += math.factorial(countIncluded) / (math.factorial(limitLowerComb) * math.factorial(countIncluded - limitLowerComb));
            limitLowerComb--;
        }
        progressPercent = 0;
        limitLowerComb = countIncluded - 1;
        while (totalComb < totalCombLimit) {
            if (limitLowerComb < 4) break;
            totalComb = math.factorial(countIncluded) / (math.factorial(limitLowerComb) * math.factorial(countIncluded - limitLowerComb));
            _combinations = limitedCombinations.combinations(limitLowerComb);
            while (true) {
                let item = [];
                if (k == 0) {
                    item.value = countIncludedRows;
                } 
                else {
                    item = _combinations.next();
                    if (item.done) break;
                }
                k++;
                const currentProgressPercent = Math.round((k / targetComb) * 40);
                if (currentProgressPercent > progressPercent) {
                    progressPercent = currentProgressPercent;
                    updateProgressBar(progressPercent);
                }
                let iMtx = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
                let sMtx = [0, 0, 0];
                reportString = reportString + "<tr><td>" + k + "</td>";
                let rowCountTransitions = 0;
                let labelGraph = "";
                let labelGraphNoFormat = "";
                let transListNoFormat = "";
                for (let i = 0; i < ref_REDB.length; i++) {
                    if (item.value.includes(i)) {
                        rowCountTransitions++;
                        const u2 = Number(formRef.data.dataGrid[i].u2);
                        const u4 = Number(formRef.data.dataGrid[i].u4);
                        const u6 = Number(formRef.data.dataGrid[i].u6);
                        const sExp = Number(formRef.data.dataGrid[i].sExp);
                        iMtx[0][0] += 2 * u2 * u2;
                        iMtx[0][1] += 2 * u2 * u4;
                        iMtx[0][2] += 2 * u2 * u6;
                        iMtx[1][0] += 2 * u4 * u2;
                        iMtx[1][1] += 2 * u4 * u4;
                        iMtx[1][2] += 2 * u4 * u6;
                        iMtx[2][0] += 2 * u6 * u2;
                        iMtx[2][1] += 2 * u6 * u4;
                        iMtx[2][2] += 2 * u6 * u6;
                        sMtx[0] += 2 * u2 * sExp;
                        sMtx[1] += 2 * u4 * sExp;
                        sMtx[2] += 2 * u6 * sExp;
                        reportString += `<td>${ref_REDB[i].excitedStateFormatted}</td>`;
                        labelGraph += `${ref_REDB[i].excitedStateFormatted} `;
                        labelGraphNoFormat += `${ref_REDB[i].excitedState} `;
                        transListNoFormat += `${(i)} `;
                    }
                }
                labelGraphList.push(labelGraph);
                for (let i = 0; i < countIncluded - rowCountTransitions; i++) {
                    reportString += "<td></td>";
                }
                let outputMtx = 0;
                let errorComp = false;
                try {
                    outputMtx = math.multiply(math.inv(iMtx), sMtx);
                } 
                catch (err) {
                    errorComp = true;
                    console.log(err.message);
                }
                if (errorComp) {
                    csvString += `${k},${labelGraphNoFormat},${transListNoFormat},N/A,N/A,N/A\n`;
                    reportString += "<td>N/A</td><td>N/A</td><td>N/A</td><td>N/A</td><td>N/A</td><td>N/A</td></tr>";
                } 
                else {
                    mtxCacheOutput = outputMtx;
                    csvString += `${k},${labelGraphNoFormat},${transListNoFormat},${mtxCacheOutput[0]},${mtxCacheOutput[1]},${mtxCacheOutput[2]}\n`;
                    seriesDataY.jo2.push(mtxCacheOutput[0]);
                    seriesDataY.jo4.push(mtxCacheOutput[1]);
                    seriesDataY.jo6.push( mtxCacheOutput[2]);
                    seriesData.jo2.push({ x: k, y: mtxCacheOutput[0] });
                    seriesData.jo4.push({ x: k, y: mtxCacheOutput[1] });
                    seriesData.jo6.push({ x: k, y: mtxCacheOutput[2] });
                    seriesData.jo2jo4.push({ x: k, y: mtxCacheOutput[0] / mtxCacheOutput[1] });
                    seriesData.jo2jo6.push({ x: k, y: mtxCacheOutput[0] / mtxCacheOutput[2] });
                    seriesData.jo4jo6.push({ x: k, y: mtxCacheOutput[1] / mtxCacheOutput[2] });
                    reportString += `<td>${mtxCacheOutput[0].toPrecision(3)}</td><td>${mtxCacheOutput[1].toPrecision(3)}</td><td>${mtxCacheOutput[2].toPrecision(3)}</td><td>${(mtxCacheOutput[0] / mtxCacheOutput[1]).toPrecision(3)}</td><td>${(mtxCacheOutput[0] / mtxCacheOutput[2]).toPrecision(3)}</td><td>${(mtxCacheOutput[1] / mtxCacheOutput[2]).toPrecision(3)}</td></tr>`;
                }
            }
            limitLowerComb--;
        }
        reportString = reportString + "</tbody></table>";
        linkCombinations = document.createElement("a");
        linkCombinations.setAttribute("href", encodeURI(csvString));
        if(formRef.data.sampleName != "") linkCombinations.setAttribute("download", formRef.data.sampleName + "_optimization_export.csv");
        else linkCombinations.setAttribute("download", "optimization_export.csv");
        document.body.appendChild(linkCombinations);
    } 
    else {
        reportString = "Only 4 options entered";
        document.getElementById("overlayloading").style.display = "none";
        hideProgressBar();
    }
    formRef.getComponent("statJOreport").component.content = reportString;
    const descAvg = ["avg: ", " cm² <i data-tooltip='Arithmetic mean' class='fa fa-question-circle text-muted' ref='tooltip' aria-expanded='false'></i>"];
    const descMedian = ["median: ", " cm² <i data-tooltip='Median' class='fa fa-question-circle text-muted' ref='tooltip' aria-expanded='false'></i>"];
    const descMedianBP = ["median BP: ", " cm² <i data-tooltip='Box plot median within 1.5 × 25-75 percentile range' class='fa fa-question-circle text-muted' ref='tooltip' aria-expanded='false'></i>"];
    const descSD = ["s.d.: ", " cm² <i data-tooltip='Standard deviation' class='fa fa-question-circle text-muted' ref='tooltip' aria-expanded='false'></i>"];
    const descCV = ["CV: ", "% <i data-tooltip='Coefficient of variation' class='fa fa-question-circle text-muted' ref='tooltip' aria-expanded='false'></i>"];
    formRef.getComponent('htmldivtablecontainer').component.content = "<table style='width:100%; text-align: center;'><tr><td>" + descAvg[0] + getAvg(seriesDataY.jo2).toPrecision(3) + descAvg[1] + "</td><td>" + descAvg[0] + getAvg(seriesDataY.jo4).toPrecision(3) + descAvg[1] + "</td><td>" + descAvg[0] + getAvg(seriesDataY.jo6).toPrecision(3) + descAvg[1] + "</td></tr><tr><td>" + descMedian[0] + getMedian(seriesDataY.jo2).toPrecision(3) + descMedian[1] + "</td><td>" + descMedian[0] + getMedian(seriesDataY.jo4).toPrecision(3) + descMedian[1] + "</td><td>" + descMedian[0] + getMedian(seriesDataY.jo6).toPrecision(3) + descMedian[1] + "</td></tr><tr><td>" + descMedianBP[0] + getMedianBoxPlot(seriesDataY.jo2).toPrecision(3) + descMedianBP[1] + "</td><td>" + descMedianBP[0] + getMedianBoxPlot(seriesDataY.jo4).toPrecision(3) + descMedianBP[1] + "</td><td>" + descMedianBP[0] + getMedianBoxPlot(seriesDataY.jo6).toPrecision(3) + descMedianBP[1] + "</td></tr><tr><td>" + descSD[0] + getStandardDeviation(seriesDataY.jo2).toPrecision(3) + descSD[1] + "</td><td>" + descSD[0] + getStandardDeviation(seriesDataY.jo4).toPrecision(3) + descSD[1] + "</td><td>" + descSD[0] + getStandardDeviation(seriesDataY.jo6).toPrecision(3) + descSD[1] + "</td></tr><tr><td>" + descCV[0] + (getStandardDeviation(seriesDataY.jo2)/getAvg(seriesDataY.jo2)*100).toPrecision(3) + descCV[1] + "</td><td>" + descCV[0] + (getStandardDeviation(seriesDataY.jo4)/getAvg(seriesDataY.jo4)*100).toPrecision(3) + descCV[1] + "</td><td>" + descCV[0] + (getStandardDeviation(seriesDataY.jo6)/getAvg(seriesDataY.jo6)*100).toPrecision(3) + descCV[1] + "</td></tr></table><br>";
    setTimeout(function () {
        progressPercent = 40;
        renderGraph(seriesData, labelGraphList);
    }, 100);    
}
// ancillary functions
function getStandardDeviation(array) {
    const n = array.length;
    const mean = array.reduce((a, b) => a + b) / n;
    return Math.sqrt(array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
}
function getAvg(array) {
    const n = array.length;
    return array.reduce((a, b) => a + b) / n;
}
function getMedian(array) {
    const sortedArray = array.slice().sort((a, b) => a - b);
    const n = sortedArray.length;
    const middleIndex = Math.floor(n / 2);
    if (n % 2 === 0) return (sortedArray[middleIndex - 1] + sortedArray[middleIndex]) / 2;
    else return sortedArray[middleIndex];
}
function getMedianBoxPlot(array) {
    const positiveArray = array.slice().filter((value) => value >= 0);
    const sortedArray = positiveArray.sort((a, b) => a - b);
    const n = sortedArray.length;
    const q1 = sortedArray[Math.ceil(0.25 * (n - 1))];
    const q3 = sortedArray[Math.ceil(0.75 * (n - 1))];
    const iqr = q3 - q1;
    const bottom = q1 - 1.5 * iqr < 0 ? 0 : q1 - 1.5 * iqr;
    const top = q3 + 1.5 * iqr;
    const filteredArray = positiveArray.filter((value) => value >= bottom && value <= top);
    return getMedian(filteredArray);
}
class combinationsGen {
    constructor(elements) {
        this.elements = elements;
    }
    *combinations(length, with_repetition = false, position = 0, elements = []) {
    const size = this.elements.length;
    for (let i = position; i < size; i++) {
        elements.push(this.elements[i]);
        if (elements.length === length) yield elements;
        else
        yield* this.combinations(
            length,
            with_repetition,
            with_repetition === true ? i : i + 1,
            elements
        );
        elements.pop();
    }
    }
}