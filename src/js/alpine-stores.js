document.addEventListener("alpine:init", () => {

  Alpine.store("notifications", {
    items: [],
    unread: 0,
    add(msg, type = "info") {
      this.items.push({ id: Date.now(), msg, type });
      this.unread++;
    },
    clear() {
      this.items = [];
      this.unread = 0;
    }
  });

  Alpine.store("sidebar", {
    collapsed: false,
    toggle() {
      this.collapsed = !this.collapsed;
    }
  });

});
