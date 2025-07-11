function GetViewUi(id) {
  const el = document.getElementById(id);
  if (!el) return null;

  // Helper: create Children proxy for nested access
  function createChildrenProxy(parentEl) {
    const childrenById = {};
    Array.from(parentEl.children).forEach(child => {
      if (child.id) {
        childrenById[child.id] = patchComponentMethods(child);
      }
    });
    return new Proxy(childrenById, {
      get(target, prop) {
        return target[prop];
      },
      set(target, prop, value) {
        if (value instanceof HTMLElement) {
          target[prop] = patchComponentMethods(value);
          parentEl.appendChild(value);
          return true;
        }
        return false;
      },
      ownKeys(target) {
        return Reflect.ownKeys(target);
      },
      has(target, prop) {
        return prop in target;
      }
    });
  }

  // Patch component methods recursively
  function patchComponentMethods(element) {
    if (!element) return element;

    // --- HTML Content ---
    
    element.text = function(value) {
  if (value === undefined) return this.textContent;
  this.textContent = value;
  this.childrenProxy = createChildrenProxy(this);
  return this;
};

    
    
    
    element.html = function(value) {
      if (value === undefined) return this.innerHTML;
      this.innerHTML = value;
      this.childrenProxy = createChildrenProxy(this);
      return this;
    };

    element.removeHtml = function() {
      this.innerHTML = "";
      this.childrenProxy = createChildrenProxy(this);
      return this;
    };

    element.removeText = function() {
      const childNodes = Array.from(this.childNodes);
      childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) node.remove();
      });
      this.childrenProxy = createChildrenProxy(this);
      return this;
    };

    // --- Background styles ---
    element.getBackground = function() {
      return this.style;
    };

    element.setNewBackground = function(styleObj) {
      this.style.cssText = "";
      if (styleObj && typeof styleObj === "object") {
        Object.assign(this.style, styleObj);
      }
      return this;
    };

    element.removeBackground = function() {
      this.style.cssText = "";
      return this;
    };

    element.appendBackground = function(styleObj) {
      if (styleObj && typeof styleObj === "object") {
        Object.assign(this.style, styleObj);
      }
      return this;
    };

    element.updateBackground = function(updateObj) {
      if (updateObj && typeof updateObj === "object") {
        Object.entries(updateObj).forEach(([key, val]) => {
          this.style[key] = val;
        });
      }
      return this;
    };

    element.background = function(styleObj) {
      if (styleObj === undefined) return this.style;
      if (typeof styleObj === "object") {
        Object.assign(this.style, styleObj);
      }
      return this;
    };

    // --- Class manipulation ---
    element.appendClass = function(classes) {
      if (!Array.isArray(classes)) classes = [classes];
      classes.forEach(c => this.classList.add(c));
      return this;
    };

    element.removeClass = function(classes) {
      if (!Array.isArray(classes)) classes = [classes];
      classes.forEach(c => this.classList.remove(c));
      return this;
    };

    element.removeAllClass = function() {
      this.className = "";
      return this;
    };

    element.checkExistClass = function(classes) {
      if (!Array.isArray(classes)) classes = [classes];
      return classes.every(c => this.classList.contains(c));
    };

    // --- ID manipulation ---
    element.newId = function(newId) {
      if (newId) this.id = newId;
      else this.id = "id-" + Math.random().toString(36).slice(2, 9);
      return this;
    };

    element.deleteId = function() {
      this.removeAttribute("id");
      return this;
    };

    // --- Attribute manipulation ---
    element.setAttrs = function(attrsObj) {
      if (attrsObj && typeof attrsObj === "object") {
        Object.entries(attrsObj).forEach(([k, v]) => this.setAttribute(k, v));
      }
      return this;
    };

    element.removeAttrs = function(names) {
      if (!Array.isArray(names)) names = [names];
      names.forEach(name => this.removeAttribute(name));
      return this;
    };

    element.updateAttrsValue = function(updateObj) {
      if (updateObj && typeof updateObj === "object") {
        Object.entries(updateObj).forEach(([k, v]) => {
          if (this.hasAttribute(k)) this.setAttribute(k, v);
        });
      }
      return this;
    };

    element.getAttrsValue = function(names) {
      if (!Array.isArray(names)) names = [names];
      const values = {};
      names.forEach(name => {
        values[name] = this.getAttribute(name);
      });
      return values;
    };

    element.attr = function(name, value) {
      if (value === undefined) return this.getAttribute(name);
      this.setAttribute(name, value);
      return this;
    };

    // --- Event handling ---
    element.onClick = function(fn) {
      this.addEventListener("click", fn);
      return this;
    };

    element.removeEvent = function(eventType = "click", fn) {
      if (fn) this.removeEventListener(eventType, fn);
      else this.replaceWith(this.cloneNode(true));
      return this;
    };

    // Add new: single event listener method
    element.event = function(eventName, callback) {
      if (typeof eventName === "string" && typeof callback === "function") {
        this.addEventListener(eventName, callback);
      }
      return this;
    };

    // Add multiple events via object
    element.events = function(eventObj) {
      if (eventObj && typeof eventObj === "object") {
        Object.entries(eventObj).forEach(([eventType, fn]) => {
          this.addEventListener(eventType, fn);
        });
      }
      return this;
    };

    // --- Toggle helper ---
    element.toggle = function({ initial, true: onTrue, false: onFalse }) {
      let state = initial === undefined ? false : initial;

      const toggleFn = () => {
        state = !state;
        if (state) onTrue?.call(this);
        else onFalse?.call(this);
      };

      if (state) onTrue?.call(element);
      else onFalse?.call(element);

      this.addEventListener("click", toggleFn);

      this.toggleState = () => {
        toggleFn();
        return this;
      };

      return this;
    };

    // --- Children manipulation ---
    element.removeChild = function(ids) {
      if (!Array.isArray(ids)) ids = [ids];
      ids.forEach(id => {
        const child = this.querySelector(`#${id}`);
        if (child) child.remove();
      });
      this.childrenProxy = createChildrenProxy(this);
      return this;
    };

    element.appendChild = function(children) {
      if (!children) return this;

      if (Array.isArray(children)) {
        children.forEach(child => {
          this.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
        });
      } else if (typeof children === "object") {
        Object.values(children).forEach(child => {
          this.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
        });
      } else if (typeof children === "string") {
        this.appendChild(document.createTextNode(children));
      }
      this.childrenProxy = createChildrenProxy(this);
      return this;
    };

    // --- Children proxy for nested children access ---
    element.childrenProxy = createChildrenProxy(element);

    return element;
  }

  return patchComponentMethods(el);
}

/* NAME AND USE EXAMPLE

html(value?: string): string | this
  // Get or set innerHTML.
  // Get: element.html();
  // Set: element.html("<p>Hello</p>");

removeHtml(): this
  // Clears innerHTML.
  // Usage: element.removeHtml();

removeText(): this
  // Removes only text nodes (keeps elements).
  // Usage: element.removeText();

getBackground(): CSSStyleDeclaration
  // Returns style object.
  // Usage: const style = element.getBackground();

setNewBackground(styleObj: object): this
  // Clears styles and sets new styles.
  // Usage: element.setNewBackground({ backgroundColor: "red" });

removeBackground(): this
  // Clears all inline styles.
  // Usage: element.removeBackground();

appendBackground(styleObj: object): this
  // Adds styles without removing existing ones.
  // Usage: element.appendBackground({ color: "blue" });

updateBackground(updateObj: object): this
  // Updates specific style properties.
  // Usage: element.updateBackground({ marginTop: "10px" });

background(styleObj?: object): CSSStyleDeclaration | this
  // Get current styles or assign styles.
  // Get: element.background();
  // Set: element.background({ border: "1px solid black" });

appendClass(classes: string | string[]): this
  // Adds one or more classes.
  // Usage: element.appendClass("myClass");
  // Usage: element.appendClass(["class1", "class2"]);

removeClass(classes: string | string[]): this
  // Removes one or more classes.
  // Usage: element.removeClass("myClass");
  // Usage: element.removeClass(["class1", "class2"]);

removeAllClass(): this
  // Removes all classes.
  // Usage: element.removeAllClass();

checkExistClass(classes: string | string[]): boolean
  // Checks if all classes exist on element.
  // Usage: element.checkExistClass("myClass"); // true/false

newId(newId?: string): this
  // Sets new ID or auto-generates one.
  // Usage: element.newId("customId");
  // Usage: element.newId(); // auto-generated ID

deleteId(): this
  // Removes the ID attribute.
  // Usage: element.deleteId();

setAttrs(attrsObj: object): this
  // Sets multiple attributes.
  // Usage: element.setAttrs({ title: "Tooltip", role: "button" });

removeAttrs(names: string | string[]): this
  // Removes one or more attributes.
  // Usage: element.removeAttrs("title");
  // Usage: element.removeAttrs(["title", "role"]);

updateAttrsValue(updateObj: object): this
  // Updates existing attributes only.
  // Usage: element.updateAttrsValue({ title: "New Tooltip" });

getAttrsValue(names: string | string[]): object
  // Gets values of specified attributes.
  // Usage: const vals = element.getAttrsValue(["title", "role"]);

attr(name: string, value?: string): string | this
  // Get or set single attribute.
  // Get: element.attr("title");
  // Set: element.attr("title", "New Title");

onClick(fn: function): this
  // Adds click event listener.
  // Usage: element.onClick(() => console.log("clicked"));

removeEvent(eventType?: string, fn?: function): this
  // Removes specific event listener or clones element to remove all.
  // Usage: element.removeEvent("click", handler);
  // Usage: element.removeEvent(); // removes all click events by cloning

event(eventName: string, callback: function): this
  // Adds single event listener.
  // Usage: element.event("mouseover", () => {});

events(eventObj: object): this
  // Adds multiple event listeners via object.
  // Usage: element.events({ click: fn1, mouseover: fn2 });

toggle({ initial: boolean, true: function, false: function }): this
  // Toggles between true/false states on click with callbacks.
  // Usage: element.toggle({
  //   initial: false,
  //   true() { console.log("On"); },
  //   false() { console.log("Off"); }
  // });

toggleState(): this
  // Manually toggle the toggle state.
  // Usage: element.toggleState();

removeChild(ids: string | string[]): this
  // Removes child element(s) by ID(s).
  // Usage: element.removeChild("childId");
  // Usage: element.removeChild(["id1", "id2"]);

appendChild(children: HTMLElement | string | Array): this
  // Appends child(ren), can be string or element(s).
  // Usage: element.appendChild(newDiv);
  // Usage: element.appendChild(["text", anotherDiv]);

childrenProxy: Proxy
  // Proxy to access children by their IDs.
  // Usage: element.childrenProxy.childId.html("New Text");

const el = GetViewUi("nameBt");

// Get text content
console.log(el.text());

// Set text content
el.text("Hello World!");

*/