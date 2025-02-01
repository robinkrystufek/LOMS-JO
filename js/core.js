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
    progressPercent = 10;
    updateProgressBar(progressPercent);
    setTimeout(function () {
        calcCombinationsWorker();
    }, 100); 
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
        let csvString = "data:text/csv;charset=utf-8,no,transitions_included,transitions_included_no,JO2,JO4,JO6,RMS,lifetime_ms\n";
        reportString += "<thead><tr><th></th><th colspan='" + countIncluded + "'>Transitions included</th><th>JO2</th><th>JO4</th><th>JO6</th><th>JO2/JO4</th><th>JO2/JO6</th><th>JO4/JO6</th><th>RMS</th><th>Lifetime (ms)</th></tr></thead><tbody>";
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
            jo4jo6: [],
            lifetime: []
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
                const currentProgressPercent = Math.round((k / targetComb) * 30) + 10;
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
                let rowRMS = 0;
                for (let i = 0; i < ref_REDB.length; i++) {
                    if (item.value.includes(i)) {
                        rowCountTransitions++;
                        const u2 = Number(formRef.data.dataGrid[i].u2);
                        const u4 = Number(formRef.data.dataGrid[i].u4);
                        const u6 = Number(formRef.data.dataGrid[i].u6);
                        const sExp = Number(formRef.data.dataGrid[i].sExp);
                        const sCalc = Number(formRef.data.dataGrid[i].sCalc);
                        const fExp = Number(formRef.data.dataGrid[i].fExp);
                        const fCalc = Number(formRef.data.dataGrid[i].fCalc);
                        rowRMS += math.pow(fExp - fCalc, 2);
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
                rowRMS = math.sqrt(rowRMS / (rowCountTransitions-3));
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
                if (errorComp || outputMtx[0] == NaN || outputMtx[1] == NaN || outputMtx[2] == NaN) {
                    csvString += `${k},${labelGraphNoFormat},${transListNoFormat},N/A,N/A,N/A,N/A,N/A\n`;
                    reportString += "<td>N/A</td><td>N/A</td><td>N/A</td><td>N/A</td><td>N/A</td><td>N/A</td><td>N/A</td><td>N/A</td></tr>";
                } 
                else {
                    const excited_state_index = ref_REDB.findIndex(element => element.excitedState == ref_REDB_transitions[0].excitedState);
                    const ground_state_index = ref_REDB.findIndex(element => element.excitedState == ref_REDB_transitions[0].groundState);
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
                    ref_REDB_transitions[0].wavenumber = excited_state_barycenter - ground_state_barycenter;
                    const sellmeierN = Math.sqrt(
                        formRef.data.const_sellmeier +
                        (formRef.data.a_sellmeier *
                            Math.pow(10000 / ref_REDB_transitions[0].wavenumber, 2)) /
                        (Math.pow(10000 / ref_REDB_transitions[0].wavenumber, 2) -
                            formRef.data.b_sellmeier) +
                        (formRef.data.c_sellmeier *
                            Math.pow(10000 / ref_REDB_transitions[0].wavenumber, 2)) /
                        (Math.pow(10000 / ref_REDB_transitions[0].wavenumber, 2) -
                            formRef.data.d_sellmeier)
                    );
                    const rowSMD = ref_REDB_transitions[0].l2s * math.pow((constE * constH) / (4 * constPi * constM * constC), 2);
                    const rowSED = ref_REDB_transitions[0].u2 * mtxCacheOutput[0] + ref_REDB_transitions[0].u4 * mtxCacheOutput[1] + ref_REDB_transitions[0].u6 * mtxCacheOutput[2];
                    const auxAED = (64 * Math.pow(constPi, 4) * Math.pow(constE, 2)) / (3 * constH);
                    const rowAED =
                        (auxAED *
                            sellmeierN *
                            Math.pow((sellmeierN * sellmeierN + 2) / 3, 2) *
                            rowSED) /
                        ((2 * ref_REDB_transitions[0].eState + 1) *
                            Math.pow(1 / ref_REDB_transitions[0].wavenumber, 3));
                    const rowAMD =
                        (64 * Math.pow(constPi, 4) * Math.pow(sellmeierN, 3) * rowSMD) /
                        (3 *
                            constH *
                            Math.pow(1 / ref_REDB_transitions[0].wavenumber, 3) *
                            (2 * ref_REDB_transitions[0].eState + 1));
                    const tRad = 1000 / (rowAED + rowAMD);
                    mtxCacheOutput = outputMtx;
                    csvString += `${k},${labelGraphNoFormat},${transListNoFormat},${mtxCacheOutput[0]},${mtxCacheOutput[1]},${mtxCacheOutput[2]},${rowRMS},${tRad}\n`;
                    seriesDataY.jo2.push(mtxCacheOutput[0]);
                    seriesDataY.jo4.push(mtxCacheOutput[1]);
                    seriesDataY.jo6.push( mtxCacheOutput[2]);
                    seriesDataY.lifetime.push(tRad);
                    seriesData.jo2.push({ x: k, y: mtxCacheOutput[0] });
                    seriesData.jo4.push({ x: k, y: mtxCacheOutput[1] });
                    seriesData.jo6.push({ x: k, y: mtxCacheOutput[2] });
                    if(mtxCacheOutput[1] != 0) seriesData.jo2jo4.push({ x: k, y: mtxCacheOutput[0] / mtxCacheOutput[1] });
                    if(mtxCacheOutput[2] != 0) seriesData.jo2jo6.push({ x: k, y: mtxCacheOutput[0] / mtxCacheOutput[2] });
                    if(mtxCacheOutput[2] != 0) seriesData.jo4jo6.push({ x: k, y: mtxCacheOutput[1] / mtxCacheOutput[2] });
                    reportString += `<td>${mtxCacheOutput[0].toPrecision(3)}</td><td>${mtxCacheOutput[1].toPrecision(3)}</td><td>${mtxCacheOutput[2].toPrecision(3)}</td><td>${(mtxCacheOutput[0] / mtxCacheOutput[1]).toPrecision(3)}</td><td>${(mtxCacheOutput[0] / mtxCacheOutput[2]).toPrecision(3)}</td><td>${(mtxCacheOutput[1] / mtxCacheOutput[2]).toPrecision(3)}</td><td>${rowRMS.toPrecision(3)}</td><td>${tRad.toPrecision(3)}</td></tr>`;
                }
            }
            limitLowerComb--;
        }
        reportString = reportString + "</tbody></table>";
        csvString += "Data used,Median JO2 (cm²),Median JO4 (cm²),Median JO6 (cm²),Median lifetime (ms),Min lifetime (ms),Max lifetime (ms)\n";
        csvString += "Full set," + seriesDataY.jo2[0].toPrecision(3) + "," + seriesDataY.jo4[0].toPrecision(3) + "," + seriesDataY.jo6[0].toPrecision(3) + "," + seriesDataY.lifetime[0].toPrecision(3) + "," + seriesDataY.lifetime[0].toPrecision(3) + "," + seriesDataY.lifetime[0].toPrecision(3) + "\n";
        csvString += "All combinations," + getMedian(seriesDataY.jo2).toPrecision(3) + "," + getMedian(seriesDataY.jo4).toPrecision(3) + "," + getMedian(seriesDataY.jo6).toPrecision(3) + "," + getMedian(seriesDataY.lifetime).toPrecision(3) + "," + getMin(seriesDataY.lifetime).toPrecision(3) + "," + getMax(seriesDataY.lifetime).toPrecision(3) + "\n";
        csvString += "Reduced (Only positive)," + getMedian(getPositiveArray(seriesDataY,seriesDataY.jo2)).toPrecision(3) + "," + getMedian(getPositiveArray(seriesDataY,seriesDataY.jo4)).toPrecision(3) + "," + getMedian(getPositiveArray(seriesDataY,seriesDataY.jo6)).toPrecision(3) + "," + getMedian(getPositiveArray(seriesDataY,seriesDataY.lifetime)).toPrecision(3) + "," + getMin(getPositiveArray(seriesDataY,seriesDataY.lifetime)).toPrecision(3) + "," + getMax(getPositiveArray(seriesDataY,seriesDataY.lifetime)).toPrecision(3) + "\n";
        csvString += "Reduced (Box plot)," + getMedian(getBoxPlotArray(seriesDataY,seriesDataY.jo2)).toPrecision(3) + "," + getMedian(getBoxPlotArray(seriesDataY,seriesDataY.jo4)).toPrecision(3) + "," + getMedian(getBoxPlotArray(seriesDataY,seriesDataY.jo6)).toPrecision(3) + "," + getMedian(getBoxPlotArray(seriesDataY,seriesDataY.lifetime)).toPrecision(3) + "," + getMin(getBoxPlotArray(seriesDataY,seriesDataY.lifetime)).toPrecision(3) + "," + getMax(getBoxPlotArray(seriesDataY,seriesDataY.lifetime)).toPrecision(3) + "\n";
    
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
    formRef.getComponent('htmldivtablecontainer').component.content = "<table style='width:100%; text-align: center;'><thead><tr><th>Datased used</th><th>Median JO2</th><th>Median JO4</th><th>Median JO6</th><th>Median lifetime</th><th>Min lifetime</th><th>Max lifetime</th></tr></thead><tbody><tr><td>Full set</td><td>" + seriesDataY.jo2[0].toPrecision(3) + " cm²</td><td>" + seriesDataY.jo4[0].toPrecision(3) + " cm²</td><td>" + seriesDataY.jo6[0].toPrecision(3) + " cm²</td><td>" + seriesDataY.lifetime[0].toPrecision(3) + " ms</td><td>" + seriesDataY.lifetime[0].toPrecision(3) + " ms</td><td>" + seriesDataY.lifetime[0].toPrecision(3) + " ms</td></tr><tr><td>All combinations</td><td>" + getMedian(seriesDataY.jo2).toPrecision(3) + " cm²</td><td>" + getMedian(seriesDataY.jo4).toPrecision(3) + " cm²</td><td>" + getMedian(seriesDataY.jo6).toPrecision(3) + " cm²</td><td>" + getMedian(seriesDataY.lifetime).toPrecision(3) + " ms</td><td>" + getMin(seriesDataY.lifetime).toPrecision(3) + " ms</td><td>" + getMax(seriesDataY.lifetime).toPrecision(3) + " ms</td></tr><tr><td>Reduced (Only positive)</td><td>" + getMedian(getPositiveArray(seriesDataY,seriesDataY.jo2)).toPrecision(3) + " cm²</td><td>" + getMedian(getPositiveArray(seriesDataY,seriesDataY.jo4)).toPrecision(3) + " cm²</td><td>" + getMedian(getPositiveArray(seriesDataY,seriesDataY.jo6)).toPrecision(3) + " cm²</td><td>" + getMedian(getPositiveArray(seriesDataY,seriesDataY.lifetime)).toPrecision(3) + " ms</td><td>" + getMin(getPositiveArray(seriesDataY,seriesDataY.lifetime)).toPrecision(3) + " ms</td><td>" + getMax(getPositiveArray(seriesDataY,seriesDataY.lifetime)).toPrecision(3) + " ms</td></tr><tr><td>Reduced (Box plot)<i data-tooltip='Box plot median within 1.5 × 25-75 percentile range' class='fa fa-question-circle text-muted' ref='tooltip' aria-expanded='false'></i></td><td>" + getMedian(getBoxPlotArray(seriesDataY,seriesDataY.jo2)).toPrecision(3) + " cm²</td><td>" + getMedian(getBoxPlotArray(seriesDataY,seriesDataY.jo4)).toPrecision(3) + " cm²</td><td>" + getMedian(getBoxPlotArray(seriesDataY,seriesDataY.jo6)).toPrecision(3) + " cm²</td><td>" + getMedian(getBoxPlotArray(seriesDataY,seriesDataY.lifetime)).toPrecision(3) + " ms</td><td>" + getMin(getBoxPlotArray(seriesDataY,seriesDataY.lifetime)).toPrecision(3) + " ms</td><td>" + getMax(getBoxPlotArray(seriesDataY,seriesDataY.lifetime)).toPrecision(3) + " ms</td></tr></tbody></table><br>";
    formRef.redraw();
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
function getMin(array) {
    return Math.min(...array);
}
function getMax(array) {
    return Math.max(...array);
}
function getMedian(array) {
    const sortedArray = array.slice().sort((a, b) => a - b);
    const n = sortedArray.length;
    const middleIndex = Math.floor(n / 2);
    if (n % 2 === 0) return (sortedArray[middleIndex - 1] + sortedArray[middleIndex]) / 2;
    else return sortedArray[middleIndex];
}
function getBoxPlotArray(arrayTest, arrayOutput) {
    const incorrectIndeces = getBoxPlotIncorrectIndeces(arrayTest.jo2).concat(getBoxPlotIncorrectIndeces(arrayTest.jo4), getBoxPlotIncorrectIndeces(arrayTest.jo6));
    const filteredArray = arrayOutput.filter((value, index) => !incorrectIndeces.includes(index));
    return filteredArray;
}
function getPositiveArray(arrayTest, arrayOutput) {
    const incorrectIndeces = getNegativeIncorrectIndeces(arrayTest.jo2).concat(getNegativeIncorrectIndeces(arrayTest.jo4), getNegativeIncorrectIndeces(arrayTest.jo6));
    const filteredArray = arrayOutput.filter((value, index) => !incorrectIndeces.includes(index));
    return filteredArray;
}
function getBoxPlotIncorrectIndeces(array) {
    const positiveArray = array.slice().filter((value) => value >= 0);
    const sortedArray = positiveArray.sort((a, b) => a - b);
    const n = sortedArray.length;
    const q1 = sortedArray[Math.ceil(0.25 * (n - 1))];
    const q3 = sortedArray[Math.ceil(0.75 * (n - 1))];
    const iqr = q3 - q1;
    const bottom = q1 - 1.5 * iqr < 0 ? 0 : q1 - 1.5 * iqr;
    const top = q3 + 1.5 * iqr;
    var indexArray = [];
    array.forEach(element => {
        if (element < bottom || element > top) indexArray.push(array.indexOf(element));
    });
    return indexArray;
}  
function getNegativeIncorrectIndeces(array) {
    var indexArray = [];
    array.forEach(element => {
        if (element < 0) indexArray.push(array.indexOf(element));
    });
    return indexArray;
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