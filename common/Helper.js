"use strict";

class Helper {
    constructor() {}

    get Offers() {
        return [{ name: "Pay As You Go", value: "payasyougo" }, { name: "Business", value: "business" }];
    }

    get YesNo() {
        return [{ name: "Yes", value: true }, { name: "No", value: false }];
    }

    get PABX_list() {
        return [
            { name: "OXE", value: "oxe" },
            { name: "OXO", value: "oxo" },
            { name: "Third Party", value: "third party" }
        ];
    }

    get Rainbow_platform() {
        return [
            { name: "Rainbow Developers Sandbox platform", value: "sandbox" },
            { name: "Rainbow Production platform", value: "official" },
            { name: "Private Rainbow platform...", value: "others" }
        ];
    }

    get country_list() {
        return [
            { name: "Australia", value: "AUS", "country-code": "036" },
            { name: "Austria", value: "AUT", "country-code": "040" },
            { name: "Belgium", value: "BEL", "country-code": "056" },
            { name: "Brazil", value: "BRA", "country-code": "076" },
            { name: "Canada", value: "CAN", "country-code": "124" },
            { name: "China", value: "CHN", "country-code": "156" },
            { name: "Czech Republic", value: "CZE", "country-code": "203" },
            { name: "Denmark", value: "DNK", "country-code": "208" },
            { name: "Finland", value: "FIN", "country-code": "246" },
            { name: "France", value: "FRA", "country-code": "250" },
            { name: "Germany", value: "DEU", "country-code": "276" },
            { name: "Hong Kong", value: "HKG", "country-code": "344" },
            { name: "Ireland", value: "IRL", "country-code": "372" },
            { name: "Israel", value: "ISR", "country-code": "376" },
            { name: "Italy", value: "ITA", "country-code": "380" },
            { name: "Mexico", value: "MEX", "country-code": "484" },
            { name: "Netherlands", value: "NLD", "country-code": "528" },
            { name: "Norway", value: "NOR", "country-code": "578" },
            { name: "Poland", value: "POL", "country-code": "616" },
            { name: "Portugal", value: "PRT", "country-code": "620" },
            { name: "Russia", value: "RUS", "country-code": "643" },
            { name: "South Africa", value: "ZAF", "country-code": "710" },
            { name: "South Korea", value: "KOR", "country-code": "410" },
            { name: "Spain", value: "ESP", "country-code": "724" },
            { name: "Sweden", value: "SWE", "country-code": "752" },
            { name: "Switzerland", value: "CHE", "country-code": "756" },
            { name: "Taiwan", value: "TWN", "country-code": "158" },
            { name: "Turkey", value: "TUR", "country-code": "792" },
            { name: "United Kingdom", value: "GBR", "country-code": "826" },
            { name: "United States of America", value: "USA", "country-code": "840" },

            { name: "Afghanistan", value: "AFG", "country-code": "004" },
            { name: "Albania", value: "ALB", "country-code": "008" },
            { name: "Algeria", value: "DZA", "country-code": "012" },
            { name: "Andorra", value: "AND", "country-code": "020" },
            { name: "Angola", value: "AGO", "country-code": "024" },
            { name: "Anguilla", value: "AIA", "country-code": "660" },
            { name: "Antigua and Barbuda", value: "ATG", "country-code": "028" },
            { name: "Argentina", value: "ARG", "country-code": "032" },
            { name: "Armenia", value: "ARM", "country-code": "051" },
            { name: "Aruba", value: "ABW", "country-code": "533" },
            { name: "Azerbaijan", value: "AZE", "country-code": "031" },
            { name: "Bahamas", value: "BHS", "country-code": "044" },
            { name: "Bahrain", value: "BHR", "country-code": "048" },
            { name: "Bangladesh", value: "BGD", "country-code": "050" },
            { name: "Barbados", value: "BRB", "country-code": "052" },
            { name: "Belarus", value: "BLR", "country-code": "112" },
            { name: "Belize", value: "BLZ", "country-code": "084" },
            { name: "Benin", value: "BEN", "country-code": "204" },
            { name: "Bermuda", value: "BMU", "country-code": "060" },
            { name: "Bhutan", value: "BTN", "country-code": "064" },
            { name: "Bolivia", value: "BOL", "country-code": "068" },
            { name: "Bosnia and Herzegovina", value: "BIH", "country-code": "070" },
            { name: "Botswana", value: "BWA", "country-code": "072" },
            { name: "British Virgin Islands", value: "VGB", "country-code": "092" },
            { name: "Brunei Darussalam", value: "BRN", "country-code": "096" },
            { name: "Bulgaria", value: "BGR", "country-code": "100" },
            { name: "Burkina Faso", value: "BFA", "country-code": "854" },
            { name: "Burundi", value: "BDI", "country-code": "108" },
            { name: "Cambodia", value: "KHM", "country-code": "116" },
            { name: "Cameroon", value: "CMR", "country-code": "120" },
            { name: "Cape Verde", value: "CPV", "country-code": "132" },
            { name: "Cayman Islands", value: "CYM", "country-code": "136" },
            { name: "Central African Republic", value: "CAF", "country-code": "140" },
            { name: "Chad", value: "TCD", "country-code": "148" },
            { name: "Chile", value: "CHL", "country-code": "152" },
            { name: "Colombia", value: "COL", "country-code": "170" },
            { name: "Comoros", value: "COM", "country-code": "174" },
            { name: "Congo", value: "COG", "country-code": "178" },
            { name: "Costa Rica", value: "CRI", "country-code": "188" },
            { name: "Ivory Coast", value: "CIV", "country-code": "384" },
            { name: "Croatia", value: "HRV", "country-code": "191" },
            { name: "Cyprus", value: "CYP", "country-code": "196" },
            { name: "Djibouti", value: "DJI", "country-code": "262" },
            { name: "Dominica", value: "DMA", "country-code": "212" },
            { name: "Dominican Republic", value: "DOM", "country-code": "214" },
            { name: "Ecuador", value: "ECU", "country-code": "218" },
            { name: "El Salvador", value: "SLV", "country-code": "222" },
            { name: "Egypt", value: "EGY", "country-code": "818" },
            { name: "Eritrea", value: "ERI", "country-code": "232" },
            { name: "Estonia", value: "EST", "country-code": "233" },
            { name: "Ethiopia", value: "ETH", "country-code": "231" },
            { name: "Fiji", value: "FJI", "country-code": "242" },
            { name: "Gabon", value: "GAB", "country-code": "266" },
            { name: "Gambia", value: "GMB", "country-code": "270" },
            { name: "Ghana", value: "GHA", "country-code": "288" },
            { name: "Greece", value: "GRC", "country-code": "300" },
            { name: "Grenada", value: "GRD", "country-code": "308" },
            { name: "Guadeloupe", value: "GLP", "country-code": "312" },
            { name: "Guatemala", value: "GTM", "country-code": "320" },
            { name: "Guinea", value: "GIN", "country-code": "324" },
            { name: "Guyana", value: "GUY", "country-code": "328" },
            { name: "Haiti", value: "HTI", "country-code": "332" },
            { name: "Honduras", value: "HND", "country-code": "340" },
            { name: "Hungary", value: "HUN", "country-code": "348" },
            { name: "Iceland", value: "ISL", "country-code": "352" },
            { name: "India", value: "IND", "country-code": "356" },
            { name: "Indonesia", value: "IDN", "country-code": "360" },
            { name: "Iraq", value: "IRQ", "country-code": "368" },
            { name: "Jamaica", value: "JAM", "country-code": "388" },
            { name: "Japan", value: "JPN", "country-code": "392" },
            { name: "Jordan", value: "JOR", "country-code": "400" },
            { name: "Kazakhstan", value: "KAZ", "country-code": "398" },
            { name: "Kenya", value: "KEN", "country-code": "404" },
            { name: "Kuwait", value: "KWT", "country-code": "414" },
            { name: "Kyrgyzstan", value: "KGZ", "country-code": "417" },
            { name: "Latvia", value: "LVA", "country-code": "428" },
            { name: "Lebanon", value: "LBN", "country-code": "422" },
            { name: "Lesotho", value: "LSO", "country-code": "426" },
            { name: "Liberia", value: "LBR", "country-code": "430" },
            { name: "Libya", value: "LBY", "country-code": "434" },
            { name: "Liechtenstein", value: "LIE", "country-code": "438" },
            { name: "Lithuania", value: "LTU", "country-code": "440" },
            { name: "Luxembourg", value: "LUX", "country-code": "442" },
            { name: "Macao", value: "MAC", "country-code": "446" },
            { name: "Macedonia", value: "MKD", "country-code": "807" },
            { name: "Madagascar", value: "MDG", "country-code": "450" },
            { name: "Malawi", value: "MWI", "country-code": "454" },
            { name: "Malaysia", value: "MYS", "country-code": "458" },
            { name: "Maldives", value: "MDV", "country-code": "462" },
            { name: "Mali", value: "MLI", "country-code": "466" },
            { name: "Malta", value: "MLT", "country-code": "470" },
            { name: "Mauritius", value: "MUS", "country-code": "480" },
            { name: "Mayotte", value: "MYT", "country-code": "175" },
            { name: "Moldova", value: "MDA", "country-code": "498" },
            { name: "Monaco", value: "MCO", "country-code": "492" },
            { name: "Mongolia", value: "MNG", "country-code": "496" },
            { name: "Montenegro", value: "MNE", "country-code": "499" },
            { name: "Montserrat", value: "MSR", "country-code": "500" },
            { name: "Morocco", value: "MAR", "country-code": "504" },
            { name: "Mozambique", value: "MOZ", "country-code": "508" },
            { name: "Myanmar", value: "MMR", "country-code": "104" },
            { name: "Namibia", value: "NAM", "country-code": "516" },
            { name: "Nepal", value: "NPL", "country-code": "524" },
            { name: "New Zealand", value: "NZL", "country-code": "554" },
            { name: "Nicaragua", value: "NIC", "country-code": "558" },
            { name: "Niger", value: "NER", "country-code": "562" },
            { name: "Nigeria", value: "NGA", "country-code": "566" },
            { name: "Oman", value: "OMN", "country-code": "512" },
            { name: "Pakistan", value: "PAK", "country-code": "586" },
            { name: "Palestine", value: "PSE", "country-code": "275" },
            { name: "Panama", value: "PAN", "country-code": "591" },
            { name: "Paraguay", value: "PRY", "country-code": "600" },
            { name: "Peru", value: "PER", "country-code": "604" },
            { name: "Philippines", value: "PHL", "country-code": "608" },
            { name: "Puerto Rico", value: "PRI", "country-code": "630" },
            { name: "Qatar", value: "QAT", "country-code": "634" },
            { name: "Romania", value: "ROU", "country-code": "642" },
            { name: "Rwanda", value: "RWA", "country-code": "646" },
            { name: "Saint Kitts and Nevis", value: "KNA", "country-code": "659" },
            { name: "Saint Lucia", value: "LCA", "country-code": "662" },
            { name: "Saint Vincent and the Grenadines", value: "VCT", "country-code": "670" },
            { name: "Saudi Arabia", value: "SAU", "country-code": "682" },
            { name: "Senegal", value: "SEN", "country-code": "686" },
            { name: "Serbia", value: "SRB", "country-code": "688" },
            { name: "Sierra Leone", value: "SLE", "country-code": "694" },
            { name: "Singapore", value: "SGP", "country-code": "702" },
            { name: "Slovakia", value: "SVK", "country-code": "703" },
            { name: "Slovenia", value: "SVN", "country-code": "705" },
            { name: "South Sudan", value: "SSD", "country-code": "728" },
            { name: "Sri Lanka", value: "LKA", "country-code": "144" },
            { name: "Sudan", value: "SDN", "country-code": "729" },
            { name: "Swaziland", value: "SWZ", "country-code": "748" },
            { name: "Tajikistan", value: "TJK", "country-code": "762" },
            { name: "Tanzania", value: "TZA", "country-code": "834" },
            { name: "Thailand", value: "THA", "country-code": "764" },
            { name: "Trinidad and Tobago", value: "TTO", "country-code": "780" },
            { name: "Tunisia", value: "TUN", "country-code": "788" },
            { name: "Turkmenistan", value: "TKM", "country-code": "795" },
            { name: "Turks and Caicos Islands", value: "TCA", "country-code": "796" },
            { name: "Uganda", value: "UGA", "country-code": "800" },
            { name: "Ukraine", value: "UKR", "country-code": "804" },
            { name: "United Arab Emirates", value: "ARE", "country-code": "784" },
            { name: "Virgin Islands, US", value: "VIR", "country-code": "850" },
            { name: "Uruguay", value: "URY", "country-code": "858" },
            { name: "Uzbekistan", value: "UZB", "country-code": "860" },
            { name: "Venezuela", value: "VEN", "country-code": "862" },
            { name: "Vietnam", value: "VNM", "country-code": "704" },
            { name: "Zambia", value: "ZMB", "country-code": "894" },
            { name: "Zimbabwe", value: "ZWE", "country-code": "716" }
        ];
    }

    getProxyFromString(proxy) {
        let proxyJSON = null;
        let protocol = "",
            url = "",
            port = null;

        let parts = proxy.split("/");
        protocol = parts && parts.length > 0 ? parts[0] : "";
        protocol = protocol.replace(/:/g, "");
        let partsUrl = parts && parts.length >= 2 ? parts[2].split(":") : null;
        if (partsUrl) {
            url = partsUrl && partsUrl.length > 0 ? partsUrl[0] : "";
            let portStr = partsUrl && partsUrl.length >= 2 ? partsUrl[1] : "";
            try {
                port = Number(portStr);
            } catch (err) {}
        }
        if (protocol && url && port) {
            proxyJSON = {
                protocol: protocol,
                host: url,
                port: port
            };
        }

        return proxyJSON;
    }
}

module.exports = new Helper();
