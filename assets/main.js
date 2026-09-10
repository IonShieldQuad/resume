(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var TITLES = {
    en: "Lily Grinina — Backend Developer · AI Practitioner",
    ru: "Лилия Гринина — Backend-разработчик · AI Practitioner"
  };

  var UI_TEXT = {
    en: {
      sys: "SYS.STATUS: OPEN TO WORK",
      print: "Print / Save as PDF"
    },
    ru: {
      sys: "СИСТЕМА: В ПОИСКЕ",
      print: "Печать / Сохранить в PDF"
    }
  };

  var langBtns = Array.prototype.slice.call(
    document.querySelectorAll(".lang-btn")
  );
  var printBtn = document.getElementById("print-btn");

  function applyLang(lang) {
    var blocks = document.querySelectorAll(".lang");
    for (var i = 0; i < blocks.length; i++) {
      var on = blocks[i].getAttribute("data-lang") === lang;
      blocks[i].classList.toggle("active", on);
    }
    for (var j = 0; j < langBtns.length; j++) {
      var pressed = langBtns[j].getAttribute("data-lang") === lang;
      langBtns[j].setAttribute("aria-pressed", pressed ? "true" : "false");
    }
    var labels = UI_TEXT[lang] || UI_TEXT.en;
    var translated = document.querySelectorAll("[data-tr]");
    for (var t = 0; t < translated.length; t++) {
      var key = translated[t].getAttribute("data-tr");
      if (labels[key]) translated[t].textContent = labels[key];
    }
    if (printBtn) {
      printBtn.setAttribute("aria-label", labels.print);
      printBtn.setAttribute("title", labels.print);
    }
    if (TITLES[lang]) document.title = TITLES[lang];
    root.lang = lang;
    try { localStorage.setItem("resume-lang", lang); } catch (e) {}
  }

  var saved = null;
  try { saved = localStorage.getItem("resume-lang"); } catch (e) {}
  applyLang(saved === "ru" || saved === "en" ? saved : "en");

  for (var k = 0; k < langBtns.length; k++) {
    langBtns[k].addEventListener("click", function () {
      applyLang(this.getAttribute("data-lang"));
    });
  }

  if (printBtn) {
    printBtn.addEventListener("click", function () {
      var details = document.querySelectorAll(".qa");
      var openStates = [];
      for (var q = 0; q < details.length; q++) {
        openStates[q] = details[q].open;
        details[q].open = true;
      }
      var restoreDetails = function () {
        for (var r = 0; r < details.length; r++) details[r].open = openStates[r];
        window.removeEventListener("afterprint", restoreDetails);
      };
      window.addEventListener("afterprint", restoreDetails);
      window.print();
    });
  }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var targets = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || reduce) {
    for (var m = 0; m < targets.length; m++) targets[m].classList.add("in");
  } else {
    var io = new IntersectionObserver(function (entries) {
      for (var n = 0; n < entries.length; n++) {
        if (entries[n].isIntersecting) {
          entries[n].target.classList.add("in");
          io.unobserve(entries[n].target);
        }
      }
    }, { threshold: 0.12 });
    for (var p = 0; p < targets.length; p++) io.observe(targets[p]);
  }
})();
