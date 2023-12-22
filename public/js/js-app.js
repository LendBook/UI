jQuery(document).ready(function ($) {
  const initAccordion = () => {
    $(document).on("click", ".faq-head", function () {
      if ($(this).hasClass("active")) {
        $(this).siblings(".faq-content").stop().slideUp();
        $(this).removeClass("active");
      } else {
        $(".faq-content").stop().slideUp();
        $(".faq-head").removeClass("active");
        $(this).siblings(".faq-content").stop().slideToggle();
        $(this).toggleClass("active");
      }
    });
  };
  initAccordion();

  const callParallax = () => {
    if ($(window).width() >= 1024) {
      document.addEventListener("mousemove", heroParallax);
    }
  };
  const heroParallax = (e) => {
    function moveParallax(selector, rotateBool, coefficient, direction) {
      let x, y;
      if (direction === "right") {
        x = (window.innerWidth + e.pageX * coefficient) / 100;
        y = (window.innerHeight + e.pageY * coefficient) / 100;
      } else {
        x = (window.innerWidth - e.pageX * coefficient) / 100;
        y = (window.innerHeight - e.pageY * coefficient) / 100;
      }
      let transform = rotateBool
        ? `rotate(26.7deg) translate(${x}px, ${y}px)`
        : `translate(${x}px, ${y}px)`;
      document
        .querySelectorAll(selector)
        .forEach((element) => (element.style.transform = transform));
    }
    moveParallax(".move-right", !0, 0.5, "right");
    moveParallax(".move-left", !0, 0.5, "left");
    moveParallax(".reddit", !1, 0.7, "left");
    moveParallax(".twitter", !1, 0.7, "right");
  };
  callParallax();

  const reveal = () => {
    let reveals = document.querySelectorAll(".reveal");
    for (let i = 0; i < reveals.length; i++) {
      let windowHeight = window.innerHeight;
      let elementTop = reveals[i].getBoundingClientRect().top;
      let elementVisible = 90;
      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add("active");
      } else {
        reveals[i].classList.remove("active");
      }
    }
  };
  reveal();

  $(window).on("init scroll", (e) => {
    reveal();
  });
});
