export interface RadixShadeContrastAverage {
  shade: number;
  onWhite: number;
  onBlack: number;
}

export interface RadixShadeContrastMap {
  light: RadixShadeContrastAverage[];
  dark: RadixShadeContrastAverage[];
  lightAlpha: RadixShadeContrastAverage[];
  darkAlpha: RadixShadeContrastAverage[];
}

export const ShadeContrastAverages: RadixShadeContrastMap = {
  light: [
    { shade: 1, onWhite: 0, onBlack: -106.38203664165813 },
    { shade: 2, onWhite: 0, onBlack: -103.96494885142049 },
    { shade: 3, onWhite: 0, onBlack: -98.77155596443654 },
    { shade: 4, onWhite: 10.734692270816181, onBlack: -93.12838928228786 },
    { shade: 5, onWhite: 16.739803287688193, onBlack: -86.90863107142702 },
    { shade: 6, onWhite: 23.75642506147641, onBlack: -79.42675383279962 },
    { shade: 7, onWhite: 32.78926214388217, onBlack: -69.8750602664213 },
    { shade: 8, onWhite: 44.60486096562658, onBlack: -57.525969124533404 },
    { shade: 9, onWhite: 55.27312758065561, onBlack: -39.830246671427695 },
    { shade: 10, onWhite: 58.40316583683905, onBlack: -36.69270331117056 },
    { shade: 11, onWhite: 54.42995610238435, onBlack: -16.816058029497984 },
    { shade: 12, onWhite: 98.3626951077654, onBlack: -0.243977199339859 }
  ],
  dark: [
    { shade: 1, onWhite: 105.16947703033875, onBlack: 0 },
    { shade: 2, onWhite: 104.47455521749035, onBlack: 0 },
    { shade: 3, onWhite: 102.31533864046163, onBlack: 0 },
    { shade: 4, onWhite: 79.98334841751968, onBlack: 0 },
    { shade: 5, onWhite: 77.54881079709789, onBlack: -1.984447666347993 },
    { shade: 6, onWhite: 92.37416767093004, onBlack: -8.98795881001414 },
    { shade: 7, onWhite: 86.17941884292664, onBlack: -15.900343754636117 },
    { shade: 8, onWhite: 77.01680949547635, onBlack: -24.749728877729627 },
    { shade: 9, onWhite: 57.71029507274669, onBlack: -37.39641558057034 },
    { shade: 10, onWhite: 51.71405180792631, onBlack: -46.705233801257535 },
    { shade: 11, onWhite: 36.71666321535775, onBlack: -65.76575135717155 },
    { shade: 12, onWhite: 12.81264448594129, onBlack: -90.87575135366401 }
  ],
  lightAlpha: [
    { shade: 1, onWhite: 0, onBlack: 0 },
    { shade: 2, onWhite: 0, onBlack: 0 },
    { shade: 3, onWhite: 1.6778397947987858, onBlack: 0 },
    { shade: 4, onWhite: 11.64749283807309, onBlack: -0.9187071404069177 },
    { shade: 5, onWhite: 17.871664630999266, onBlack: -1.8981555689901124 },
    { shade: 6, onWhite: 24.960110746128674, onBlack: -1.7129308909781782 },
    { shade: 7, onWhite: 33.977121034699685, onBlack: -1.7943406335718308 },
    { shade: 8, onWhite: 45.76469098760112, onBlack: -4.1353233242117975 },
    { shade: 9, onWhite: 57.46417120813366, onBlack: -10.6281928280184 },
    { shade: 10, onWhite: 61.76677681304326, onBlack: -9.492979096123447 },
    { shade: 11, onWhite: 54.42629359498634, onBlack: -13.14877814805867 },
    { shade: 12, onWhite: 98.36185920560881, onBlack: -0.243977199339859 }
  ],
  darkAlpha: [
    { shade: 1, onWhite: 0, onBlack: 0 },
    { shade: 2, onWhite: 0, onBlack: 0 },
    { shade: 3, onWhite: 5.844199475615428, onBlack: 0 },
    { shade: 4, onWhite: 10.46300119060984, onBlack: 0 },
    { shade: 5, onWhite: 11.453738874489753, onBlack: 0 },
    { shade: 6, onWhite: 11.918279717348529, onBlack: -3.399334949353237 },
    { shade: 7, onWhite: 14.085526852463719, onBlack: -11.076865474725812 },
    { shade: 8, onWhite: 17.649907157244478, onBlack: -21.315517896776708 },
    { shade: 9, onWhite: 24.281440987561567, onBlack: -35.28162257337803 },
    { shade: 10, onWhite: 22.63078002209196, onBlack: -44.67078117681845 },
    { shade: 11, onWhite: 29.91223522220564, onBlack: -65.29391671148325 },
    { shade: 12, onWhite: 11.525106838459077, onBlack: -90.76532903552133 }
  ]
};
