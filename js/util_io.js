// export functions
function generateJOreport() {
    let csvString = "data:text/csv;charset=utf-8,JO2,JO4,JO6,JO2/JO4,JO2/JO6,JO4/JO2,JO4/JO6,JO6/JO2,JO6/JO4\n"+Number(formRef.data.jo2).toPrecision(6)+","+Number(formRef.data.jo4).toPrecision(6)+","+Number(formRef.data.jo6).toPrecision(6)+","+ Number(formRef.data.jo2/formRef.data.jo4).toPrecision(6)+","+ Number(formRef.data.jo2/formRef.data.jo6).toPrecision(6)+","+ Number(formRef.data.jo4/formRef.data.jo2).toPrecision(6)+","+ Number(formRef.data.jo4/formRef.data.jo6).toPrecision(6)+","+ Number(formRef.data.jo6/formRef.data.jo2).toPrecision(6)+","+ Number(formRef.data.jo6/formRef.data.jo4).toPrecision(6)+"\n";
    if(formRef.data.radioIndexCalc == "sellmeier") {
      csvString += "Sellmeier A, Sellmeier B1,Sellmeier C1,Sellmeier B2,Sellmeier C2\n"+Number(formRef.data.const_sellmeier).toPrecision(6)+","+Number(formRef.data.a_sellmeier).toPrecision(6)+","+Number(formRef.data.b_sellmeier).toPrecision(6)+","+Number(formRef.data.c_sellmeier).toPrecision(6)+","+Number(formRef.data.d_sellmeier).toPrecision(6)+"\n";
    }
    else {
      csvString += "direct refractive index input\n";
    }
    switch(formRef.data.radioInputType) {
      case "ICS":
        csvString += "excitedState,U2,U4,U6,sigma,mean_peak_wl_nm,refractive_index,fExp,fCalc,sExp,sCalc,barycenter\n";
        for (let i = 0; i < ref_REDB.length; i++) {
          if(formRef.data.dataGrid[i].include) csvString += ref_REDB[i].excitedState + "," + formRef.data.dataGrid[i].u2 + "," + formRef.data.dataGrid[i].u4 + "," + formRef.data.dataGrid[i].u6 + "," + formRef.data.dataGrid[i].integratedCrossSectionCm2 + "," + Number(formRef.data.dataGrid[i].meanPeakWavelengthNm).toPrecision(6) + "," + Number(formRef.data.dataGrid[i].refractiveIndex).toPrecision(6) + "," + Number(formRef.data.dataGrid[i].fExp).toPrecision(6) + "," + Number(formRef.data.dataGrid[i].fCalc).toPrecision(6) + "," + Number(formRef.data.dataGrid[i].sExp).toPrecision(6) + "," + Number(formRef.data.dataGrid[i].sCalc).toPrecision(6) + "," + formRef.data.dataGrid[i].barycenter + "\n";
        }
        break;
      case "FEXP":
        csvString += "excitedState,U2,U4,U6,mean_peak_wl_nm,refractive_index,fExp,fCalc,sExp,sCalc,barycenter\n";
        for (let i = 0; i < ref_REDB.length; i++) {
          if(formRef.data.dataGrid[i].include) csvString += ref_REDB[i].excitedState + "," + formRef.data.dataGrid[i].u2 + "," + formRef.data.dataGrid[i].u4 + "," + formRef.data.dataGrid[i].u6 + "," + Number(formRef.data.dataGrid[i].meanPeakWavelengthNm).toPrecision(6) + "," + Number(formRef.data.dataGrid[i].refractiveIndex).toPrecision(6) + "," + formRef.data.dataGrid[i].fExp + "," + Number(formRef.data.dataGrid[i].fCalc).toPrecision(6) + "," + Number(formRef.data.dataGrid[i].sExp).toPrecision(6) + "," + Number(formRef.data.dataGrid[i].sCalc).toPrecision(6) + "," + formRef.data.dataGrid[i].barycenter + "\n";
        }
        break;
      case "SEXP":
        csvString += "excitedState,U2,U4,U6,refractive_index,sExp,sCalc,barycenter\n";
        for (let i = 0; i < ref_REDB.length; i++) {
          if(formRef.data.dataGrid[i].include) csvString += ref_REDB[i].excitedState + "," + formRef.data.dataGrid[i].u2 + "," + formRef.data.dataGrid[i].u4 + "," + formRef.data.dataGrid[i].u6 + "," + Number(formRef.data.dataGrid[i].refractiveIndex).toPrecision(6) + "," + formRef.data.dataGrid[i].sExp + "," + Number(formRef.data.dataGrid[i].sCalc).toPrecision(6) + "," + formRef.data.dataGrid[i].barycenter + "\n";
        }
        break;
      case "JO":
        csvString += "excitedState,refractive_index,barycenter\n";
        for (let i = 0; i < ref_REDB.length; i++) {
          csvString += ref_REDB[i].excitedState + "," + Number(formRef.data.dataGrid[i].refractiveIndex).toPrecision(6) + "," + formRef.data.dataGrid[i].barycenter + "\n";
        }
        break;
    }
    browserCheck();
    linkJO = document.createElement("a");
    linkJO.setAttribute("href", encodeURI(csvString));
    if(formRef.data.sampleName != "") linkJO.setAttribute("download", formRef.data.sampleName + "_JO_export.csv");
    else linkJO.setAttribute("download", "JO_export.csv");
    document.body.appendChild(linkJO);
    linkJO.click();
  }
function generateTransitionsReport() {
    linkTransitions.click();
}
function generateCombinationsReport() {
    linkCombinations.click();
}
function downloadTemplateData() {
    if (filenamesTemplate.hasOwnProperty(re_edit)) {
        browserCheck();
        var link = document.createElement("a");
        link.setAttribute("href", filenamesTemplate[re_edit]);
        link.setAttribute("download", filenamesTemplate[re_edit]);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
    }
}
function downloadReferenceData() {
    if (filenamesReference.hasOwnProperty(re_edit)) {
        browserCheck();
        var link = document.createElement("a");
        link.setAttribute("href", filenamesReference[re_edit]);
        link.setAttribute("download", filenamesReference[re_edit]);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
    }
}
function browserCheck() {
    if(window.safari !== undefined) alert("Safari does not support downloading files from this application with proper filename. File content is not affected. Please append .csv extension to the downloaded file name or use another browser.");
}
// import functions
function importArrayCSV(arr) {
    const dimensions = [arr.length, arr[0].length];
    if (dimensions[0] < 8) return;
    let sellmeierRI = arr[1][1] == "sellmeier";
    formRef.data.radioIndexCalc = sellmeierRI ? "sellmeier" : "direct";
    formRef.data.const_sellmeier = sellmeierRI ? Number(arr[2][1]) : "";
    formRef.data.a_sellmeier = sellmeierRI ? Number(arr[3][1]) : "";
    formRef.data.b_sellmeier = sellmeierRI ? Number(arr[4][1]) : "";
    formRef.data.c_sellmeier = sellmeierRI ? Number(arr[5][1]) : "";
    formRef.data.d_sellmeier = sellmeierRI ? Number(arr[6][1]) : "";
    ref_REDB.forEach((ref, i) => {
        let j = 0;
        if (j == 0) formRef.data.dataGrid[i].include = false;
        arr.slice(9).forEach((row) => {
        if (ref.excitedState == row[0] && (Number(row[4]) != 0 || arr[8][4] == "jo")) {
            formRef.data.dataGrid[i].u2 = Number(row[1]);
            formRef.data.dataGrid[i].u4 = Number(row[2]);
            formRef.data.dataGrid[i].u6 = Number(row[3]);
            formRef.data.dataGrid[i].meanPeakWavelengthNm = Number(row[5]);
            formRef.data.dataGrid[i].include = true;
            formRef.data.dataGrid[i].barycenter = Number(row[7]);
            if (!sellmeierRI) formRef.data.dataGrid[i].refractiveIndex = Number(row[6]);
            if(arr[8][4] == "fexp") {
                formRef.data.dataGrid[i].fexp = Number(row[4]);
                formRef.data.radioInputType = "FEXP";
            }
            else if(arr[8][4] == "sexp") {
                formRef.data.dataGrid[i].sexp_disp = Number(row[4]);
                formRef.data.radioInputType = "SEXP";
            }
            else if(arr[8][4] == "jo") {
                if(ref_REDB[0].excitedState == row[0]) {
                    formRef.data.jo2 = Number(row[1]);
                    formRef.data.jo4 = Number(row[2]);
                    formRef.data.jo6 = Number(row[3]);
                    formRef.data.dataGrid[i].u2 = 0;
                    formRef.data.dataGrid[i].u4 = 0;
                    formRef.data.dataGrid[i].u6 = 0;
                }
                formRef.data.dataGrid[i].include = false;
                formRef.data.radioInputType = "JO";
            }
            else {
                formRef.data.dataGrid[i].integratedCrossSectionCm2 = Number(row[4]);
                formRef.data.radioInputType = "ICS";
            }
        }
        else {
            if (ref.excitedState == row[0]) formRef.data.dataGrid[i].barycenter = Number(row[7]);
        }
        j++;
        });
    });
    formRef.triggerRedraw();
    document.getElementById("overlayloading").style.display = "none";
}
function readFile(file) {
    if(formRef.data.sampleName != "") {
        if(confirm("Do you want to overwrite the current sample name?")) {
        formRef.data.sampleName = file.name.split(".")[0];
        }
    }
    else {
        formRef.data.sampleName = file.name.split(".")[0];
    }
    if (typeof file === "undefined") {
        document.getElementById("overlayloading").style.display = "none";
        return;
    }
    document.getElementById("overlayloading").style.display = "block";
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
        const result = event.target.result;
        let arrImport = CSVToArray(result, ",");
        document.querySelector("#filereport").textContent = JSON.stringify(arrImport);
        var panel = formRef.getComponent("dataImportPanel");
        panel.collapsed = true;
        importArrayCSV(arrImport);
    });
    reader.addEventListener("progress", (event) => {
        if (event.loaded && event.total) {
        const percent = (event.loaded / event.total) * 100;
        }
    });
    reader.readAsText(file);
}
function CSVToArray(strData, strDelimiter) {
    strDelimiter = strDelimiter || ",";
    var objPattern = new RegExp("(\\" + strDelimiter + "|\\r?\\n|\\r|^)" + '(?:"([^"]*(?:""[^"]*)*)"|' + '([^"\\' + strDelimiter + "\\r\\n]*))", "gi");
    var arrData = [[]];
    var arrMatches = null;
    while ((arrMatches = objPattern.exec(strData))) {
        var strMatchedDelimiter = arrMatches[1];
        if (strMatchedDelimiter.length && strMatchedDelimiter != strDelimiter) {
        arrData.push([]);
        }
        if (arrMatches[2]) {
        var strMatchedValue = arrMatches[2].replace(new RegExp('""', "g"), '"');
        } else {
        var strMatchedValue = arrMatches[3];
        }
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    return arrData;
}
var progressPercent = 0;
function updateProgressBar(value) {
    var progressBar = document.getElementById("overlay-progress-bar");
    progressBar.style.width = value + "%";
    progressBar.style.display = "block";
    var progressComment = document.getElementById("overlay-progress-comment");
    progressComment.style.display = "block";
}
function showProgressBar() {
    var progressBar = document.getElementById("overlay-progress-bar");
    progressBar.style.display = "block";
    var progressComment = document.getElementById("overlay-progress-comment");
    progressComment.style.display = "block";
}
function hideProgressBar() {
    var progressBar = document.getElementById("overlay-progress-bar");
    progressBar.style.width = "0%";
    progressBar.style.display = "none";
    var progressComment = document.getElementById("overlay-progress-comment");
    progressComment.style.display = "none";
}