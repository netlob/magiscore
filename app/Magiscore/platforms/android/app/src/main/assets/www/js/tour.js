var tour = new Tour({
  steps: [
    {
      element: "#currentRenderMobile",
      title: "Huidige pagina",
      content:
        'Hier kun je zien wel vak je momenteel bekijkt. Als er "Gemmiddeld" betekent dat dat je kijkt naar het gemiddelde van al je cijfers.'
    },
    {
      element: "#current-course-badge",
      title: "Huidig jaar",
      content:
        "Hier kun je van jaar wisselen. Zo kun je je je cijfers van vorige jaren ook bekijken, en vergelijken met je cijfers van dit jaar."
    },
    {
      element: "#messagesDrop",
      title: "Laatste cijfers",
      content: "Hier kun je je laatste cijfers zien."
    }
  ]
});

tour.init();
tour.start();
