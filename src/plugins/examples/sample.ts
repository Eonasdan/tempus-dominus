// noinspection JSUnusedGlobalSymbols

export const load = (option, tdClasses, tdFactory) => {
  // extend the picker
  // e.g. add new tempusDominus.TempusDominus(...).someFunction()
  tdClasses.TempusDominus.prototype.someFunction = (a, logger) => {
    logger = logger || console.log
    logger(a);
  }

  // extend tempusDominus
  // e.g. add tempusDominus.example()
  tdFactory.example = (a, logger) => {
    logger = logger || console.log
    logger(a);
  }

  // overriding existing API
  // e.g. extend new tempusDominus.TempusDominus(...).show()
  const oldShow = tdClasses.TempusDominus.prototype.show;
  tdClasses.TempusDominus.prototype.show = function(a, logger) {
    logger = logger || console.log
    alert('from plugin');
    logger(a);
    oldShow.bind(this)()
    // return modified result
  }
}