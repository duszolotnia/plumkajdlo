/* bold names of topics that are available for not logged in users */
var common_section_url = [
    "/tforum/ogloszenia",
    "/tforum/ogolne",
    "/tforum/wydarzenia",
    "/tforum/sportowe",
    "/tforum/osiagniecia",
    "/tforum/wpa",
    "/tforum/lekarze",
    "/tforum/strzelnice",
    "/tforum/sprzet",
    "/tforum/sklepy",
    "/tforum/oferty"
];
var a;
common_section_url.forEach(sectionUrl => {
    a = document.querySelector("a[href='"+sectionUrl+"']");
    a.style = "font-weight: bold";
});
