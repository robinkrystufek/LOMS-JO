const formLayout = {
  components: [
    {
      label: "Tabs",
      components: [
        {
          label: "Er",
          key: "er",
          components: [],
        },
        {
          label: "Dy",
          key: "dy",
          components: [],
        },
        {
          label: "Eu",
          key: "eu",
          components: [],
        },
        {
          label: "Gd",
          key: "gd",
          components: [],
        },
        {
          label: "Ho",
          key: "ho",
          components: [],
        },
        {
          label: "Nd",
          key: "nd",
          components: [],
        },
        {
          label: "Pm",
          key: "pm",
          components: [],
        },
        {
          label: "Pr",
          key: "pr",
          components: [],
        },
        {
          label: "Sm",
          key: "sm",
          components: [],
        },
        {
          label: "Tb",
          key: "tb",
          components: [],
        },
        {
          label: "Tm",
          key: "tm",
          components: [],
        },
      ],
      customClass: "tabs-re-selector",
      key: "tabs",
      type: "tabs",
      input: false,
      tableView: false,
    },
    {
      label: "reEditField",
      customClass: "re-edit-field",
      hideLabel: true,
      key: "reEditField",
      type: "well",
      input: false,
      tableView: false,
      components: [
        {
          label: "ColumnsTop",
          columns: [
            {
              components: [
                {
                  label: "Sample name",
                  labelPosition: "left-left",
                  tableView: true,
                  defaultValue: "",
                  key: "sampleName",
                  type: "textfield",
                  input: true,
                },
                {
                  label: "Use magnetic dipole correction",
                  optionsLabelPosition: "right",
                  tooltip:
                    "",
                  inline: true,
                  hidden: true,
                  tableView: false,
                  defaultValue: "FED",
                  conditional: {
                    show: true,
                    when: "radioInputType",
                    eq: "ICS",
                  },
                  values: [
                    {
                      label: "FED",
                      value: "FED",
                      shortcut: "",
                    },
                    {
                      label: "FED+FMD",
                      value: "FEDFMD",
                      shortcut: "",
                    },
                  ],
                  key: "radioCorrectionMD",
                  type: "radio",
                  input: true,
                }
              ],
              width: 6,
              offset: 0,
              push: 0,
              pull: 0,
              size: "md",
              currentWidth: 6,
            },
            {
              components: [
                {
                  label: "Input values",
                  optionsLabelPosition: "right",
                  tooltip:
                    "Choose whether to use Integrated cross section, F<sub>exp</sub>, S<sub>exp</sub>, or calculated JO parameters as input",
                  inline: true,
                  tableView: false,
                  defaultValue: "ICS",
                  values: [
                    {
                      label: "Integrated cross section",
                      value: "ICS",
                      shortcut: "",
                    },
                    {
                      label: "F<sub>exp</sub>",
                      value: "FEXP",
                      shortcut: "",
                    },
                    {
                      label: "S<sub>exp</sub>",
                      value: "SEXP",
                      shortcut: "",
                    },
                    {
                      label: "JO parameters",
                      value: "JO",
                      shortcut: "",
                    },
                  ],
                  key: "radioInputType",
                  type: "radio",
                  input: true,
                },
                {
                  label: "Refractive index values",
                  optionsLabelPosition: "right",
                  tooltip:
                    "Choose whether to use Sellmeier calculation for refractive indeces, or directly supplied value",
                  inline: true,
                  tableView: false,
                  defaultValue: "direct",
                  conditional: {
                    show: false,
                    when: "radioInputType",
                    eq: "JO",
                  },
                  values: [
                    {
                      label: "Direct",
                      value: "direct",
                      shortcut: "",
                    },
                    {
                      label: "Sellmeier",
                      value: "sellmeier",
                      shortcut: "",
                    },
                  ],
                  key: "radioIndexCalc",
                  type: "radio",
                  input: true,
                },
              ],
              width: 6,
              offset: 0,
              push: 0,
              pull: 0,
              size: "md",
              currentWidth: 6,
            },
          ],
          key: "ColumnsTop",
          type: "columns",
          input: false,
          tableView: false,
        },
        {
          label: "HTMLtop",
          attrs: [
            {
              attr: "",
              value: "",
            },
          ],
          refreshOnChange: false,
          key: "htmltop",
          type: "htmlelement",
          input: false,
          tableView: false,
        },
        {
          label: "Sellmeier parameters",
          hidden: true,
          key: "sellmeierParameters",
          conditional: {
            show: true,
            when: "radioIndexCalc",
            eq: "sellmeier",
          },
          type: "well",
          input: false,
          tableView: false,
          components: [
            {
              label: "Table",
              cellAlignment: "left",
              key: "table",
              type: "table",
              numRows: 1,
              numCols: 5,
              input: false,
              tableView: false,
              rows: [
                [
                  {
                    components: [
                      {
                        label: "A",
                        tooltip:
                          "Sellmeier equation constants in the following format: <img width='200' src='img/4.png'></img><br> In case of issues with calculation using the Sellmeier equation, see <a href='https://www.loms.cz/FAQ/'>FAQ</a> for more information.",
                        labelPosition: "left-left",
                        spellcheck: false,
                        tableView: true,
                        clearOnHide: false,
                        key: "const_sellmeier",
                        type: "textfield",
                        labelWidth: 25,
                        applyMaskOn: "change",
                        input: true,
                      },
                    ],
                  },
                  {
                    components: [
                      {
                        label: "B₁",
                        labelPosition: "left-left",
                        spellcheck: false,
                        tableView: true,
                        clearOnHide: false,
                        key: "a_sellmeier",
                        type: "textfield",
                        labelWidth: 25,
                        applyMaskOn: "change",
                        input: true,
                      },
                    ],
                  },
                  {
                    components: [
                      {
                        label: "C₁ (μm⁻²)",
                        labelPosition: "left-left",
                        spellcheck: false,
                        tableView: true,
                        clearOnHide: false,
                        key: "b_sellmeier",
                        type: "textfield",
                        labelWidth: 25,
                        applyMaskOn: "change",
                        input: true,
                      },
                    ],
                  },
                  {
                    components: [
                      {
                        label: "B₂",
                        labelPosition: "left-left",
                        spellcheck: false,
                        tableView: true,
                        clearOnHide: false,
                        key: "c_sellmeier",
                        type: "textfield",
                        labelWidth: 25,
                        applyMaskOn: "change",
                        input: true,
                      },
                    ],
                  },
                  {
                    components: [
                      {
                        label: "C₂ (μm⁻²)",
                        labelPosition: "left-left",
                        spellcheck: false,
                        tableView: true,
                        clearOnHide: false,
                        key: "d_sellmeier",
                        type: "textfield",
                        labelWidth: 25,
                        applyMaskOn: "change",
                        input: true,
                      },
                    ],
                  },
                ],
              ],
            },
          ],
        },
        {
          label: "Transition values",
          tooltip:
            "Choose observed transition peaks and their corresponding values",
          disableAddingRemovingRows: true,
          reorder: false,
          layoutFixed: false,
          enableRowGroups: false,
          initEmpty: false,
          customClass: "transitionDataGrid",
          hideLabel: true,
          tableView: false,
          defaultValue: [
            {
              include: false,
              excitedStateRow: {},
              u2: "",
              u4: "",
              u6: "",
              integratedCrossSectionCm2: "",
              meanPeakWavelengthNm: "",
              refractiveIndex: "",
              fExp: "",
              sExp: "",
              fCalc: "",
              sCalc: "",
              textField: "",
              fexp: "",
              fcalc: "",
            },
          ],
          customDefaultValue: "value = elementTransitionArrayTemplate;",
          key: "dataGrid",
          type: "datagrid",
          input: true,
          components: [
            {
              label: "Include",
              tooltip:
                "Check if you want to include the transition in the calculation",
              customClass: "checkboxInclude",
              hideLabel: true,
              dataGridLabel: false,
              tableView: false,
              defaultValue: false,

              key: "include",
              type: "checkbox",
              labelWidth: 0,
              labelMargin: 0,
              input: true,
              logic: [
                {
                  name: "firstRowHide",
                  trigger: {
                    type: "javascript",
                    javascript:
                      "result = (instance.rowIndex==0 || data.radioInputType == 'JO') ? true : false;",
                  },
                  actions: [
                    {
                      name: "enableFirstRow",
                      type: "property",
                      property: {
                        label: "Hidden",
                        value: "hidden",
                        type: "boolean",
                      },
                      state: true,
                    },
                    {
                      name: "enforceFirstRow",
                      type: "value",
                      value: "value = false;",
                    },
                  ],
                },
              ],
            },
            {
              label: "Excited state",
              widget: "html5",
              customClass: "transitionSelectInput",
              disabled: true,
              tableView: true,
              dataSrc: "custom",
              data: {
                custom: "values = ref_REDB;",
              },
              dataType: "object",
              idPath: "",
              template: "{{ item.excitedStateFormatted }}",
              calculateValue: "value = ref_REDB[instance.rowIndex];",
              key: "excitedStateRow",
              type: "select",
              input: true,
            },
            {
              label: "U2",
              spellcheck: false,
              tableView: true,
              redrawOn: "radio",
              clearOnHide: false,
              calculateValue: "value = row.excitedStateRow.u2.toString();",
              allowCalculateOverride: true,
              key: "u2",
              type: "textfield",
              applyMaskOn: "change",
              input: true,
              logic: [
                {
                  name: "firstRowHide",
                  trigger: {
                    type: "javascript",
                    javascript:
                      "result = (instance.rowIndex==0 || data.radioInputType == 'JO') ? true : false;",
                  },
                  actions: [
                    {
                      name: "enableFirstRow",
                      type: "property",
                      property: {
                        label: "Hidden",
                        value: "hidden",
                        type: "boolean",
                      },
                      state: true,
                    },
                  ],
                },
              ],
            },
            {
              label: "U4",
              tableView: true,
              clearOnHide: false,
              logic: [
                {
                  name: "firstRowHide",
                  trigger: {
                    type: "javascript",
                    javascript:
                      "result = (instance.rowIndex==0 || data.radioInputType == 'JO') ? true : false;",
                  },
                  actions: [
                    {
                      name: "enableFirstRow",
                      type: "property",
                      property: {
                        label: "Hidden",
                        value: "hidden",
                        type: "boolean",
                      },
                      state: true,
                    },
                  ],
                },
              ],
              calculateValue: "value = row.excitedStateRow.u4.toString();",
              allowCalculateOverride: true,
              key: "u4",
              type: "textfield",
              applyMaskOn: "change",
              input: true,
            },
            {
              label: "U6",
              tableView: true,
              clearOnHide: false,
              logic: [
                {
                  name: "firstRowHide",
                  trigger: {
                    type: "javascript",
                    javascript:
                      "result = (instance.rowIndex==0 || data.radioInputType == 'JO') ? true : false;",
                  },
                  actions: [
                    {
                      name: "enableFirstRow",
                      type: "property",
                      property: {
                        label: "Hidden",
                        value: "hidden",
                        type: "boolean",
                      },
                      state: true,
                    },
                  ],
                },
              ],
              calculateValue: "value = row.excitedStateRow.u6.toString();",
              allowCalculateOverride: true,
              key: "u6",
              type: "textfield",
              applyMaskOn: "change",
              input: true,
            },
            {
              label: "Integrated cross section (cm² nm)",
              tooltip:
                "Input values in decimal (1.0) or scientific notation (1.0e20)",
              tableView: true,
              key: "integratedCrossSectionCm2",
              type: "textfield",
              applyMaskOn: "change",
              calculateValue:
                'value = data.radioInputType!="FEXP" ? row.integratedCrossSectionCm2 : (row.fexp/((2*constM*constC)/(constA*constH*((row.meanPeakWavelengthNm/10000000)*(row.meanPeakWavelengthNm/10000000))))).toFixed(1);',
              input: true,
              allowCalculateOverride: true,
              logic: [
                {
                  name: "enableFexp",
                  trigger: {
                    type: "simple",
                    simple: {
                      show: true,
                      when: "radioInputType",
                      eq: "FEXP",
                    },
                  },
                  actions: [
                    {
                      name: "enableFexpA",
                      type: "property",
                      property: {
                        label: "Disabled",
                        value: "disabled",
                        type: "boolean",
                      },
                      state: true,
                    },
                    {
                      name: "enableFexpB",
                      type: "property",
                      property: {
                        label: "allowCalculateOverride",
                        value: "allowCalculateOverride",
                        type: "boolean",
                      },
                      state: false,
                    },
                  ],
                },
                {
                  name: "firstRowHide",
                  trigger: {
                    type: "javascript",
                    javascript:
                      "result = (instance.rowIndex==0 || data.radioInputType == 'JO') ? true : false;",
                  },
                  actions: [
                    {
                      name: "enableFirstRow",
                      type: "property",
                      property: {
                        label: "Hidden",
                        value: "hidden",
                        type: "boolean",
                      },
                      state: true,
                    },
                  ],
                },
                {
                  name: "hideOnSexp",
                  trigger: {
                    type: "simple",
                    simple: {
                      show: true,
                      when: "radioInputType",
                      eq: "SEXP",
                    },
                  },
                  actions: [
                    {
                      name: "enableFexpA",
                      type: "property",
                      property: {
                        label: "Hidden",
                        value: "hidden",
                        type: "boolean",
                      },
                      state: true,
                    },
                  ],
                },
                {
                  name: "hideOnJO",
                  trigger: {
                    type: "simple",
                    simple: {
                      show: true,
                      when: "radioInputType",
                      eq: "JO",
                    },
                  },
                  actions: [
                    {
                      name: "enableFexpA",
                      type: "property",
                      property: {
                        label: "Hidden",
                        value: "hidden",
                        type: "boolean",
                      },
                      state: true,
                    },
                  ],
                },
              ],
            },
            {
              label: "Mean peak wavelength (nm)",
              tableView: true,
              calculateValue:
                "value = row.excitedStateRow.wavelength.toFixed(1);",
              allowCalculateOverride: true,
              key: "meanPeakWavelengthNm",
              type: "textfield",
              logic: [
                {
                  name: "firstRowHide",
                  trigger: {
                    type: "javascript",
                    javascript:
                      "result = (instance.rowIndex==0 || data.radioInputType == 'JO') ? true : false;",
                  },
                  actions: [
                    {
                      name: "enableFirstRow",
                      type: "property",
                      property: {
                        label: "Hidden",
                        value: "hidden",
                        type: "boolean",
                      },
                      state: true,
                    },
                  ],
                },
                {
                  name: "hideOnSexp",
                  trigger: {
                    type: "simple",
                    simple: {
                      show: true,
                      when: "radioInputType",
                      eq: "SEXP",
                    },
                  },
                  actions: [
                    {
                      name: "enableFexpA",
                      type: "property",
                      property: {
                        label: "Hidden",
                        value: "hidden",
                        type: "boolean",
                      },
                      state: true,
                    },
                  ],
                },
                {
                  name: "hideOnJO",
                  trigger: {
                    type: "simple",
                    simple: {
                      show: true,
                      when: "radioInputType",
                      eq: "JO",
                    },
                  },
                  actions: [
                    {
                      name: "enableFexpA",
                      type: "property",
                      property: {
                        label: "Hidden",
                        value: "hidden",
                        type: "boolean",
                      },
                      state: true,
                    },
                  ],
                },
              ],
              applyMaskOn: "change",
              input: true,
            },
            {
              label: "Refractive index",
              spellcheck: false,
              tableView: true,
              key: "refractiveIndex",
              allowCalculateOverride: true,
              calculateValue:
                "value = data.radioIndexCalc==\"sellmeier\" ? Math.sqrt(data.const_sellmeier+((data.a_sellmeier*(row.meanPeakWavelengthNm/1000)*(row.meanPeakWavelengthNm/1000)))/(((row.meanPeakWavelengthNm/1000)*(row.meanPeakWavelengthNm/1000))-data.b_sellmeier)+(data.c_sellmeier*(row.meanPeakWavelengthNm/1000)*(row.meanPeakWavelengthNm/1000))/(((row.meanPeakWavelengthNm/1000)*(row.meanPeakWavelengthNm/1000))-data.d_sellmeier)).toPrecision(5) : '';",
              logic: [
                {
                  name: "firstRowHide",
                  trigger: {
                    type: "javascript",
                    javascript:
                      "result = (instance.rowIndex==0 || data.radioInputType == 'JO') ? true : false;",
                  },
                  actions: [
                    {
                      name: "enableFirstRow",
                      type: "property",
                      property: {
                        label: "Hidden",
                        value: "hidden",
                        type: "boolean",
                      },
                      state: true,
                    },
                  ],
                },
                {
                  name: "valueRIcalc",
                  trigger: {
                    type: "simple",
                    simple: {
                      show: true,
                      when: "radioIndexCalc",
                      eq: "sellmeier",
                    },
                  },
                  actions: [
                    {
                      name: "enableCalcIndex",
                      type: "property",
                      property: {
                        label: "allowCalculateOverride",
                        value: "allowCalculateOverride",
                        type: "boolean",
                      },
                      state: false,
                    },
                    {
                      name: "disableRI",
                      type: "property",
                      property: {
                        label: "Disabled",
                        value: "disabled",
                        type: "boolean",
                      },
                      state: true,
                    },
                  ],
                },
                {
                  name: "hideOnSexp",
                  trigger: {
                    type: "simple",
                    simple: {
                      show: true,
                      when: "radioInputType",
                      eq: "SEXP",
                    },
                  },
                  actions: [
                    {
                      name: "enableFexpA",
                      type: "property",
                      property: {
                        label: "Hidden",
                        value: "hidden",
                        type: "boolean",
                      },
                      state: true,
                    },
                  ],
                },
                {
                  name: "hideOnJO",
                  trigger: {
                    type: "simple",
                    simple: {
                      show: true,
                      when: "radioInputType",
                      eq: "JO",
                    },
                  },
                  actions: [
                    {
                      name: "enableFexpA",
                      type: "property",
                      property: {
                        label: "Hidden",
                        value: "hidden",
                        type: "boolean",
                      },
                      state: true,
                    },
                  ],
                },
              ],
              type: "textfield",
              applyMaskOn: "change",
              input: true,
            },
            {
              label: "f_exp_no_md",
              calculateValue:
                'value = data.radioInputType=="FEXP" ? row.fexp : ((2*constM*constC)/(constA*constH*((row.meanPeakWavelengthNm/10000000)*(row.meanPeakWavelengthNm/10000000))))*(row.integratedCrossSectionCm2/10000000);',
              key: "fExpNoMD",
              type: "hidden",
              input: true,
              tableView: false,
            },
            {
              label: "f_exp",
              calculateValue:
                'value = (data.radioInputType=="ICS" && data.radioCorrectionMD=="FEDFMD") ? row.fExpNoMD - (constH*row.refractiveIndex*row.excitedStateRow.correctionL2S*(constC/(row.meanPeakWavelengthNm/10000000)))/(6*constM*constC*constC*(2*ref_REDB[0].gState+1)) : row.fExpNoMD;',
              key: "fExp",
              type: "hidden",
              input: true,
              tableView: false,
            },
            {
              label: "s_exp_no_md",
              calculateValue:
                'value = data.radioInputType=="SEXP" ? row.sexp_disp : (row.fExpNoMD*3*constH*(row.meanPeakWavelengthNm/10000000)*(2*row.excitedStateRow.gState+1)*9*(row.refractiveIndex*row.refractiveIndex))/(8*(constPi*constPi)*constM*constC*row.refractiveIndex*(((row.refractiveIndex*row.refractiveIndex)+2)*((row.refractiveIndex*row.refractiveIndex)+2)));',
              key: "sExpNoMD",
              type: "hidden",
              input: true,
              tableView: false,
            },
            {
              label: "s_exp",
              calculateValue:
                'value = (data.radioInputType=="ICS" && data.radioCorrectionMD=="FEDFMD") ? row.sExpNoMD - ((row.sExpNoMD * (row.fExpNoMD - (row.fExp))) / row.fExpNoMD) : row.sExpNoMD;',
              key: "sExp",
              type: "hidden",
              input: true,
              tableView: false,
            },
            {
              label: "f_calc",
              calculateValue:
                "value = (8*(constPi*constPi)*constM*constC*(((row.refractiveIndex*row.refractiveIndex)+2)*((row.refractiveIndex*row.refractiveIndex)+2))*(row.u2*mtxCacheOutput[0]+row.u4*mtxCacheOutput[1]+row.u6*mtxCacheOutput[2]))/(3*constH*(row.meanPeakWavelengthNm/10000000)*(2*row.excitedStateRow.gState+1)*9*row.refractiveIndex);",
              key: "fCalc",
              type: "hidden",
              input: true,
              tableView: false,
            },
            {
              label: "F<sub>exp</sub>",
              disabled: true,
              tableView: true,
              calculateValue: "value = Number(row.fExp).toPrecision(4);",
              key: "fexp",
              type: "textfield",
              input: true,
              logic: [
                {
                  name: "firstRowHide",
                  trigger: {
                    type: "javascript",
                    javascript:
                      "result = (instance.rowIndex==0 || data.radioInputType == 'JO') ? true : false;",
                  },
                  actions: [
                    {
                      name: "enableFirstRow",
                      type: "property",
                      property: {
                        label: "Hidden",
                        value: "hidden",
                        type: "boolean",
                      },
                      state: true,
                    },
                  ],
                },
                {
                  name: "enableFexp",
                  trigger: {
                    type: "simple",
                    simple: {
                      show: true,
                      when: "radioInputType",
                      eq: "FEXP",
                    },
                  },
                  actions: [
                    {
                      name: "enableFexpA",
                      type: "property",
                      property: {
                        label: "Disabled",
                        value: "disabled",
                        type: "boolean",
                      },
                      state: false,
                    },
                    {
                      name: "enableFexpB",
                      type: "property",
                      property: {
                        label: "allowCalculateOverride",
                        value: "allowCalculateOverride",
                        type: "boolean",
                      },
                      state: true,
                    },
                  ],
                },
                {
                  name: "hideOnSexp",
                  trigger: {
                    type: "simple",
                    simple: {
                      show: true,
                      when: "radioInputType",
                      eq: "SEXP",
                    },
                  },
                  actions: [
                    {
                      name: "enableFexpA",
                      type: "property",
                      property: {
                        label: "Hidden",
                        value: "hidden",
                        type: "boolean",
                      },
                      state: true,
                    },
                  ],
                },
                {
                  name: "hideOnJO",
                  trigger: {
                    type: "simple",
                    simple: {
                      show: true,
                      when: "radioInputType",
                      eq: "JO",
                    },
                  },
                  actions: [
                    {
                      name: "enableFexpA",
                      type: "property",
                      property: {
                        label: "Hidden",
                        value: "hidden",
                        type: "boolean",
                      },
                      state: true,
                    },
                  ],
                },
              ],
            },
            {
              label: "F<sub>calc</sub>",
              disabled: true,
              tableView: true,
              calculateValue: "value = row.fCalc.toPrecision(4);",
              key: "fcalc",
              type: "hidden",
              input: true,
            },
            {
              label: "S<sub>exp</sub> (cm²)",
              disabled: true,
              tableView: true,

              calculateValue:
                "value = data.radioInputType == 'SEXP'? row.sexp_disp.toPrecision(4) : row.sExp.toPrecision(4);",
              key: "sexp_disp",
              type: "textfield",
              input: true,
              logic: [
                {
                  name: "firstRowHide",
                  trigger: {
                    type: "javascript",
                    javascript:
                      "result = (instance.rowIndex==0 || data.radioInputType == 'JO') ? true : false;",
                  },
                  actions: [
                    {
                      name: "enableFirstRow",
                      type: "property",
                      property: {
                        label: "Hidden",
                        value: "hidden",
                        type: "boolean",
                      },
                      state: true,
                    },
                  ],
                },
                {
                  name: "enableSexp",
                  trigger: {
                    type: "simple",
                    simple: {
                      show: true,
                      when: "radioInputType",
                      eq: "SEXP",
                    },
                  },
                  actions: [
                    {
                      name: "enableSexpA",
                      type: "property",
                      property: {
                        label: "Disabled",
                        value: "disabled",
                        type: "boolean",
                      },
                      state: false,
                    },
                    {
                      name: "enableFexpB",
                      type: "property",
                      property: {
                        label: "allowCalculateOverride",
                        value: "allowCalculateOverride",
                        type: "boolean",
                      },
                      state: true,
                    },
                  ],
                },
              ],
            },
            {
              label: "s_calc",
              calculateValue:
                "value = row.u2*mtxCacheOutput[0]+row.u4*mtxCacheOutput[1]+row.u6*mtxCacheOutput[2];",
              key: "sCalc",
              type: "hidden",
              input: true,
              tableView: false,
            },
            {
              label: "S<sub>calc</sub> (cm²)",
              disabled: true,
              tableView: true,
              calculateValue: "value = row.sCalc.toPrecision(4);",
              key: "sCalc_disp",
              type: "textfield",
              input: true,
              logic: [
                {
                  name: "firstRowHide",
                  trigger: {
                    type: "javascript",
                    javascript:
                      "result = (instance.rowIndex==0 || data.radioInputType == 'JO') ? true : false;",
                  },
                  actions: [
                    {
                      name: "enableFirstRow",
                      type: "property",
                      property: {
                        label: "Hidden",
                        value: "hidden",
                        type: "boolean",
                      },
                      state: true,
                    },
                  ],
                },
              ],
            },
            {
              label: "Barycenter (cm⁻¹)",
              tableView: true,
              clearOnHide: false,
              calculateValue:
                "value = row.excitedStateRow.barycenter.toString();",
              allowCalculateOverride: true,
              key: "barycenter",
              type: "textfield",
              applyMaskOn: "change",
              input: true,
            },
          ],
        },
        {
          label: "Show more...",
          action: "custom",
          showValidations: false,
          theme: "secondary",
          tableView: false,
          key: "showMore",
          type: "button",
          custom:
            'document.getElementById("formio").classList.remove("showless"); let gridElement = document.getElementsByClassName("formio-component-dataGrid"); gridElement[0].classList.remove("transitionDataGrid"); let elements = document.getElementsByName("data[showMore]"); elements[0].style.display = "none"; ',
          input: true,
        },
        {
          title: "Data import",
          collapsible: true,
          conditional: {
            show: false,
            when: "radioInputType",
            eq: "JO",
          },
          key: "dataImportPanel",
          type: "panel",
          label: "Panel",
          collapsed: true,
          input: false,
          tableView: false,
          components: [
            {
              label: "Table",
              cellAlignment: "left",
              key: "table",
              type: "table",
              numRows: 2,
              numCols: 3,
              input: false,
              tableView: false,
              rows: [
                [
                  {
                    components: [
                      {
                        label: "Import file",
                        tag: "input",
                        attrs: [
                          {
                            attr: "type",
                            value: "file",
                          },
                          {
                            attr: "id",
                            value: "fileimport",
                          },
                        ],
                        refreshOnChange: false,
                        key: "importFile",
                        type: "htmlelement",
                        input: false,
                        tableView: false,
                      },
                    ],
                  },
                  {
                    components: [
                      {
                        label: "Example data",
                        action: "event",
                        showValidations: false,
                        theme: "secondary",
                        rightIcon: "fa fa-download",
                        tableView: false,
                        key: "downloadTemplateDataButton2",
                        type: "button",
                        event: "downloadReferenceData",
                        input: true,
                        logic: [
                          {
                            name: "exampleNotAvailable",
                            trigger: {
                              type: "javascript",
                              javascript:
                                "result =!filenamesReference.hasOwnProperty(re_edit);",
                            },
                            actions: [
                              {
                                name: "disable",
                                type: "property",
                                property: {
                                  label: "Disabled",
                                  value: "disabled",
                                  type: "boolean",
                                },
                                state: true,
                              },
                            ],
                          },
                        ],
                      },
                      {
                        label: "HTMLspan",
                        tag: "span",
                        attrs: [
                          {
                            attr: "id",
                            value: "spanTooltipCustom",
                          },
                        ],
                        refreshOnChange: false,
                        key: "htmlspan1",
                        content:
                          "<i data-tooltip='In case of download problems or for detailed information about example data files, see <a href=\"https://www.loms.cz/modules/judd-ofelt-analysis/\">documentation</a>.' class='fa fa-question-circle text-muted' ref='tooltip' aria-expanded='false'></i>",
                        type: "htmlelement",
                        input: false,
                        tableView: false,
                      },
                    ],
                  },
                  {
                    components: [
                      {
                        label: "Data template",
                        action: "event",
                        showValidations: false,
                        theme: "secondary",
                        rightIcon: "fa fa-download",
                        tableView: false,
                        key: "downloadTemplateDataButton",
                        type: "button",
                        event: "downloadTemplateData",
                        input: true,
                      },
                      {
                        label: "HTMLspan",
                        tag: "span",
                        attrs: [
                          {
                            attr: "id",
                            value: "spanTooltipCustom",
                          },
                        ],
                        refreshOnChange: false,
                        key: "htmlspan2",
                        content:
                          "<i data-tooltip='In case of download problems or for detailed information about input template files, see <a href=\"https://www.loms.cz/modules/judd-ofelt-analysis/\">documentation</a>.' class='fa fa-question-circle text-muted' ref='tooltip' aria-expanded='false'></i>",
                        type: "htmlelement",
                        input: false,
                        tableView: false,
                      },
                    ],
                  },
                ],
                [
                  {
                    components: [
                      {
                        label: "Import file",
                        action: "custom",
                        showValidations: false,
                        theme: "secondary",
                        tableView: false,
                        key: "importbutton",
                        type: "button",
                        custom:
                          'document.getElementById("overlayloading").style.display = "block"; let file = document.querySelector("#fileimport").files[0]; readFile(file); ',
                        input: true,
                      },
                    ],
                  },
                  {
                    components: [],
                  },
                ],
              ],
            },
            {
              label: "File report",
              tag: "pre",
              attrs: [
                {
                  attr: "id",
                  value: "filereport",
                },
                {
                  attr: "style",
                  value: "display:none;",
                },
              ],
              refreshOnChange: false,
              key: "filereport",
              type: "htmlelement",
              input: false,
              tableView: false,
            },
          ],
        },
        {
          label: "Columns",
          columns: [
            {
              components: [
                {
                  label: "Calculate JO parameters",
                  action: "event",
                  conditional: {
                    show: false,
                    when: "radioInputType",
                    eq: "JO",
                  },
                  showValidations: false,
                  rightIcon: "fa fa-calculator",
                  tableView: false,
                  block: true,
                  key: "calculateJoParameters",
                  logic: [
                    {
                      name: "grey",
                      trigger: {
                        type: "simple",
                        simple: {
                          show: true,
                          when: "jo2",
                          eq: "NaN",
                        },
                      },
                      actions: [
                        {
                          name: "disableCalc",
                          type: "property",
                          property: {
                            label: "Disabled",
                            value: "disabled",
                            type: "boolean",
                          },
                          state: true,
                        },
                      ],
                    },
                  ],
                  type: "button",
                  event: "calculateJOparams",
                  input: true,
                },
              ],
              width: 2,
              offset: 0,
              push: 0,
              pull: 0,
              size: "sm",
              currentWidth: 0,
            },
            {
              components: [
                {
                  label: "Combinatorial JO analysis",
                  action: "event",
                  showValidations: false,

                  rightIcon: "fa fa-calculator",
                  tableView: false,
                  block: true,
                  key: "calculateCombinationsButton",
                  logic: [
                    {
                      name: "loginHide",
                      trigger: {
                        type: "javascript",
                        javascript:
                          "result = data.radioInputType=='JO' ? true : !userLoggedIn;",
                      },
                      actions: [
                        {
                          name: "loginHideAct",
                          type: "property",
                          property: {
                            label: "Hidden",
                            value: "hidden",
                            type: "boolean",
                          },
                          state: true,
                        },
                      ],
                    },
                    {
                      name: "grey",
                      trigger: {
                        type: "simple",
                        simple: {
                          show: true,
                          when: "jo2",
                          eq: "NaN",
                        },
                      },
                      actions: [
                        {
                          name: "disableCalc",
                          type: "property",
                          property: {
                            label: "Disabled",
                            value: "disabled",
                            type: "boolean",
                          },
                          state: true,
                        },
                      ],
                    },
                  ],
                  type: "button",
                  event: "calculateCombinations",
                  input: true,
                },
                {
                  label: "Combinatorial optimization",
                  action: "event",
                  showValidations: false,
                  rightIcon: "fa fa-lock",
                  theme: "danger",
                  disabled: true,
                  tableView: false,
                  block: true,
                  key: "calculateCombinationsButtonBlock",
                  attributes: {
                    title: "Log in to access this feature",
                  },
                  logic: [
                    {
                      name: "loginHide",
                      trigger: {
                        type: "javascript",
                        javascript:
                          "result = data.radioInputType=='JO' ? true : userLoggedIn;",
                      },
                      actions: [
                        {
                          name: "loginHideAct",
                          type: "property",
                          property: {
                            label: "Hidden",
                            value: "hidden",
                            type: "boolean",
                          },
                          state: true,
                        },
                      ],
                    },
                  ],
                  type: "button",
                  input: true,
                },
              ],
              width: 2,
              offset: 0,
              push: 0,
              pull: 0,
              size: "sm",
              currentWidth: 3,
            },
            {
              components: [
                {
                  label: "Transition analysis",
                  action: "event",
                  showValidations: false,
                  rightIcon: "fa fa-calculator",
                  tableView: false,
                  block: true,
                  key: "calculateTransitionsButton",
                  logic: [
                    {
                      name: "loginHide",
                      trigger: {
                        type: "javascript",
                        javascript:
                          "result = data.radioInputType=='JO' ? true : !userLoggedIn;",
                      },
                      actions: [
                        {
                          name: "loginHideAct",
                          type: "property",
                          property: {
                            label: "Hidden",
                            value: "hidden",
                            type: "boolean",
                          },
                          state: true,
                        },
                      ],
                    },
                    {
                      name: "loginHide",
                      trigger: {
                        type: "javascript",
                        javascript: "result = !userLoggedIn;",
                      },
                      actions: [
                        {
                          name: "loginHideAct",
                          type: "property",
                          property: {
                            label: "Hidden",
                            value: "hidden",
                            type: "boolean",
                          },
                          state: true,
                        },
                      ],
                    },
                    {
                      name: "grey",
                      trigger: {
                        type: "simple",
                        simple: {
                          show: true,
                          when: "jo2",
                          eq: "NaN",
                        },
                      },
                      actions: [
                        {
                          name: "disableCalc",
                          type: "property",
                          property: {
                            label: "Disabled",
                            value: "disabled",
                            type: "boolean",
                          },
                          state: true,
                        },
                      ],
                    },
                  ],
                  type: "button",
                  event: "calculateTransitions",
                  input: true,
                },
                {
                  label: "Transition analysis",
                  action: "event",
                  showValidations: false,
                  rightIcon: "fa fa-lock",
                  theme: "danger",
                  disabled: true,
                  tableView: false,
                  block: true,
                  key: "calculateTransitionButtonBlock",
                  attributes: {
                    title: "Log in to access this feature",
                  },
                  logic: [
                    {
                      name: "loginHide",
                      trigger: {
                        type: "javascript",
                        javascript:
                          "result = data.radioInputType=='JO' ? true : userLoggedIn;",
                      },
                      actions: [
                        {
                          name: "loginHideAct",
                          type: "property",
                          property: {
                            label: "Hidden",
                            value: "hidden",
                            type: "boolean",
                          },
                          state: true,
                        },
                      ],
                    },
                  ],
                  type: "button",
                  input: true,
                },
              ],
              size: "sm",
              width: 2,
              offset: 0,
              push: 0,
              pull: 0,
              currentWidth: 3,
            },
          ],
          key: "columnsButtons",
          type: "columns",
          input: false,
          tableView: false,
        },
        {
          label: "JO parameters",
          hidden: true,

          key: "joParameters1",
          logic: [
            {
              name: "JOshow",
              trigger: {
                type: "simple",
                simple: {
                  show: true,
                  when: "radioInputType",
                  eq: "JO",
                },
              },
              actions: [
                {
                  name: "showJO",
                  type: "property",
                  property: {
                    label: "Hidden",
                    value: "hidden",
                    type: "boolean",
                  },
                  state: false,
                },
              ],
            },
            {
              name: "JOclick",
              trigger: {
                type: "event",
                event: "calculateJOparams",
              },
              actions: [
                {
                  name: "showJO",
                  type: "property",
                  property: {
                    label: "Hidden",
                    value: "hidden",
                    type: "boolean",
                  },
                  state: false,
                },
              ],
            },
          ],
          type: "well",
          input: false,
          tableView: false,
          components: [
            {
              label: "Export report",
              action: "event",
              showValidations: false,
              theme: "secondary",
              rightIcon: "fa fa-download",
              tableView: false,
              key: "downloadReportJO",
              type: "button",
              event: "downloadReportJO",
              input: true,
            },
            {
              label: "JO parameters",
              cellAlignment: "left",
              key: "joParameters",
              type: "table",
              numRows: 4,
              input: false,
              tableView: false,
              rows: [
                [
                  {
                    components: [
                      {
                        label: "JO2",
                        labelPosition: "left-left",
                        spellcheck: false,
                        suffix: "cm²",
                        disabled: true,
                        logic: [
                          {
                            name: "enableJO",
                            trigger: {
                              type: "simple",
                              simple: {
                                show: true,
                                when: "radioInputType",
                                eq: "JO",
                              },
                            },
                            actions: [
                              {
                                name: "enableFexpA",
                                type: "property",
                                property: {
                                  label: "Disabled",
                                  value: "disabled",
                                  type: "boolean",
                                },
                                state: false,
                              },
                              {
                                name: "enableFexpB",
                                type: "property",
                                property: {
                                  label: "allowCalculateOverride",
                                  value: "allowCalculateOverride",
                                  type: "boolean",
                                },
                                state: true,
                              },
                            ],
                          },
                        ],
                        tableView: true,
                        clearOnHide: false,
                        calculateValue:
                          "let iMtx = [[0,0,0],[0,0,0],[0,0,0]]; let sMtx = [0,0,0]; joRMS = 0; joRMSS = 0; let countIncluded = 0; for (let i = 0; i < data.dataGrid.length; i++ ) { if(data.dataGrid[i].include) { countIncluded++; joRMS += Math.pow(Number(data.dataGrid[i].fExp)-Number(data.dataGrid[i].fCalc), 2); joRMSS += Math.pow(Number(data.dataGrid[i].sExp)-Number(data.dataGrid[i].sCalc), 2); iMtx[0][0] += 2*Number(data.dataGrid[i].u2)*Number(data.dataGrid[i].u2); iMtx[0][1] += 2*Number(data.dataGrid[i].u2)*Number(data.dataGrid[i].u4); iMtx[0][2] += 2*Number(data.dataGrid[i].u2)*Number(data.dataGrid[i].u6); iMtx[1][0] += 2*Number(data.dataGrid[i].u4)*Number(data.dataGrid[i].u2); iMtx[1][1] += 2*Number(data.dataGrid[i].u4)*Number(data.dataGrid[i].u4); iMtx[1][2] += 2*Number(data.dataGrid[i].u4)*Number(data.dataGrid[i].u6); iMtx[2][0] += 2*Number(data.dataGrid[i].u6)*Number(data.dataGrid[i].u2); iMtx[2][1] += 2*Number(data.dataGrid[i].u6)*Number(data.dataGrid[i].u4); iMtx[2][2] += 2*Number(data.dataGrid[i].u6)*Number(data.dataGrid[i].u6); sMtx[0] += 2*Number(data.dataGrid[i].u2)*Number(data.dataGrid[i].sExp); sMtx[1] += 2*Number(data.dataGrid[i].u4)*Number(data.dataGrid[i].sExp); sMtx[2] += 2*Number(data.dataGrid[i].u6)*Number(data.dataGrid[i].sExp);} } let outputMtx; try { outputMtx = math.multiply(math.inv(iMtx), sMtx); } catch { outputMtx = [NaN,NaN,NaN]; } joRMS = Math.sqrt(joRMS / (countIncluded-3)); joRMSS = Math.sqrt(joRMSS / (countIncluded-3)); mtxCacheOutput = outputMtx; value = mtxCacheOutput[0].toPrecision(3);",
                        key: "jo2",
                        type: "textfield",
                        labelWidth: 15,
                        input: true,
                      },
                    ],
                  },
                  {
                    components: [
                      {
                        label: "JO4",
                        labelPosition: "left-left",
                        spellcheck: false,
                        suffix: "cm²",
                        disabled: true,
                        logic: [
                          {
                            name: "enableJO",
                            trigger: {
                              type: "simple",
                              simple: {
                                show: true,
                                when: "radioInputType",
                                eq: "JO",
                              },
                            },
                            actions: [
                              {
                                name: "enableFexpA",
                                type: "property",
                                property: {
                                  label: "Disabled",
                                  value: "disabled",
                                  type: "boolean",
                                },
                                state: false,
                              },
                              {
                                name: "enableFexpB",
                                type: "property",
                                property: {
                                  label: "allowCalculateOverride",
                                  value: "allowCalculateOverride",
                                  type: "boolean",
                                },
                                state: true,
                              },
                            ],
                          },
                        ],
                        tableView: true,
                        clearOnHide: false,
                        calculateValue:
                          "value = mtxCacheOutput[1].toPrecision(3);",
                        key: "jo4",
                        type: "textfield",
                        labelWidth: 15,
                        input: true,
                      },
                    ],
                  },
                  {
                    components: [
                      {
                        label: "JO6",
                        labelPosition: "left-left",
                        spellcheck: false,
                        suffix: "cm²",
                        disabled: true,
                        logic: [
                          {
                            name: "enableJO",
                            trigger: {
                              type: "simple",
                              simple: {
                                show: true,
                                when: "radioInputType",
                                eq: "JO",
                              },
                            },
                            actions: [
                              {
                                name: "enableFexpA",
                                type: "property",
                                property: {
                                  label: "Disabled",
                                  value: "disabled",
                                  type: "boolean",
                                },
                                state: false,
                              },
                              {
                                name: "enableFexpB",
                                type: "property",
                                property: {
                                  label: "allowCalculateOverride",
                                  value: "allowCalculateOverride",
                                  type: "boolean",
                                },
                                state: true,
                              },
                            ],
                          },
                        ],
                        tableView: true,
                        clearOnHide: false,
                        calculateValue:
                          "value = mtxCacheOutput[2].toPrecision(3);",
                        key: "jo6",
                        type: "textfield",
                        labelWidth: 15,
                        input: true,
                      },
                    ],
                  },
                ],
                [
                  {
                    components: [
                      {
                        label: "JO2/JO4",
                        labelPosition: "left-left",
                        spellcheck: false,
                        disabled: true,
                        tableView: true,
                        clearOnHide: false,
                        calculateValue:
                          'value = data.radioInputType=="JO" ? data.jo2/data.jo4 : (mtxCacheOutput[0]/mtxCacheOutput[1]).toFixed(2);',
                        key: "jo2jo4",
                        type: "textfield",
                        labelWidth: 15,
                        input: true,
                      },
                    ],
                  },
                  {
                    components: [
                      {
                        label: "JO2/JO6",
                        labelPosition: "left-left",
                        spellcheck: false,
                        tableView: true,
                        clearOnHide: false,
                        calculateValue:
                          'value = data.radioInputType=="JO" ? data.jo2/data.jo6 : (mtxCacheOutput[0]/mtxCacheOutput[2]).toFixed(2);',
                        key: "jo2jo6",
                        type: "textfield",
                        labelWidth: 15,
                        input: true,
                        disabled: true,
                      },
                    ],
                  },
                  {
                    components: [],
                  },
                ],
                [
                  {
                    components: [
                      {
                        label: "JO4/JO2",
                        labelPosition: "left-left",
                        spellcheck: false,
                        tableView: true,
                        clearOnHide: false,
                        calculateValue:
                          'value = data.radioInputType=="JO" ? data.jo4/data.jo2 : (mtxCacheOutput[1]/mtxCacheOutput[0]).toFixed(2);',
                        key: "jo4jo2",
                        type: "textfield",
                        labelWidth: 15,
                        input: true,
                        disabled: true,
                      },
                    ],
                  },
                  {
                    components: [
                      {
                        label: "JO4/JO6",
                        labelPosition: "left-left",
                        spellcheck: false,
                        tableView: true,
                        clearOnHide: false,
                        calculateValue:
                          'value = data.radioInputType=="JO" ? data.jo4/data.jo6 : (mtxCacheOutput[1]/mtxCacheOutput[2]).toFixed(2);',
                        key: "jo4jo6",
                        type: "textfield",
                        labelWidth: 15,
                        input: true,
                        disabled: true,
                      },
                    ],
                  },
                  {
                    components: [
                      {
                        label: "RMS<sub>S</sub>",
                        labelPosition: "left-left",
                        suffix: "cm²",
                        spellcheck: false,
                        tableView: true,
                        clearOnHide: false,
                        calculateValue:
                          'value = data.radioInputType=="JO" ? "N/A" : joRMSS.toPrecision(3);',
                        key: "joRMSS",
                        type: "textfield",
                        labelWidth: 15,
                        input: true,
                        disabled: true,
                      },
                    ],
                  },
                ],
                [
                  {
                    components: [
                      {
                        label: "JO6/JO2",
                        labelPosition: "left-left",
                        spellcheck: false,
                        tableView: true,
                        clearOnHide: false,
                        calculateValue:
                          'value = data.radioInputType=="JO" ? data.jo6/data.jo2 : (mtxCacheOutput[2]/mtxCacheOutput[0]).toFixed(2);',
                        key: "jo6jo2",
                        type: "textfield",
                        labelWidth: 15,
                        input: true,
                        disabled: true,
                      },
                    ],
                  },
                  {
                    components: [
                      {
                        label: "JO6/JO4",
                        labelPosition: "left-left",
                        spellcheck: false,
                        tableView: true,
                        clearOnHide: false,
                        calculateValue:
                          'value = data.radioInputType=="JO" ? data.jo6/data.jo4 : (mtxCacheOutput[2]/mtxCacheOutput[1]).toFixed(2);',
                        key: "jo6jo4",
                        type: "textfield",
                        labelWidth: 15,
                        input: true,
                        disabled: true,
                      },
                    ],
                  },
                  {
                    components: [
                      {
                        label: "RMS<sub>F</sub>",
                        labelPosition: "left-left",
                        spellcheck: false,
                        tableView: true,
                        clearOnHide: false,
                        calculateValue:
                          'value = data.radioInputType=="JO" ? "N/A" : joRMS.toPrecision(3);',
                        key: "joRMS",
                        type: "textfield",
                        labelWidth: 15,
                        input: true,
                        disabled: true,
                      },
                    ],
                  },
                ],
              ],
            },
          ],
        },
        {
          label: "Transition analysis",
          action: "event",
          showValidations: false,
          rightIcon: "fa fa-calculator",
          tableView: false,
          block: true,
          key: "calculateTransitionsButtonJO",
          logic: [
            {
              name: "loginHide3",
              trigger: {
                type: "javascript",
                javascript:
                  "result = data.radioInputType=='JO' ? !userLoggedIn : true;",
              },
              actions: [
                {
                  name: "loginHideAct3",
                  type: "property",
                  property: {
                    label: "Hidden",
                    value: "hidden",
                    type: "boolean",
                  },
                  state: true,
                },
              ],
            },
            {
              name: "grey",
              trigger: {
                type: "simple",
                simple: {
                  show: true,
                  when: "jo2",
                  eq: "",
                },
              },
              actions: [
                {
                  name: "disableCalc",
                  type: "property",
                  property: {
                    label: "Disabled",
                    value: "disabled",
                    type: "boolean",
                  },
                  state: true,
                },
              ],
            },
          ],
          type: "button",
          event: "calculateTransitions",
          input: true,
        },
        {
          label: "Transition analysis",
          action: "event",
          showValidations: false,
          rightIcon: "fa fa-lock",
          theme: "danger",
          disabled: true,
          tableView: false,
          block: true,
          key: "calculateTransitionsButtonJOBlock",
          logic: [
            {
              name: "loginHide3",
              trigger: {
                type: "javascript",
                javascript:
                  "result = data.radioInputType=='JO' ? userLoggedIn : true;",
              },
              actions: [
                {
                  name: "loginHideAct3",
                  type: "property",
                  property: {
                    label: "Hidden",
                    value: "hidden",
                    type: "boolean",
                  },
                  state: true,
                },
              ],
            },
          ],
          attributes: {
            title: "Log in to access this feature",
          },
          type: "button",
          input: true,
        },
        {
          label: "Combinatorial optimization",
          hidden: true,
          key: "combOptimizationWell",
          logic: [
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
            },
          ],
          type: "well",
          input: false,
          tableView: false,
          components: [
            {
              label: "HTMLdiv",
              tag: "div",
              attrs: [
                {
                  attr: "id",
                  value: "chart",
                },
              ],
              refreshOnChange: false,
              key: "htmldiv",
              type: "htmlelement",
              input: false,
              tableView: false,
            },
            {
              label: "HTMLdiv",
              tag: "div",
              attrs: [
                {
                  attr: "id",
                  value: "chartContainer",
                },
              ],
              refreshOnChange: false,
              key: "htmldivcontainer",
              content:
                '<div class="pagebreak"></div><div class="pagebreak-margin"></div><div id="chart1"></div><div id="chart2"></div><div id="chart3"></div>',
              type: "htmlelement",
              input: false,
              tableView: false,
            },
            {
              label: "HTMLdivtable",
              tag: "div",
              attrs: [
                {
                  attr: "id",
                  value: "chartTableContainer",
                },
              ],
              refreshOnChange: false,
              key: "htmldivtablecontainer",
              content:
                "<table><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></table>",
              type: "htmlelement",
              input: false,
              tableView: false,
            },
            {
              label: "HTMLdiv",
              tag: "div",
              attrs: [
                {
                  attr: "id",
                  value: "chartContainer2",
                },
              ],
              refreshOnChange: false,
              key: "htmldivcontainer",
              content:
                '<div id="chart4"></div><div id="chart5"></div><div id="chart6"></div><div class="pagebreak"></div><div class="pagebreak-margin"></div>',
              type: "htmlelement",
              input: false,
              tableView: false,
            },
            {
              label: "Export report",
              action: "event",
              showValidations: false,
              theme: "secondary",
              rightIcon: "fa fa-download",
              tableView: false,
              key: "downloadReportCombinations",
              type: "button",
              event: "downloadReportCombinations",
              input: true,
            },
            {
              title: "Combinations summary",
              collapsible: true,
              key: "combinationsSummary",
              type: "panel",
              label: "Combinations summary panel",
              input: false,
              tableView: false,
              collapsed: true,
              components: [
                {
                  label: "Statistic report",
                  tag: "div",
                  attrs: [
                    {
                      attr: "id",
                      value: "statsJO",
                    },
                    {
                      attr: "style",
                      value: "display:block;",
                    },
                  ],
                  refreshOnChange: false,
                  key: "statJOreport",
                  type: "htmlelement",
                  input: false,
                  tableView: false,
                },
              ],
            },
          ],
        },
        {
          label: "Transition analysis",
          hidden: true,
          key: "transitionsWell",
          logic: [
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
                  state: false,
                },
              ],
            },
          ],
          type: "well",
          input: false,
          tableView: false,
          components: [
            {
              label: "Export report",
              action: "event",
              showValidations: false,
              theme: "secondary",
              rightIcon: "fa fa-download",
              tableView: false,
              key: "downloadReportTransitions",
              type: "button",
              event: "downloadReportTransitions",
              input: true,
            },
            {
              title: "Transitions summary",
              collapsible: true,
              key: "transitionsSummary",
              type: "panel",
              label: "Transitions summary panel",
              input: false,
              tableView: false,
              collapsed: true,
              components: [
                {
                  label: "Statistic report",
                  tag: "div",
                  attrs: [
                    {
                      attr: "id",
                      value: "statsTranstions",
                    },
                    {
                      attr: "style",
                      value: "display:block;",
                    },
                  ],
                  refreshOnChange: false,
                  key: "statTransitionsReport",
                  type: "htmlelement",
                  input: false,
                  tableView: false,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
